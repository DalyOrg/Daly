import { db } from "../common/firestore";
import { Platform } from "../interfaces/platform";
import { User } from "../interfaces/user";
import { UpdateUser, GetUser } from "./UserController";

interface GetPlatformParams{
  platformId: string
}
export async function GetPlatform({platformId}: GetPlatformParams){
  console.log(platformId)
  const platformDoc = await db.collection(`platforms`).doc(platformId).get();
  let ret = platformDoc.data();
  ret.id = platformDoc.id;

  return ret;
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
  const subRes = await db.collection(`subscriptions`).add(newSubscriptions);
  let subId = (await subRes.get()).id;

  newPlatform.subscribersId = subId;

  const res = await db.collection(`platforms`).add(newPlatform);
  let resId = (await res.get()).id;

  console.log(userData.platformsOwned, resId)

  await UpdateUser({userId: userData.id, newUser: {
    platformsOwned: [...userData.platformsOwned, resId]
  }});

  //console.log(res.id)
  // check if res is fine then send a confirmation message
  return resId;
}

interface DeletePlatformParams{
  platformId: string
  user: User
}
export async function DeletePlatform({platformId, user}: DeletePlatformParams){
      var platformQuery = await GetPlatform({platformId}) as Platform;
      // if(user.id !== platformQuery.ownerId){
      //   return{message: "Not platform owner!"};
      // }
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
