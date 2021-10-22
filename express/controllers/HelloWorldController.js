export async function HelloWorld(){
  return 'Hello World!';
}

export async function GetQuiz({quizId}){
    let query = `/quizzes/${quizId}`;
    let quizData = FetchData(query);

    // clean it up
    quizData.funny = 'yes';

    return quizData;
}

export async function FetchData(query, authToken){
}
