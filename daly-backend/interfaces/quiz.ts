import { Timestamp } from "firebase-admin/firestore";

export interface Quiz{
    name: string
    questions: {
        questionText: string
        answers: {
            answerText: string
            correctAnswer: boolean
        }
        imageUrl: string
    }[]
    likes: number
    timestamp: Timestamp
    timeLimitSeconds: number
    categories: string[]
    platformId: string
    leaderboardId: string
    commentsId: string
    backgroundImage: string // url
    cssSettings: {
        fontFamily: string
        fontSize: string
        color: string
    }
}

export interface Attempt{
    userId: string
    timestamp: Timestamp
    time: number
    score: number
}

export interface Leaderboard{
    rankings: Attempt[]
}

export interface Comment{
    userId: string
    commentText: string
    timestamp: Timestamp
}

export interface QuizComments{
    comments: Comment[]
}
