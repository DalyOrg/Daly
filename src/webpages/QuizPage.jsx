import Question from '../components/Question'
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getQuiz } from '../adapters/quiz';
import { useCallback } from 'react';
import QuizResult from './QuizResult';

const QuizPage = () => {
    const {quizId} = useParams();
    const [quiz, setQuiz] = useState();
    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const initQuiz = useCallback(async function(){
        let quizObj = await getQuiz(quizId);
        setQuiz(quizObj); 
    }, [quizId])

    useEffect(() => {
        initQuiz();
    }, [initQuiz]);

    function calculateScore(){
        let sum = quiz.questions.reduce((currentSum, currentQuestion) => { 
            return currentSum +
                (currentQuestion.selectedAnswer && currentQuestion.selectedAnswer.correctAnswer ?
                    1 : 0);
        }, 0);
        return (sum * 1.0 / quiz.questions.length) * 100;
    }

    function incrementSelectedQuestion(step){
        setSelectedQuestion(selectedQuestion + step);
    }

    function setQuestion(newQuestion){
        let newQuiz = {...quiz};
        newQuiz.questions[selectedQuestion] = newQuestion;
        setQuiz(newQuiz);
    }

    return (
        <>
        {
        quiz !== undefined && showResults ?
        <QuizResult score={calculateScore()} />
        : quiz !== undefined ?
        <div className='d-flex flex-column gap-3'
            style={{
                backgroundImage: quiz.backgroundImage ? `url(${quiz.backgroundImage})` : '',
                backgroundSize: 'cover',
                height: '100vh'
            }}
        > 
            <h1 className='mx-auto' style={{color: '#FFFFFF'}}>
                {quiz.name}
            </h1>
            <div className='mx-auto' style={{color: '#FFFFFF'}}>
                <Question
                    question={quiz.questions[selectedQuestion]}
                    setQuestion={setQuestion}
                />
            </div>
            <div className='d-flex mx-auto'>
                <button className='btn btn-secondary me-3'
                    style={{color: '#FFFFFF', backgroundColor: '#00B5FF'}}
                    disabled={selectedQuestion <= 0 ? true : false}
                    onClick={
                      () => incrementSelectedQuestion(-1)
                    }
                >
                    Prev
                </button>
                <button className='btn btn-secondary'
                    style={{color: '#FFFFFF', backgroundColor: '#00B5FF'}}
                    disabled={selectedQuestion >= quiz.questions.length - 1 ? true : false}
                    onClick={
                      () => incrementSelectedQuestion(1)
                    }
                >
                    Next
                </button>
            </div>
            <button className='btn btn-primary mx-auto'
                style={{color: '#FFFFFF', backgroundColor: '#00B5FF'}}
                onClick={ () => {/* Do Attempt Logic */ setShowResults(true);} }
            >
                Submit
            </button>
        </div>
        :<span> Loading... </span>}
        </>
    );
}

export default QuizPage
