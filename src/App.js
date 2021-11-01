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
import LandingPage from "./webpages/LandingPage/LandingPage";
import LoginPage from "./webpages/Login";
import HomePage from "./webpages/HomePage";
import SettingsPage from "./webpages/SettingsPage";
import QuizPage from "./webpages/QuizPage";
import UserProfilePage from "./webpages/UserProfilePage/UserProfilePage";
import QuizSummaryPage from "./webpages/QuizSummaryPage";
import QuizSetup from "./webpages/QuizSetup/QuizSetup";
import PlatformPicker from "./webpages/PlatformPicker";
//components
import TopBar from "./components/TopBar.jsx";

class App extends Component {
    render() {
        return <Router>
            <TopBar></TopBar>
            <Switch>
                <Route exact path="/" component={LandingPage}></Route>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/home" component={HomePage}/>
                <Route exact path="/settings" component={SettingsPage}/>
                <Route exact path="/quiz/setup" component={QuizSetup}/>
                <Route exact path="/quiz/:quizId" component={QuizSummaryPage}/>
                <Route exact path="/quiz/:quizId/take" component={QuizPage}/>
                <Route exact path="/user/:userId" component={UserProfilePage}/>
                <Route exact path="/platformpicker" component={PlatformPicker}/>
                

                <Route exact path="/404" component={NotFoundPage}/>
                <Redirect to="/404"></Redirect>
            </Switch>
        </Router>
    }
}

export default App;