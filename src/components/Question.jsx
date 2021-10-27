import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import Answer from './Answer'

const Question = ({question, incrementSelectedQuestion, setSelectedAnswer, db, selectedQuizId}) => {  
  const [answers, setAnswers] = useState([]);

  const getAnswers = useCallback(async function() {
    const answersCol = collection(db, `/quizzes/${selectedQuizId}/questions/${question.id}/answers`);
    const answersSnapshot = await getDocs(answersCol);
    const answersList = answersSnapshot.docs.map((answer) => {
      return {...answer.data(), id: answer.id};
    });
    setAnswers(answersList);
  }, [question, selectedQuizId, db])

  useEffect(() => {
    getAnswers()
  }, [getAnswers]);

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
          <div className='d-flex flex-column gap-3'>
              {
                  answers.map((answer) =>
                    <Answer
                      answer={answer}
                      questionId={question.id}
                      setSelectedAnswer={setSelectedAnswer}
                    />
                  )
              }
          </div>
          <div className='d-flex mx-auto'>
            <button className='btn btn-secondary me-3'
              onClick={
                () => incrementSelectedQuestion(-1)
              }
            >
              Prev
            </button>
            <button className='btn btn-secondary'
              onClick={
                () => incrementSelectedQuestion(1)
              }
            >
              Next
            </button>
          </div>
      </div>
  )
}

export default Question
