import React from "react";
import "./userProfilePage.css";

//TODO: implement get profile banner, profile picture, user name,
//get collection

function getProfileBanner(){
    return ``;
}

function getProfilePic(){
    return ``;
}

function getUsername(){
    return `User`;
}

function getBadges(){
    return `0`;
}

//TODO: if this page is reached without logging in, redirect to login page
const UserProfilePage = () => {
    return (
        <div>
            <div class="profile-banner" >
                <div class="profile-picture" ></div>
            </div>
            <br/><br/><br/><br/><br/>
            <p class="username">{getUsername()}</p>
            <table class="badges">
                <tr>
                    <th class="badge-label">Badges: </th>
                    <th class="badge-num"><b>{getBadges()}</b></th>
                </tr>
            </table>
        </div>
    );
}

export default UserProfilePage;