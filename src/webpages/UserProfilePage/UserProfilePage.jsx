import React, {useContext} from "react";
import "./userProfilePage.css";
import { GlobalStoreContext } from '../../store/useGlobalStore';

//TODO: implement get profile banner, profile picture, user name,
//get collection



//TODO: if this page is reached without logging in, redirect to login page
const UserProfilePage = () => {
    const [store] = useContext(GlobalStoreContext);

    function getProfileBanner(){
        return ``;
    }
    
    function getProfilePic(){
        return ``;
    }
    
    function getUsername(){
        return store.userInfo.username;
    }
    
    function getBadges(){
        return store.userInfo.badges;
    }

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