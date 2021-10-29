import Question from '../components/Question'
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getQuiz } from '../adapters/quiz';
import { useCallback } from 'react';

const QuizPage = () => {
    const {quizId} = useParams();
    const [quiz, setQuiz] = useState();
    const [selectedQuestion, setSelectedQuestion] = useState(0);

    const initQuiz = useCallback(async function(){
        let quizObj = await getQuiz(quizId);
        setQuiz(quizObj); 
    }, [quizId])

    useEffect(() => {
        initQuiz();
    }, [initQuiz]);

    function incrementSelectedQuestion(step){
        setSelectedQuestion(selectedQuestion + step);
    }

    return (
        <>
        { quiz !== undefined ?
        <div className='d-flex flex-column gap-3'> 
            <h1 className='mx-auto'>
                {quiz.name}
            </h1>
            <div className='mx-auto'>
                <Question question={quiz.questions[selectedQuestion]} />
            </div>
            <div className='d-flex mx-auto'>
                <button className='btn btn-secondary me-3'
                    disabled={selectedQuestion <= 0 ? true : false}
                    onClick={
                      () => incrementSelectedQuestion(-1)
                    }
                >
                    Prev
                </button>
                <button className='btn btn-secondary'
                    disabled={selectedQuestion >= quiz.questions.length - 1 ? true : false}
                    onClick={
                      () => incrementSelectedQuestion(1)
                    }
                >
                    Next
                </button>
            </div>
            <button className='btn btn-primary mx-auto'>
                Submit
            </button>
        </div>
        : <span> Loading... </span>}
        </>
    );
}

export default QuizPage
