import { db } from "../common/firestore";
import { Platform } from "../interfaces/platform";
import { Quiz, Attempt, Leaderboard } from "../interfaces/quiz";
import { Subscriptions } from "../interfaces/subscriptions";
import { User } from "../interfaces/user";
import { getData, postData, updateData } from "./DatabaseController";
import { GetPlatform } from "./PlatformController";
import { GetUser, GetUserLikes, UpdateUserLikes, UpdateUserSubscriptionFeed } from "./UserController";

export async function HelloWorld(){
  return {helloWorld: 'Hello World!'};
}

interface GetQuizParams{
  quizId: string
}
export async function GetQuiz({quizId}: GetQuizParams){
  console.log(quizId)
  const quizDoc = await db.collection(`quizzes`).doc(quizId).get();
  let ret = quizDoc.data();
  ret.id = quizDoc.id;

  return ret;
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
  return {message: 'Likes Updated', newLikes: newLikes }
}

interface GetLeaderboardParams{
  quizId: string
}
export async function GetLeaderboard({quizId}: GetLeaderboardParams){
  let quizData = await GetQuiz({quizId}) as Quiz;
  let leaderboard = await getData('leaderboards', quizData.leaderboardId) as Leaderboard;
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
        if(a.score > b.score)
          return 1;
        if(b.score > a.score)
          return -1;
        if(a.time < b.score)
          return 1;
        if(b.time < a.time)
          return -1;
        return 0;
      }); // could be faster with insertion sort
      updateData('leaderboards', quizData.leaderboardId, {rankings: newRankings});
    }
  }
  else{
    // insert new attempt
    let newRankings = leaderboard.rankings;
    newRankings.push(newAttempt);
    newRankings.sort((a, b) => {
      if(a.score > b.score)
        return 1;
      if(b.score > a.score)
        return -1;
      if(a.time < b.score)
        return 1;
      if(b.time < a.time)
        return -1;
      return 0;
    }); // could be faster with insertion sort
    updateData('leaderboards', quizData.leaderboardId, {rankings: newRankings});
  }
  return {message: 'Attempt received'}
}

