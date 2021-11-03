import { db } from "../common/firestore";

export async function HelloWorld(){
  return {helloWorld: 'Hello World!'};
}

interface GetPlatformParams{
  platformId: string
}
export async function GetPlatform({platformId}: GetPlatformParams){
  console.log(platformId)
  const quizDoc = await db.collection(`platforms`).doc(platformId).get();

  return quizDoc.data();
}