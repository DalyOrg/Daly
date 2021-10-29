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

export const getQuiz = wrapErrorHandling(getQuizAdapter)
