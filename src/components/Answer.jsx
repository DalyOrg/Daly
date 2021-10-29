const Answer = ({answer, isSelectedAnswer, setSelectedAnswer}) => {
    return (
        <button className={`btn p-3 rounded mx-auto`}
            style={{color: '#FFFFFF', backgroundColor: `${isSelectedAnswer ? '#8B008B' : ''}`, borderColor: '#8B008B'}}
            onClick={() => setSelectedAnswer(answer)}
        >
            {answer.answerText}
        </button>
    )
}

export default Answer
