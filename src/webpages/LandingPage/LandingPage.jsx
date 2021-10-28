import React from "react";
import { Link } from "react-router-dom";
import "./landingPage.css";

const LandingPage = () => {

    return (
        <div>
            <div class="landing-page-image">
                <p class="message-one">TEST your<br/>knowledge and<br/>MASTER it DAILY</p>
                <Link to="/home">
                    <button type = "button" class = "explore-button">
                        Explore
                    </button>
                </Link>
            </div>
            <br/><br/>
            <p class="message-two">We at Daly want people to come together to solve life’s greatest questions. Quizzing is a great<br/>way for communities to get together and share everyone’s knowledge.</p>
            <br/>
            <div class="bottom-bar">
                <p class="copyright-text">@2021 Daly Inc.</p>
            </div>
        </div>
    );
}

export default LandingPage;