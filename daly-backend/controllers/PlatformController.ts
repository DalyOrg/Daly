import { db } from "../common/firestore";
import { Platform } from "../interfaces/platform";
import { User } from "../interfaces/user";
import { UpdateUser, GetUser } from "./UserController";

export async function HelloWorld(){
  return {helloWorld: 'Hello World!'};
}

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
  
  UpdateUser({userId: userData.id, newUser: {
    ...userData,
    platformsOwned: [...userData.platformsOwned, res.id]
  }});

  //console.log(res.id)
  // check if res is fine then send a confirmation message
  return res.id;
}