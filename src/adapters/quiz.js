import axios from 'axios';
import wrapErrorHandling from './common';

async function getQuizAdapter(quizId){
    let res = await axios.get(
        `/quiz/${quizId}`
    );
    return res.data; // Quiz Object
}

export const getQuiz = wrapErrorHandling(getQuizAdapter)
