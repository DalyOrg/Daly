import { useState, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { useEffect } from 'react';
//import Question from './components/Question';
//import Results from './components/Results';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [curQuestion, setCurQuestion] = useState(null);
  const [answerMap, setAnswerMap] = useState({});//how is this like..?
  const [questionNum, setQuestionNum] = useState();

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

  async function getQuizzes(db) {
    const quizzesCol = collection(db, '/quizzes');
    const quizSnapshot = await getDocs(quizzesCol);
    const quizList = quizSnapshot.docs.map((quiz) => {
      return {...quiz.data(), id: quiz.id};
    });
    setQuizzes(quizList);
  }

  useEffect(() => {
    getQuizzes(db);
  }, [db]);

  // const getQuestions = useCallback(async function(){
  //   if(quizzes === undefined)
  //     return;
  //   const questionsCol = collection(db, `/quizzes/${quizzes[0].id}/questions`);
  //   const questionsSnapshot = await getDocs(questionsCol);
  //   const questionsList = questionsSnapshot.docs.map((question) => {
  //     return {...question.data(), id: question.id};
  //   });
  //   console.log(questionsList[0])
  //   setQuestions(questionsList);
  //   setQuestionNum(0);
  // }, [quizzes]);

  // useEffect(() => {
  //   getQuestions()
  // }, [quizzes]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>{quizzes[0].name}</h2>
        
      </header>
    </div>
  );
}

export default App;
