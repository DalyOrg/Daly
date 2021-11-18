import React, {useContext} from "react";
import "./userProfilePage.css";
import { GlobalStoreContext } from '../../store/useGlobalStore';
import Carousel from 'react-elastic-carousel';
import ItemCarousel from "../../components/ItemCarousel";
import { getPlatform } from '../../adapters/platform';

import { useState } from 'react';
import { useEffect } from 'react';

import { useHistory } from 'react-router';


//TODO: implement get profile banner, profile picture, user name,
//get collection


let breakPointsSubscriptions = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2 },
    { width: 1200, itemsToShow: 3},
  ];

  let breakPointsCollection = [
    { width: 1, itemsToShow: 2 },
    { width: 550, itemsToShow: 3 },
    { width: 768, itemsToShow: 4 },
    { width: 1200, itemsToShow: 5 },
  ];
//TODO: if this page is reached without logging in, redirect to login page
const UserProfilePage = () => {
    const [store] = useContext(GlobalStoreContext);
    const [platformList, setPlatformList] = useState([]);

    const pictures = ["https://i.insider.com/5f5768c47ed0ee001e25dd6b?width=1000&format=jpeg&auto=webp",
      "https://www.thetruecolors.org/wp-content/uploads/2021/02/marvel-logo-header-1.jpg", 
      "https://res.cloudinary.com/jerrick/image/upload/f_jpg,fl_progressive,q_auto,w_1024/wv9zgmvj9rpbtqi2a8l0.jpg",
       "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/1388px-Star_Wars_Logo.svg.png", 
       "https://thumbs.dreamstime.com/b/set-justice-league-dc-comics-black-logos-kiev-ukraine-november-set-justice-league-dc-comics-black-logos-printed-paper-125514598.jpg"];



       const history = useHistory();
  
       const linkTo = (platformId) => {
   
         history.push(`/platform/` + platformId);
       }
   
   
       async function initPlatform(platformId){
           let platformObj = await getPlatform(platformId);
           setPlatformList((platformList) => [...platformList, platformObj])
           console.log(platformObj);
       }
   
       useEffect(() => {
           if(store !== undefined && store.userInfo !== undefined){
               console.log(store.userInfo.subscribedPlatforms);
               console.log(store.userInfo.id);
               if((store.userInfo.subscribedPlatforms !==undefined)){
                   store.userInfo.subscribedPlatforms.forEach(platform => initPlatform(platform));
               }
               
           }
       },[store]);




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
            

            <div style={{ marginBottom: '5rem', marginTop: '3rem'}} className="App">
      <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' , fontSize: "30px"}}>Collection</h1>
      <Carousel breakPoints={breakPointsCollection}>
        {
          pictures.map((quiz) => 
            <ItemCarousel
              style={{
                backgroundRepeat: "no-repeat",
                backgroundPositionX: "center",
                backgroundPositionY: "center",
                backgroundSize: "cover",
                
                
                backgroundImage: `url(${quiz})`
              }}
              onClick={() => {
                //history.push(`/quiz/${quiz.id}`);
              }}
            >
            </ItemCarousel>
          )
        }
      </Carousel>
    </div>
    { store && store.userInfo &&
      <div style={{marginTop: "2rem"}}>
        <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white', fontSize: "30px" }}>Subscribed Platforms</h1>
        <Carousel breakPoints={breakPointsSubscriptions}>
          {
            platformList.map((platform) => 
            <ItemCarousel onClick={()=>linkTo(platform.id)} style={{color: '#FFFFFF',backgroundSize: 'cover',backgroundImage:`url(${platform.platformBanner})`,backgroundPositionX: "center",
            backgroundPositionY: "center",}}> </ItemCarousel>
            )
          }
        </Carousel>
      </div>
}



        </div>
    );
}

export default UserProfilePage;