import Question from '../components/Question'
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getQuiz, submitQuizAttempt } from '../adapters/quiz';
import { getUser } from '../adapters/user';
import { useCallback } from 'react';
import QuizResult from './QuizResult';
import { Opacity } from '@mui/icons-material';
import { useGlobalStore } from '../store/useGlobalStore';

const QuizPage = () => {
    const {quizId} = useParams();
    const [store, dispatch] = useGlobalStore();
    const [timer, setTimer] = useState();
    const [quiz, setQuiz] = useState();
    const [time, setTime] = useState();
    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [badgesEarned, setBadgesEarned] = useState(-1);


    async function countDown(){
        if(!showResults){
            setTime((prevTime) => prevTime - 1);
        }
    }

    const calculateScore = useCallback(function(){
        let sum = quiz.questions.reduce((currentSum, currentQuestion) => { 
            return currentSum +
                (currentQuestion.selectedAnswer && currentQuestion.selectedAnswer.correctAnswer ?
                    1 : 0);
        }, 0);
        return (sum * 1.0 / quiz.questions.length) * 100;
    }, [quiz])

    const submitAttempt = useCallback(async function(){
        clearInterval(timer);
        if(store && store.userInfo){ // if logged in
            console.log(store.userInfo);
            let submitData = await submitQuizAttempt(quiz.id, quiz.timeLimitSeconds - time, calculateScore());
            let newUserInfo = await getUser();
            dispatch({type: 'login', payload: newUserInfo});
            setBadgesEarned(submitData.badgesEarned);
        }
        setShowResults(true);
    }, [timer, quiz, calculateScore, store, dispatch, time])


    useEffect(() => {
        if(time<=0 && quiz.questions.length!==0){
            // auto submit
            submitAttempt();
            // alert("Times up!");
        }
    }, [quiz, time, submitAttempt])

    const startTimer = useCallback(async function(){
        setTimer(setInterval(countDown, 1000));
    }, [setTimer, setInterval, time])

    const initQuiz = useCallback(async function(){
        let quizObj = await getQuiz(quizId);
        setQuiz(quizObj); 
        setTime(quizObj.timeLimitSeconds);
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
            score={calculateScore()}
            badgesEarned={badgesEarned}
            setQuiz={setQuiz}
            time={quiz.timeLimitSeconds - time}
            isLoggedIn={store !== undefined && store.userInfo !== undefined}
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

            <div class="d-flex justify-content-between">
                <h1  style={{color: '#FFFFFF', marginLeft: "1rem"}}>
                    {quiz.name}
                 </h1>

                 <p
                    style={{color: '#FFFFFF', marginRight: "2rem", fontSize: "30px"}}
                 >
                    Time Left: {`${parseInt((time / 60), 10)}:${(time % 60).toLocaleString('en-US', {minimumIntegerDigits: 2})}`}
                </p>
            </div>
   
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
         
        </div>
        
        :<span> Loading... </span>}
        </>
    );
}

export default QuizPage
