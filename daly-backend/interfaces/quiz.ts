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
    creator: string
    leaderboardId: string
    commentsId: string
    backgroundImage: string // url
    cssSettings: {
        fontFamily: string
        fontSize: string
        color: string
    }
}