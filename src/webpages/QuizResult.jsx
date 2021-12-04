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

const QuizResult = ({quiz, setQuiz, score, badgesEarned, time, isLoggedIn}) => {
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
            <div className='mx-auto'>
                <LikeButton
                    quiz={quiz}
                    setQuiz={setQuiz}
                />
            </div>
            </>
            }
            { /*store && store.userInfo &&
            <div className='mx-auto'>
                <button className='btn btn-secondary'
                    style={{color: '#FFFFFF', backgroundColor: '#1C7947', width: "10rem"}}
                    disabled={!submitReady}
                    onClick={submitAttempt}
                >
                    Submit Attempt
                </button>
            </div>
            */}
        </div>
        
    )
}

export default QuizResult
