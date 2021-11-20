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
    let body = { newQuiz: quizObject };
    let res = await axios.post(
        `/quiz`, body
    );
    console.log(res);
    return res.data;
}

async function putQuizAdapter(quiz){
    console.log(quiz);
    let body = { newQuiz: quiz };
    let res = await axios.put(`/quiz/${quiz.id}`, body)
    console.log(res);
    return res.data;
}

async function getQuizLikedAdapter(quizId){
    console.log(quizId);
    let res = await axios.get(
        `/quiz/${quizId}/liked`
    );
    console.log(res)
    return res.data; // Quiz Object
}

async function putQuizLikedAdapter(quizId, add){
    console.log(quizId);
    let body = {
        quizId: quizId,
        add: add
    }
    let res = await axios.put(
        `/quiz/${quizId}/liked`,
        body
    );
    console.log(res)
    return res.data; // Quiz Object
}

async function getQuizCommentsAdapter(quizId){
    let res = await axios.get(
        `/quiz/${quizId}/comments`
    );
    console.log(res)
    return res.data; // Quiz Object
}
async function getLeaderBoardAdapter(quizId){
    console.log(quizId);
    let res = await axios.get(
        `/quiz/${quizId}/leaderboard`
    );
    console.log(res)
    return res.data; // Quiz Object
}

async function postQuizCommentAdapter(quizId, commentText){
    let body = {
        newComment:{
            quizId: quizId,
            commentText: commentText
        }
    }
    let res = await axios.post(
        `/quiz/${quizId}/comments`,
        body
    );
    console.log(res)
    return res.data; // Quiz Object
}

export const getQuiz = wrapErrorHandling(getQuizAdapter);
export const postQuiz = wrapErrorHandling(postQuizAdapter);
export const putQuiz = wrapErrorHandling(putQuizAdapter);
export const getQuizLiked = wrapErrorHandling(getQuizLikedAdapter);
export const putQuizLiked = wrapErrorHandling(putQuizLikedAdapter);
export const getQuizComments = wrapErrorHandling(getQuizCommentsAdapter);
export const postQuizComment = wrapErrorHandling(postQuizCommentAdapter);
export const getLeaderboard = wrapErrorHandling(getLeaderBoardAdapter);
