import { db } from "../common/firestore";

export async function HelloWorld(){
  return {helloWorld: 'Hello World!'};
}

interface GetQuizParams{

}

export async function GetQuiz({quizId}){
  console.log(quizId)
  const quizDoc = await db.collection(`quizzes`).doc(quizId).get();

  return quizDoc.data();
}

export async function FetchData(query: any, authToken?: string){
  return {testData: "test"} 
}
