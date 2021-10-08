import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';

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

function App() {
  const [quizzes, setQuizzes] = useState();
  const [quiz, setQuiz] = useState();
  const [questions, setQuestions] = useState();
  const [answers, setAnswers] = useState();
  async function getQuizzes(db) {
    const quizzesCol = collection(db, 'quizzes');
    const quizSnapshot = await getDocs(quizzesCol);
    let quizList = await quizSnapshot.docs.map(doc => doc.id);
    let quizzes = [];
    for(let i = 0; i < quizList.length; i++) {
      let result = await getQuizName(db, quizList[i]);
      quizzes.push({id: quizList[i], name: result});
    }
    setQuizzes(quizzes);
  }

  async function getQuizName(db, id) {
    const quizzesCol = doc(db, 'quizzes', id);
    const quizSnapshot = await getDoc(quizzesCol);
    return quizSnapshot.data().name;
  }

  async function getQuestions(db, id) {
    const quizzesCol = collection(db, 'quizzes', id, 'questions');
    const quizSnapshot = await getDocs(quizzesCol);
    let questions = await quizSnapshot.docs.map(doc => doc.data());
    let questionIds = await quizSnapshot.docs.map(doc => doc.id);
    let questionText = [];
    for(let i = 0; i < questions.length; i++) {
      let text = questions[i].questionText;
      let id = questionIds[i];
      questionText.push({
        text, id
      });
    }
    console.log(questionText);
    setQuestions(questionText);
  }

  async function getAnswers(db, id) {
    console.log(quiz, id);
    const quizzesCol = collection(db, 'quizzes', quiz, 'questions', id, 'answers');
    const quizSnapshot = await getDocs(quizzesCol);
    let questions = await quizSnapshot.docs.map(doc => doc.data());
    let questionText = [];
    for(let i = 0; i < questions.length; i++) {
      questionText.push(questions[i].answerText);
    }
    setAnswers(questionText);
  }

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

  useEffect(() => {
    getQuizzes(db);
  }, [db]);

  function quizPress(id) {
    setQuiz(id);
    getQuestions(db, id);
  }

  function questionPress(id) {
    getAnswers(db, id);
  }

  return (
    <div className="jumbotron jumbotron-fluid">
      <header className="container">
        <h1 className="display-4">Welcome to Daly!</h1>
        <p className="lead">Please choose a quiz</p>
        <hr className="my-4"/>
        {quizzes ? quizzes.map((quiz) => {
          return <button id={quiz.id} class="btn btn-primary" onClick={() => quizPress(quiz.id)}>{quiz.name}</button>
        }) : ""}
        {questions ? <div className='pt-4'/> : ""}
        {questions ? questions.map((question) => {
          return <li key={question.id} onClick={() => questionPress(question.id)}>{question['text']}</li>
        }) : ""}
        {answers ? <div className='pt-4'/> : ""}
        {answers ? "Answers:" : ""}
        {answers ? answers.map((answer) => {
          return <li>{answer}</li>
        }) : ""}
      </header>
    </div>
  );
}

export default App;
