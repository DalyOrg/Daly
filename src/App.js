import React, { Component } from "react";
import "./App.css";

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
import TopBar from "./components/TopBar";



class App extends Component {
    render() {
        return <Router>
            <TopBar></TopBar>
            <Switch>
                <Route exact path="/" component={LandingPage}></Route>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/home" component={HomePage}/>
                
                <Route exact path="/404" component={NotFoundPage}/>
                <Redirect to="/404"></Redirect>
            </Switch>
        </Router>
    }
}

export default App;