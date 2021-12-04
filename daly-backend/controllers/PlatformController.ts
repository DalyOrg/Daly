import { db } from "../common/firestore";
import { Platform } from "../interfaces/platform";
import { User } from "../interfaces/user";
import { getData, postData } from "./DatabaseController";
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

  await UpdateUser({userId: userData.id, newUser: {
    platformsOwned: [...userData.platformsOwned, resId]
  }});

  return resId;
}

interface DeletePlatformParams{
  platformId: string
  user: User
}
export async function DeletePlatform({platformId, user}: DeletePlatformParams){
      var platformQuery = await GetPlatform({platformId}) as Platform;
      if(user.id !== platformQuery.ownerId){
        return{message: "Not platform owner!"};
      }
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
