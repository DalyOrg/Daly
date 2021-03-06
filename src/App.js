import React, { Component, useCallback } from "react";
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
import SearchPage from "./webpages/SearchPage";
import QuizSetup from "./webpages/QuizSetup/QuizSetup";
import QuizEdit from "./webpages/QuizEdit";
import LeaderBoard from "./webpages/LeaderBoardPage";
import PlatformPicker from "./webpages/PlatformPicker";
import PlatformPage from "./webpages/PlatformPage";
import ShopPage from "./webpages/ShopPage";
//components
import TopBar from "./components/TopBar.jsx";
import { render } from "@testing-library/react";
import { useGlobalStore } from "./store/useGlobalStore";
import { getUser } from "./adapters/user";
import ReportsPage from "./webpages/ReportsPage";


const GetUserWrapper = ({children}) => {
    const [store, dispatch] = useGlobalStore();

    const initUser = useCallback(async function(){
        if(store !== undefined && store.userInfo === undefined){
          let userInfo = await getUser();
          if(userInfo.id){
            dispatch({type: 'login', payload: userInfo})
          }
        }
    }, [store, dispatch]);

    useEffect(() => {
      initUser()
    }, [initUser]);

    return(<> {children} </>);
}

class App extends Component {
    render() {
        return(
        <GetUserWrapper>
        <Router>
            <TopBar></TopBar>
            <Switch>
                <Route exact path="/" component={LandingPage}></Route>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/home" component={HomePage}/>
                <Route exact path="/settings" component={SettingsPage}/>
                <Route exact path="/quiz/:quizId" component={QuizSummaryPage}/>
                <Route exact path="/search/:searchTerm" component={SearchPage}/>
                <Route exact path="/quiz/:quizId/take" component={QuizPage}/>
                <Route exact path="/quiz/:quizId/edit" component={QuizEdit}/>
                <Route exact path="/quiz/:quizId/leaderboard" component={LeaderBoard}/>
                <Route exact path="/user/reports" component={ReportsPage}/>
                <Route exact path="/user/:userId" component={UserProfilePage}/>
                <Route exact path="/:userId/platformpicker" component={PlatformPicker}/>
                <Route exact path="/platform/:platformId" component={PlatformPage}/>
                <Route exact path="/platform/:platformId/create" component={QuizSetup}/>
                <Route exact path="/shop" component={ShopPage}/>
                <Route exact path="/404" component={NotFoundPage}/>
                <Redirect to="/404"></Redirect>
            </Switch>
        </Router>
        </GetUserWrapper>
        )
    }
}

export default App;