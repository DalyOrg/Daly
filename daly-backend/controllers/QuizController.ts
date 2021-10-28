import { db } from "../common/firestore";
import { Quiz } from "../interfaces/quiz";

export async function HelloWorld(){
  return {helloWorld: 'Hello World!'};
}

interface GetQuizParams{
  quizId: string
}

export async function GetQuiz({quizId}: GetQuizParams){
  console.log(quizId)
  const quizDoc = await db.collection(`quizzes`).doc(quizId).get();

  return quizDoc.data();
}

interface CreateQuizParams{
  newQuiz: Quiz
}
export async function CreateQuiz({newQuiz}){
  console.log(newQuiz);
  const res = await db.collection(`quizzes`).add(newQuiz);

  console.log(res)
  // check if res is fine then send a confirmation message
  return { message: 'Quiz Created' };
}
