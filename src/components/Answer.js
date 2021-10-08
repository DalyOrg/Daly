const Answer = ({answer, setSelectedAnswer, questionId}) => {
    return (
        <div>
            <input type="radio" className="btn-check" name={questionId} id={`answer${answer.id}`} autoComplete="off"
                onClick={() => setSelectedAnswer(answer)}/>
            <label className="btn btn-outline-primary" htmlFor={`answer${answer.id}`}>
                {answer.answerText}
            </label>
        </div>
    )
}

export default Answer
