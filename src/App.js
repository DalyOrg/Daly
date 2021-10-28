import React, { Component } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics"; // TODO: add later perhaps?
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';
import { BrowserRouter as Router, 
    Route, 
    Switch, 
    Link, 
    Redirect 
} from "react-router-dom";

//webpages
import NotFoundPage from "./webpages/404";
import LandingPage from "./webpages/LandingPage";
import LoginPage from "./webpages/Login";
import HomePage from "./webpages/HomePage";
import TopBar from "./components/TopBar";

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





class App extends Component {
    render() {
        return <Router>
            <TopBar></TopBar>
            <Switch>
                <Route exact path="/" component={LandingPage}></Route>
                <Route path="/login" component={LoginPage}/>
                <Route path="/home" component={HomePage}/>
                
                <Route exact path="/404" component={NotFoundPage}/>
                <Redirect to="/404"></Redirect>
            </Switch>
        </Router>
    }
}

export default App;