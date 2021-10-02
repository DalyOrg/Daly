import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { useEffect } from 'react';

function App() {
  const [quizzes, setQuizzes] = useState([]);
  async function getQuizzes(db) {
    const quizzesCol = collection(db, 'quizzes');
    const quizSnapshot = await getDocs(quizzesCol);
    const quizList = await quizSnapshot.docs.map(doc => doc.data());
    let questions = [];
    for(let i = 0; i < quizList.length; i++) {
      questions.push(quizList[i].question);
    }
    console.log(questions);
    setQuizzes(questions);
  }
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

  useEffect(() => {
    getQuizzes(db);
  }, [db]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Quizzes
        <li>
        {quizzes ? quizzes.map((question) => {
          return <ul>{quizzes[0]}</ul>
        }) : ""}
        </li>
      </header>
    </div>
  );
}

export default App;
