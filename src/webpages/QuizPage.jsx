import Question from '../components/Question'
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getQuiz, submitQuizAttempt } from '../adapters/quiz';
import { useCallback } from 'react';
import QuizResult from './QuizResult';
import { Opacity } from '@mui/icons-material';

const QuizPage = () => {
    const {quizId} = useParams();
    const [timer, setTimer] = useState();
    const [quiz, setQuiz] = useState();
    const [time, setTime] = useState(0);
    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);


    async function countDown(){
        if(!showResults){
            setTime((prevTime) => prevTime + 1);
        }
    }

    const submitAttempt = useCallback(async function(){
        clearInterval(timer);
        setShowResults(true);
    }, [timer])

    useEffect(() => {
        if(quiz && time >= quiz.timeLimitSeconds){
            // auto submit
            submitAttempt();
        }
    }, [quiz, time, submitAttempt])

    const startTimer = useCallback(async function(){
        setTimer(setInterval(countDown, 1000));
    }, [setTimer, setInterval])

    const initQuiz = useCallback(async function(){
        let quizObj = await getQuiz(quizId);
        setQuiz(quizObj); 
        startTimer();
    }, [quizId]);

    useEffect(() => {
        initQuiz();
    }, [initQuiz]);

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
        <QuizResult
            quiz={quiz}
            setQuiz={setQuiz}
            time={time}
        />
        : quiz !== undefined ?
        quiz.questions.length === 0 ?
            <span>No Questions Yet!</span>
        :
        <div className='d-flex flex-column gap-3'
            style={{
                backgroundColor: "rgba(18, 5, 77, .5)",
                backgroundSize: 'cover',
                height: '100vh'
            }}
        > 
        <div>
            
        </div>
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
                    style={{color: '#FFFFFF', backgroundColor: '#640979', width: "10rem"}}
                    disabled={selectedQuestion <= 0 ? true : false}
                    onClick={
                      () => incrementSelectedQuestion(-1)
                    }
                >
                    Prev
                </button>
                <button className='btn btn-secondary'
                    style={{color: '#FFFFFF', backgroundColor: '#640979', width: "10rem"}}
                    disabled={selectedQuestion >= quiz.questions.length - 1 ? true : false}
                    onClick={
                      () => incrementSelectedQuestion(1)
                    }
                >
                    Next
                </button>
            </div>
            <button className='btn btn-primary mx-auto'
                style={{color: '#FFFFFF', backgroundColor: '#1C7947', width: "21rem"}}
                onClick={ submitAttempt }
            >
                Submit
            </button>
            <span className='mx-auto'
                style={{color: '#FFFFFF'}}
            >
                Time Taken: {`${parseInt((time / 60), 10)}:${(time % 60).toLocaleString('en-US', {minimumIntegerDigits: 2})}`}
            </span>
        </div>
        
        :<span> Loading... </span>}
        </>
    );
}

export default QuizPage
