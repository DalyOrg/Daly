import axios from 'axios';
import { wrapErrorHandling } from './common';

async function getQuizAdapter(quizId){
    let res = await axios.get(
        `/quiz/${quizId}`
    );
    return res.data; // Quiz Object
}

async function postQuizAdapter(quizObject){
    let body = { newQuiz: quizObject };
    let res = await axios.post(
        `/quiz`, body
    );
    return res.data;
}

async function putQuizAdapter(quiz){
    let body = { newQuiz: quiz };
    let res = await axios.put(`/quiz/${quiz.id}`, body)
    return res.data;
}

async function getQuizLikedAdapter(quizId){
    let res = await axios.get(
        `/quiz/${quizId}/liked`
    );
    return res.data; // Quiz Object
}

async function putQuizLikedAdapter(quizId, add){
    let body = {
        quizId: quizId,
        add: add
    }
    let res = await axios.put(
        `/quiz/${quizId}/liked`,
        body
    );
    return res.data; // Quiz Object
}

async function getQuizCommentsAdapter(quizId){
    let res = await axios.get(
        `/quiz/${quizId}/comments`
    );
    return res.data; // Quiz Object
}
async function getLeaderBoardAdapter(quizId){
    let res = await axios.get(
        `/quiz/${quizId}/leaderboard`
    );
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
    return res.data; // Quiz Object
}

async function submitQuizAttemptAdapter(quizId, timeLeft, score){
    let body = {
        newAttempt: {
            time: timeLeft,
            score: score
        }
    }
    let res = await axios.post(
        `/quiz/${quizId}/leaderboard/attempt`,
        body
    );
    return res.data; // Quiz Object
}

async function deleteQuizAdapter(quizId){
    try{
        let body = { quizId:quizId };
        let res = await axios.delete(
            `/quiz/${quizId}`, body
        );
    }catch(err){
    }
}

export const deleteQuiz = wrapErrorHandling(deleteQuizAdapter);
export const getQuiz = wrapErrorHandling(getQuizAdapter);
export const postQuiz = wrapErrorHandling(postQuizAdapter);
export const putQuiz = wrapErrorHandling(putQuizAdapter);
export const getQuizLiked = wrapErrorHandling(getQuizLikedAdapter);
export const putQuizLiked = wrapErrorHandling(putQuizLikedAdapter);
export const getQuizComments = wrapErrorHandling(getQuizCommentsAdapter);
export const postQuizComment = wrapErrorHandling(postQuizCommentAdapter);
export const getLeaderboard = wrapErrorHandling(getLeaderBoardAdapter);
export const submitQuizAttempt = wrapErrorHandling(submitQuizAttemptAdapter);
