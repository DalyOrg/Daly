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

import LikeButton from "../components/LikeButton";
import { useState } from "react";
import { MDBBtn } from 'mdb-react-ui-kit';
import { FlagFill } from "react-bootstrap-icons";
import ReportModal from "../components/ReportModal";

const QuizResult = ({quiz, setQuiz, score, badgesEarned, time, isLoggedIn}) => {
    const [reportMetadata, setReportMetadata] = useState();

    function getMessage(){
        if(score <= 25){
            return `You'll get it next time!`
        }
        else if(score <= 50){
            return `Try, try, again!`
        }
        else if(score <= 75){
            return `Well done!`
        }
        else if(score <= 100){
            return `Congratuations!`
        }
        else{
            return `You are hacking.`
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
                {getMessage()}
            </h1>
            <div className='mx-auto'>
                <span
                    style={{color: '#FFFFFF'}}
                >
                    Your score was: {score}%
                </span>
            </div>
            <div className='mx-auto'>
                <span
                    style={{color: '#FFFFFF'}}
                >
                    Your time was: {`${parseInt((time / 60), 10)}:${(time % 60).toLocaleString('en-US', {minimumIntegerDigits: 2})}`} / {`${parseInt((quiz.timeLimitSeconds / 60), 10)}:${(quiz.timeLimitSeconds % 60).toLocaleString('en-US', {minimumIntegerDigits: 2})}`}
                </span>
            </div>
            { isLoggedIn &&
            <>
            <div className='mx-auto'>
                <span
                    style={{color: '#FFFFFF'}}
                >
                    You earned {badgesEarned} badges!
                </span>
            </div>
            <div className='mx-auto d-flex gap-3'>
                <LikeButton
                    quiz={quiz}
                    setQuiz={setQuiz}
                />
                <MDBBtn rounded style={{color: "white", backgroundColor: "red", marginBottom: "10px"}}
                    data-bs-toggle="modal" data-bs-target="#reportModal"
                    onClick={() => setReportMetadata({
                        type: 'quiz', quizId: quiz.id
                    })}
                >
                    <FlagFill />
                </MDBBtn> 
            </div>
            <ReportModal
                reasons={['Offensive Language', 'Mistake In Question/Answer', 'Other']}
                metadata={reportMetadata}
            />
            </>
            }
        </div>
        
    )
}

export default QuizResult
