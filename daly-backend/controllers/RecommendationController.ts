import { db } from "../common/firestore";


export async function GetTrendingFeed(){
    let trendingQuizes = await db.collection('quizzes').orderBy('likes', 'desc').limit(25).get();
    let quizObjs = trendingQuizes.docs.map((quiz) => { return {...quiz.data(), id: quiz.id} });
    return {feed: quizObjs};
}