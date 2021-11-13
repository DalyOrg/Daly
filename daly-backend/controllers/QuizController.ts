import { db } from "../common/firestore";
import { Platform } from "../interfaces/platform";
import { Quiz } from "../interfaces/quiz";
import { Subscriptions } from "../interfaces/subscriptions";
import { User } from "../interfaces/user";
import { getData } from "./DatabaseController";
import { GetPlatform } from "./PlatformController";
import { GetUserLikes, UpdateUserLikes, UpdateUserSubscriptionFeed } from "./UserController";

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
  const res = await db.collection(`quizzes`).add(newQuiz);

  // push the quiz to the subscription feed
  let platformData = await GetPlatform({platformId: newQuiz.platformId}) as Platform;
  let subscriptions = await getData('subscriptions', platformData.subscribersId) as Subscriptions;
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
