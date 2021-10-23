export async function HelloWorld(){
  return {helloWorld: 'Hello World!'};
}

interface GetQuizParams{
  quizId: string
}
export async function GetQuiz({quizId}: GetQuizParams){
    let query = `/quizzes/${quizId}`;
    let quizData = await FetchData(query);

    return quizData;
}

export async function FetchData(query: string, authToken?: string){
  return {testData: "test"} 
}
