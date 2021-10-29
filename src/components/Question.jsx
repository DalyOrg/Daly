import Answer from './Answer'

const Question = ({question}) => {  

  function setSelectedAnswer(){

  }

  return (
      <div className='d-flex flex-column gap-3'>
          <h3>
              {question.questionText}
          </h3>
          {
            question.imageUrl &&
            <img className='mx-auto'
              src={question.imageUrl}
              alt={question.questionText}
            />
          }
          <div className='d-flex flex-column gap-3 mx-auto'>
              {
                  question.answers.map((answer) =>
                    <Answer
                      answer={answer}
                      questionId={question.id}
                      setSelectedAnswer={setSelectedAnswer}
                    />
                  )
              }
          </div>
      </div>
  )
}

export default Question
