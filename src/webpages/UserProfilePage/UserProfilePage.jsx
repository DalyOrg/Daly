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
    const [itemList, setItemList] = useState([]);
    const [profileBanner, setProfileBanner] = useState();
    const [profilePicture, setProfilePicture] = useState();
    const [username, setUsername] = useState('');
    const [item, setItem] = useState();

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
               setProfileBanner(store.userInfo.profileBanner);
               setProfilePicture(store.userInfo.profilePicture);
               setUsername(store.userInfo.username);
               setItemList(store.userInfo.itemsOwned);
           }

       },[store]);
    
    function getBadges(){
        return store.userInfo.badges;
    }

    return (
        <div>
            <div class="profile-banner" style={{backgroundColor:"grey",backgroundSize: 'cover',backgroundImage:`url(${profileBanner})`}}>
                <div class="profile-picture" style={{backgroundColor:"white",backgroundSize: 'cover',backgroundImage:`url(${profilePicture})`}}></div>
            </div>
            <br/><br/><br/><br/><br/>
            <p class="username">{username}</p>
            

            <div style={{ marginBottom: '5rem', marginTop: '3rem'}} className="App">
      <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' , fontSize: "30px"}}>Collection</h1>
      <Carousel breakPoints={breakPointsCollection}>
        {
          itemList.map((item) => 
            <ItemCarousel
            data-bs-toggle="modal" data-bs-target="#userItemModal"
              style={{
                
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",


                

                backgroundImage: `url(${item.picUrl})`
              }}
              onClick={() => {
                setItem(item)
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
        {platformList.length !== 0 ?
        <Carousel breakPoints={breakPointsSubscriptions}>
          {
            platformList.map((platform) => 
            <ItemCarousel onClick={()=>linkTo(platform.id)} style={{color: '#FFFFFF',backgroundSize: 'cover',backgroundImage:`url(${platform.platformBanner})`,backgroundPositionX: "center",
            backgroundPositionY: "center",}}> </ItemCarousel>
            )
          }
        </Carousel>
         : <h4 style={{color: "white", textAlign: "center"}}>No subscribed platforms yet.</h4>}
      </div>
}





<div id="userItemModal" class="modal" tabindex="-1">
  <div class="modal-dialog">
    
      
      {item !== undefined ?
      <div class="modal-body">
        <img  width="100%" height= "auto" src= {item.picUrl}></img>
      </div>
      :<span> Loading... </span>}
      
    
  </div>
</div>






        </div>
    );
}

export default UserProfilePage;