import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { useEffect } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyBELbK1fogp_rAzpNXCVZehV8Mj-_-dW4k",
  authDomain: "dalyorg-afce8.firebaseapp.com",
  databaseURL: "https://dalyorg-afce8-default-rtdb.firebaseio.com",
  projectId: "dalyorg-afce8",
  storageBucket: "dalyorg-afce8.appspot.com",
  messagingSenderId: "701841337894",
  appId: "1:701841337894:web:eb840b893e7e02babf40e7",
  measurementId: "G-9RXPQD33L4"
};



function App() {
  const [quizzes, setQuizzes] = useState(null);
  async function getQuizzes(db) {
    const quizzesCol = collection(db, 'quizzes');
    const quizSnapshot = await getDocs(quizzesCol);
    const quizList = await quizSnapshot.docs.map(doc => doc.data());
    let questions = [];
    for(let i = 0; i < quizzes; i++) {
      questions.append(quizzes[i].question);
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
        {quizzes ? quizzes.map((data) => {
          <li>{data}</li>
        }) : ""}
      </header>
    </div>
  );
}

export default App;
