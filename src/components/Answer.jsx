const Answer = ({answer, isSelectedAnswer, setSelectedAnswer}) => {
    return (
        <button className={`btn p-3 rounded mx-auto`}
            style={{fontSize: "15px",fontWeight: "bold" ,color: '#FFFFFF', backgroundColor: `${isSelectedAnswer ? '#FFB085' : ''}`, borderColor: '#FFB085'}}
            onClick={() => setSelectedAnswer(answer)}
        >
            {answer.answerText}
        </button>
    )
}

export default Answer
