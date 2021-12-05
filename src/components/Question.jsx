import Answer from './Answer'

const Question = ({question, setQuestion}) => {  

  function setSelectedAnswer(answer){
    setQuestion({...question, selectedAnswer: answer});
  }

  return (
      <div className='d-flex flex-column gap-3'>
          <h3>
              {question.questionText}
          </h3>
          {
            question.imageUrl &&
            <img className="mx-auto" height="300"
              src={question.imageUrl}
              alt={question.questionText}
            />
          }
          <div className='d-flex flex-column gap-3 mx-auto'>
              {
                  question.answers.map((answer) =>
                    <Answer
                      answer={answer}
                      isSelectedAnswer={question.selectedAnswer === answer}
                      setSelectedAnswer={setSelectedAnswer}
                    />
                  )
              }
          </div>
      </div>
  )
}

export default Question
