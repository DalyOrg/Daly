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

const QuizResult = ({quiz, setQuiz}) => {
    function calculateScore(){
        let sum = quiz.questions.reduce((currentSum, currentQuestion) => { 
            return currentSum +
                (currentQuestion.selectedAnswer && currentQuestion.selectedAnswer.correctAnswer ?
                    1 : 0);
        }, 0);
        return (sum * 1.0 / quiz.questions.length) * 100;
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
                <LikeButton
                    quiz={quiz}
                    setQuiz={setQuiz}
                />
            </div>
        </div>
        
    )
}

export default QuizResult
