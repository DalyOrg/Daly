import { useState, useCallback } from 'react';
import './App.css';

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';
import Question from './components/Question';
import Results from './components/Results';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerMap, setAnswerMap] = useState({});

  async function getQuizzes(db) {
    const quizzesCol = collection(db, '/quizzes');
    const quizSnapshot = await getDocs(quizzesCol);
    const quizList = quizSnapshot.docs.map((quiz) => {
      return {...quiz.data(), id: quiz.id};
    });
    setQuizzes(quizList);
  }

  const getQuestions = useCallback(async function(){
    if(selectedQuiz === undefined)
      return
    const questionsCol = collection(db, `/quizzes/${selectedQuiz.id}/questions`);
    const questionsSnapshot = await getDocs(questionsCol);
    const questionsList = questionsSnapshot.docs.map((question) => {
      return {...question.data(), id: question.id};
    });
    console.log(questionsList[0])
    setQuestions(questionsList);
    setSelectedQuestion(0);
  }, [selectedQuiz]);

  useEffect(() => {
    getQuizzes(db);
  }, []);

  useEffect(() => {
    getQuestions()
  }, [getQuestions]);

  function mapSelectedAnswer(question){
    return function(answer){
      // map question to answer
      let newMap = {...answerMap}
      newMap[question] = answer
      setAnswerMap(newMap)
    }
  }

  function incrementSelectedQuestion(i){
    if(selectedQuestion + i < 0) return
    setSelectedQuestion(selectedQuestion + i)
  }

  return (
    <div className="App d-flex flex-column gap-3">
      <h1>
        Daly Quiz App
      </h1>
      <div className='d-flex flex-column gap-3'>
        {
          selectedQuiz ?
            selectedQuestion >= questions.length ?
              <Results answerMap={answerMap} />
            :
            selectedQuestion !== null &&
              <Question
                question={questions[selectedQuestion]}
                incrementSelectedQuestion={incrementSelectedQuestion}
                setSelectedAnswer={mapSelectedAnswer(selectedQuestion)}
                db={db}
                selectedQuizId={selectedQuiz.id}
              />
          :
          quizzes && quizzes.map((quiz) => 
            <button className='btn btn-primary mx-auto'
              onClick={() => setSelectedQuiz(quiz)}
            >
              {quiz.name}
            </button>
          )
        }
      </div>
    </div>
  );
}

export default App;
