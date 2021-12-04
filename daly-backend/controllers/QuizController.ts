import { db } from "../common/firestore";
import { Platform } from "../interfaces/platform";
import { Quiz, Attempt, Leaderboard, QuizComments, Comment } from "../interfaces/quiz";
import { Subscriptions } from "../interfaces/subscriptions";
import { User } from "../interfaces/user";
import { getData, postData, updateData } from "./DatabaseController";
import { GetPlatform } from "./PlatformController";
import { GetUser, GetUserLikes, UpdateUserLikes, UpdateUserSubscriptionFeed } from "./UserController";
import admin from 'firebase-admin';

interface GetQuizParams{
  quizId: string
}
export async function GetQuiz({quizId}: GetQuizParams): Promise<Quiz>{
  let quizData = await getData(`quizzes`, quizId);

  return quizData;
}

interface CreateQuizParams{
  newQuiz: Quiz
}
export async function CreateQuiz({newQuiz}: CreateQuizParams){
  console.log(newQuiz);

  // create new leaderboard
  let newLeaderboard = {
    rankings: []
  }
  let leaderboardId = await postData('leaderboards', newLeaderboard);
  newQuiz.leaderboardId = leaderboardId;

  // create new comments
  let newComments = {
    comments: []
  }
  let commentsId = await postData('comments', newComments);
  newQuiz.commentsId = commentsId;

  const res = await db.collection(`quizzes`).add(newQuiz);

  // push the quiz to the subscription feed
  let platformData = await GetPlatform({platformId: newQuiz.platformId}) as Platform;
  let subscriptions = await getData('subscriptions', platformData.subscribersId) as Subscriptions;
  console.log(subscriptions)
  for(let subscription of subscriptions.subscriptions){
    UpdateUserSubscriptionFeed({ // don't await
      newQuizId: res.id,
      add: true,
      user: {id: subscription} as User
    })
  }

  //put quiz in platform quiz list
  const platRes = await db.collection(`platforms`).doc(newQuiz.platformId).update("quizzes", [...platformData.quizzes, res.id]);

  //console.log(res.id)
  // check if res is fine then send a confirmation message
  return res.id;
}

interface UpdateQuizParams{
  quizId: string
  newQuiz: Quiz
}
export async function UpdateQuiz({quizId, newQuiz}: UpdateQuizParams){
  console.log(newQuiz);
  const res = await db.collection(`quizzes`).doc(quizId).set(newQuiz);

  console.log(res)
  // check if res is fine then send a confirmation message
  return { message: 'Quiz Updated' };
}

interface GetQuizLikedParams{
  quizId: string
  user: User
}
export async function GetQuizLiked({quizId, user}: GetQuizLikedParams){
  let likeObj: any = await GetUserLikes({user});
  console.log(likeObj)
  if(likeObj.likes){
    return {isLiked: likeObj.likes.includes(quizId)}
  }
  else{
    let err: StdError = {
        status: 404,
        message: `Your account does not support likes.`
    };
    throw err;
  }
}

interface UpdateQuizLikedParams{
  quizId: string
  add: boolean
  user: User
}
export async function UpdateQuizLiked({quizId, add, user}: UpdateQuizLikedParams){
  // How do we solve race condition?
  await UpdateUserLikes({quizId, add, user});
  let quizData = await GetQuiz({quizId});
  let newLikes = add ? quizData.likes + 1 : quizData.likes - 1;
  const res = await db.collection(`quizzes`).doc(quizId).update({
    likes: newLikes
  });
  return {message: 'Likes Updated', newLikes: newLikes };
}

interface GetLeaderboardParams{
  quizId: string
}
export async function GetLeaderboard({quizId}: GetLeaderboardParams): Promise<Leaderboard>{
  let quizData = await GetQuiz({quizId});
  let leaderboard = await getData('leaderboards', quizData.leaderboardId);
  return leaderboard;
}

interface SubmitAttemptParams{
  quizId: string
  newAttempt: Attempt
  user: User
}
export async function SubmitAttempt({quizId, newAttempt, user}: SubmitAttemptParams){
  let userData = await GetUser({user}) as User;
  newAttempt.userId = userData.id;
  newAttempt.timestamp = admin.firestore.Timestamp.now();
  let quizData = await GetQuiz({quizId}) as Quiz;

  let leaderboard = await getData('leaderboards', quizData.leaderboardId) as Leaderboard;
  let prevAttempt = leaderboard.rankings.find((attempt) => attempt.userId == user.id);
  if(prevAttempt){
    if(newAttempt.score > prevAttempt.score
        || (newAttempt.score == prevAttempt.score
          && newAttempt.time < prevAttempt.time)){
      // update rankings
      let newRankings = leaderboard.rankings.filter((attempt) => attempt.userId != user.id);
      newRankings.push(newAttempt);
      newRankings.sort((a, b) => {
        if(a.score < b.score)
          return 1;
        if(b.score < a.score)
          return -1;
        if(a.time > b.time)
          return 1;
        if(b.time > a.time)
          return -1;
        return 0;
      }); // could be faster with binary search insertion
      updateData('leaderboards', quizData.leaderboardId, {rankings: newRankings}); // don't await for speed
    }
  }
  else{
    // insert new attempt
    let newRankings = leaderboard.rankings;
    newRankings.push(newAttempt);
    newRankings.sort((a, b) => {
      if(a.score < b.score)
        return 1;
      if(b.score < a.score)
        return -1;
      if(a.time > b.time)
        return 1;
      if(b.time > a.time)
        return -1;
      return 0;
    }); // could be faster with binary search insertion
    updateData('leaderboards', quizData.leaderboardId, {rankings: newRankings}); // don't await for speed
  }

  // check if this user is the quiz owner
  if(userData.platformsOwned.includes(quizData.platformId)){
    return {badgesEarned: 0, message: `You can't earn badges from your own quiz, silly!`}
  }

  // reward badges to the user proportional to their improvement
  let badgesEarned = 0
  if(prevAttempt === undefined){ // score based on the lowest possible
    prevAttempt = {score: 0, time: quizData.timeLimitSeconds, userId: null, timestamp: null}
  }
  let scoreImprovement = (newAttempt.score - prevAttempt.score) / 100; // proportion of score improvement
  scoreImprovement = scoreImprovement < 0 ? 0 : scoreImprovement;
  let timeImprovement = (prevAttempt.time - newAttempt.time) / quizData.timeLimitSeconds; // proportion of time improvement
  timeImprovement = timeImprovement < 0 ? 0 : timeImprovement;
  badgesEarned = Math.ceil(scoreImprovement * 20) + Math.ceil(timeImprovement * 10); // badges earned proportional to max badges earnable

  await updateData('users', userData.id, {badges: userData.badges + badgesEarned}) // wait to ensure parity with user

  return {badgesEarned}
}

interface GetCommentsParams{
  quizId: string
}
export async function GetComments({quizId}: GetCommentsParams){
  let quizData = await GetQuiz({quizId}) as Quiz;
  let commentsData = await getData('comments', quizData.commentsId) as QuizComments;
  return commentsData;
}

interface PostCommentParams{
  quizId: string
  newComment: Comment
  user: User
}
export async function PostComment({quizId, newComment, user}: PostCommentParams){
  newComment.userId = user.id;
  newComment.timestamp = admin.firestore.Timestamp.now();
  let quizData = await GetQuiz({quizId}) as Quiz;
  let commentsData = await getData('comments', quizData.commentsId) as QuizComments;
  await updateData('comments', quizData.commentsId, {
    comments: [newComment, ...commentsData.comments]
  })
  return {message: 'Comment Created'}
}

interface DeleteQuizParams{
  quizId: string
  user: User
}
export async function DeleteQuiz({quizId, user}: DeleteQuizParams){
      var quizQuery = await GetQuiz({quizId}) as Quiz;
      var platformQuery = await GetPlatform({platformId: quizQuery.platformId}) as Platform;
      var tempQuiz = [...platformQuery.quizzes];
      var deleteIndex = tempQuiz.indexOf(quizId);
      if (deleteIndex > -1) {
        tempQuiz.splice(deleteIndex, 1);
      }
      const platRes = await db.collection(`platforms`).doc(quizQuery.platformId).update("quizzes", tempQuiz);
      const quizDelete = await db.collection(`quizzes`).doc(quizId).delete();
      return {message:"quiz deleted!"};
}
