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

const QuizResult = ({score}) => {
    return (
        <div className='d-flex flex-column gap-3'> 
            <h1 className='mx-auto'>
                Congratulations!
            </h1>
            <div className='mx-auto'>
                <span>Your score was: {score}%</span>
            </div>
        </div>
    )
}

export default QuizResult
