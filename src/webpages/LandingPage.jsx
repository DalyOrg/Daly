import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div>
            Welcome to the Splash Screen.<br/>
            <Link to="/login">Login</Link><br/>
            <Link to="/home">Explore</Link>
        </div>
    );
}

export default LandingPage;