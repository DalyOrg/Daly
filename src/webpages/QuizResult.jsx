/*
    Attempt Object Schema:
    {
        userId: string // optional; user does not need to send attempt if they are not logged in
        attemptNumber: int // for the backend to generate
        timeStamp: Timestamp // for the backend to generate
        time: int (seconds) // for the backend to generate? or maybe do it on the front-end
        score: float
    }
*/

import { useState } from "react";
import { useCallback } from "react";
import { submitQuizAttempt } from "../adapters/quiz";
import LikeButton from "../components/LikeButton";
import { useGlobalStore } from "../store/useGlobalStore";

const QuizResult = ({quiz, setQuiz, time}) => {
    const [store] = useGlobalStore()
    const [submitReady, setSubmitReady] = useState(true);

    function calculateScore(){
        let sum = quiz.questions.reduce((currentSum, currentQuestion) => { 
            return currentSum +
                (currentQuestion.selectedAnswer && currentQuestion.selectedAnswer.correctAnswer ?
                    1 : 0);
        }, 0);
        return (sum * 1.0 / quiz.questions.length) * 100;
    }

    async function submitAttempt(){
        if(store && store.userInfo){
            setSubmitReady(false)
            await submitQuizAttempt(quiz.id, time, calculateScore());
        }
    }

    return (
        
        <div className='d-flex flex-column gap-3'
            style={{
                marginTop: "15rem",
                textAlign: "center",
                height: "80vh"

            }}
        > 
            <h1 className='mx-auto'
                style={{color: '#FFFFFF'}}
            >
                Congratulations!
            </h1>
            <div className='mx-auto'>
                <span
                    style={{color: '#FFFFFF'}}
                >
                    Your score was: {calculateScore()}%
                </span>
            </div>
            <div className='mx-auto'>
                <span
                    style={{color: '#FFFFFF'}}
                >
                    Your time was: {`${parseInt((time / 60), 10)}:${(time % 60).toLocaleString('en-US', {minimumIntegerDigits: 2})}`} / {`${parseInt((quiz.timeLimitSeconds / 60), 10)}:${(quiz.timeLimitSeconds % 60).toLocaleString('en-US', {minimumIntegerDigits: 2})}`}
                </span>
            </div>
            <div className='mx-auto'>
                <LikeButton
                    quiz={quiz}
                    setQuiz={setQuiz}
                />
            </div>
            { store && store.userInfo &&
            <div className='mx-auto'>
                <button className='btn btn-secondary'
                    style={{color: '#FFFFFF', backgroundColor: '#1C7947', width: "10rem"}}
                    disabled={!submitReady}
                    onClick={submitAttempt}
                >
                    Submit Attempt
                </button>
            </div>
            }
        </div>
        
    )
}

export default QuizResult
