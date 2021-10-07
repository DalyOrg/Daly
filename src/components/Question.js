import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore/lite';

import Answer from './Answer'

//parameters are the required variables and functions from the main component
const Question = ({questionNum, totalNumQuestions, question, changeQuestionNum, setAnswerChoices, db, quizId}) => {  
  const [answers, setAnswers] = useState([]);

  const getAnswers = useCallback(async function() {
    if(question === undefined || quizId === undefined){
        return;
    }
    const answersCol = collection(db, `/quizzes/${quizId}/questions/${question.id}/answers`);
    const answersSnapshot = await getDocs(answersCol);
    const answersList = answersSnapshot.docs.map((answer) => {
      return {...answer.data(), id: answer.id};
    });
    setAnswers(answersList);
  }, [question, quizId, db])

  useEffect(() => {
    getAnswers()
  }, [getAnswers]);

  return (
      <div className='d-flex flex-column gap-3'>
          <h3>
              {question.questionText}
          </h3><br/>
          {
            question.imageUrl &&
            <img className='mx-auto'
              src={question.imageUrl}
              alt="{question.questionText}"
            />
          }
          <div className='d-flex flex-column gap-3'>
              {
                  //TODO: fill in answers choices
                  answers.map((answer) =>
                    <Answer
                      answer={answer}
                      questionId={question.id}
                      setAnswerChoices={setAnswerChoices}
                    />
                  )
              }
          </div>
          <div className='d-flex mx-auto'>
            {
                questionNum !== 0 ?
                <button className='btn btn-secondary' onClick={() => changeQuestionNum(-1)}> Previous </button>
                : ""
            }
            {//TODO: add in buttons
                questionNum === (totalNumQuestions-1) ? //if we are at the last question
                <button className='btn btn-secondary' onClick={() => changeQuestionNum(1)}> Submit </button>
                : 
                <button className='btn btn-secondary' onClick={() => changeQuestionNum(1)}> Next </button>
            }
          </div>
      </div>
  )
}

export default Question