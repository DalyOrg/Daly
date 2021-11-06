import { db } from "../common/firestore";

export async function HelloWorld(){
  return {helloWorld: 'Hello World!'};
}

interface GetPlatformParams{
  platformId: string
}
export async function GetPlatform({platformId}: GetPlatformParams){
  console.log(platformId)
  const platformDoc = await db.collection(`platforms`).doc(platformId).get();
  let ret = platformDoc.data()
  ret.id = platformDoc.id

  return ret;
}