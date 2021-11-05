import axios from 'axios';
import { wrapErrorHandling } from './common';

async function getQuizAdapter(quizId){
    console.log(quizId);
    let res = await axios.get(
        `/quiz/${quizId}`
    );
    console.log(res)
    return res.data; // Quiz Object
}


async function postQuizAdapter(quizObject){
    console.log(quizObject);
    let res = await axios.post(
        `/quiz`, quizObject
    );
    console.log(res);
    return res.data.id;
}

export const getQuiz = wrapErrorHandling(getQuizAdapter);
export const postQuiz = wrapErrorHandling(postQuizAdapter);
