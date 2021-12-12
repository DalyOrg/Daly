import { db } from "../common/firestore";
import { Platform } from "../interfaces/platform";
import { User } from "../interfaces/user";
import { getData, postData } from "./DatabaseController";
import { DeleteQuiz } from "./QuizController";
import { UpdateUser, GetUser } from "./UserController";

interface GetPlatformParams{
  platformId: string
}
export async function GetPlatform({platformId}: GetPlatformParams): Promise<Platform>{
  return await getData(`platforms`, platformId);
}

interface CreatePlatformParams{
  newPlatform: Platform
  user: User
}
export async function CreatePlatform({newPlatform, user}: CreatePlatformParams){
  let userData = await GetUser({user}) as User;

  const newSubscriptions = {
    subscriptions: []
  }
  const subId = await postData(`subscriptions`, newSubscriptions);

  newPlatform.subscribersId = subId;

  const resId = await postData(`platforms`, newPlatform);

  console.log(userData.platformsOwned, resId)

  await UpdateUser({newUser: {
    platformsOwned: [...userData.platformsOwned, resId]
    // @ts-ignore
  }, user: {id: userData.id}});

  return resId;
}

interface DeletePlatformParams{
  platformId: string
  user: User
}
interface Subscriptions{
  id: string
  subscriptions: string[]
}
export async function DeletePlatform({platformId, user}: DeletePlatformParams){
      var platformQuery = await GetPlatform({platformId}) as Platform;
      if(user.id !== platformQuery.ownerId){
        return{message: "Not platform owner!"};
      }

      //unsubscribe all users
      var subQuery = (await db.collection(`subscriptions`).doc(platformQuery.subscribersId).get()).data() as Subscriptions;
      for(var i=0; i<subQuery.subscriptions.length; i++){
        var userQuery = (await db.collection(`users`).doc(subQuery.subscriptions[i]).get()).data() as User;
        var tempSub = [...userQuery.subscribedPlatforms];
        var deleteIndex = tempSub.indexOf(platformId);
        if (deleteIndex > -1) {
          tempSub.splice(deleteIndex, 1);
        }
        await db.collection(`users`).doc(subQuery.subscriptions[i]).update("subscribedPlatforms", tempSub);
      }

      //delete existing quizzes
      for(var i = 0; i<platformQuery.quizzes.length; i++){
        await DeleteQuiz({quizId:platformQuery.quizzes[i], user:user});
      }
      //delete platform from owner list
      var userQuery = await GetUser({user: user}) as User;
      var tempPlatform = [...userQuery.platformsOwned];
      var deleteIndex = tempPlatform.indexOf(platformId);
      if (deleteIndex > -1) {
        tempPlatform.splice(deleteIndex, 1);
      }
      const userRes = await db.collection(`users`).doc(user.id).update("platformsOwned", tempPlatform);
      const platformDelete = await db.collection(`platforms`).doc(platformId).delete();
      return {message:"platform deleted!"};
}

interface PutPlatformBannerParams{
  platformId: string
  platformBanner: string
  user: User
}
export async function PutPlatformBanner({platformId, platformBanner, user}: PutPlatformBannerParams){
    var platformQuery = await GetPlatform({platformId}) as Platform;
      if(user.id !== platformQuery.ownerId){
        return{message: "Not platform owner!"};
      }
    const platformUpdate = await db.collection(`platforms`).doc(platformId).update("platformBanner", platformBanner);
    return {message:"platform banner updated!"};
}

interface PutPlatformPicParams{
  platformId: string
  platformPic: string
  user: User
}
export async function PutPlatformPic({platformId, platformPic, user}: PutPlatformPicParams){
    var platformQuery = await GetPlatform({platformId}) as Platform;
      if(user.id !== platformQuery.ownerId){
        return{message: "Not platform owner!"};
      }
    const platformUpdate = await db.collection(`platforms`).doc(platformId).update("platformPicture", platformPic);
    return {message:"platform pic updated!"};
}

interface PutPlatformNameParams{
  platformId: string
  name: string
  user: User
}
export async function PutPlatformName({platformId, name, user}: PutPlatformNameParams){
    var platformQuery = await GetPlatform({platformId}) as Platform;
      if(user.id !== platformQuery.ownerId){
        return{message: "Not platform owner!"};
      }
    const platformUpdate = await db.collection(`platforms`).doc(platformId).update("name", name);
    return {message:"platform name updated!"};
}