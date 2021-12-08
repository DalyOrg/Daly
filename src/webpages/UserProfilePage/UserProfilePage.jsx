import React, {useContext} from "react";
import "./userProfilePage.css";
import { GlobalStoreContext } from '../../store/useGlobalStore';
import Carousel from 'react-elastic-carousel';
import ItemCarousel from "../../components/ItemCarousel";
import { getPlatform } from '../../adapters/platform';

import { useState, useCallback } from 'react';
import { useEffect } from 'react';

import { useHistory, useParams } from 'react-router';
import { getOtherUser } from "../../adapters/user";


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
  const {userId} = useParams();
    const [platformList, setPlatformList] = useState([]);
    const [platformOwnedList, setPlatformOwnedList] = useState([]);
    const [item, setItem] = useState();
    const [user, setUser] = useState();

       const history = useHistory();
  
       const linkTo = (platformId) => {
   
         history.push(`/platform/` + platformId);
       }
   
   
       const initUser = useCallback(async function(){
        let userObj = await getOtherUser(userId);
        setUser(userObj); 
    }, [userId])

    useEffect(() => {
      initUser();
    }, [initUser]);


       const initPlatform = useCallback(async function(){
        if(user !== undefined && user.subscribedPlatforms !== undefined){
          setPlatformList(user.subscribedPlatforms);
          user.subscribedPlatforms.forEach(async(platform,index) => 
            {
              let platformObj = await getPlatform(platform);
              setPlatformList((prevState) =>
              {
                let newPlatformList = [...prevState];
                newPlatformList[index] = platformObj;
                return newPlatformList;
              }
              );
            }
          )
        }
      }, [user])
  
  
      
      useEffect(() => {
        initPlatform();
    }, [initPlatform]);
  
  

    const initPlatformOwned = useCallback(async function(){
      if(user !== undefined && user.platformsOwned !== undefined){
        setPlatformOwnedList(user.platformsOwned);
        user.platformsOwned.forEach(async(platform,index) => 
          {
            let platformObj = await getPlatform(platform);
            setPlatformOwnedList((prevState) =>
            {
              let newPlatformOwnedList = [...prevState];
              newPlatformOwnedList[index] = platformObj;
              return newPlatformOwnedList;
            }
            );
          }
        )
      }
    }, [user])


    
    useEffect(() => {
      initPlatformOwned();
  }, [initPlatformOwned]);
    

    return (
        <div>
          { user !== undefined && user.profileBanner !== undefined && user.profilePicture !== undefined ?
            <div class="profile-banner" style={{backgroundColor:"grey",backgroundSize: 'cover',backgroundImage:`url(${user.profileBanner})`}}>
                <div class="profile-picture" style={{backgroundColor:"white",backgroundSize: 'cover',backgroundImage:`url(${user.profilePicture})`}}></div>
            </div>
            :<span> Loading... </span>}
            <br/><br/><br/><br/><br/>
            { user !== undefined && user.username !== undefined ?
            <p class="username">{user.username}</p>
            :<span> Loading... </span>}

            <div style={{ marginBottom: '5rem', marginTop: '3rem'}} className="App">
      <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' , fontSize: "30px"}}>Collection</h1>
      { user !== undefined && user.itemsOwned !== undefined?
      <Carousel breakPoints={breakPointsCollection}>
        {
          user.itemsOwned.map((item) => 
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
      :<span> Loading... </span>}
    </div>
    { user !== undefined && user.subscribedPlatforms !==undefined ?
      <div style={{marginTop: "2rem"}}>
       
        <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white', fontSize: "30px" }}>Subscribed Platforms</h1>
       
        {user.subscribedPlatforms.length !== 0 ?
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
:<span> Loading... </span>}

{ user !== undefined && user.platformsOwned !==undefined ?
      <div style={{marginTop: "2rem"}}>
      <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white', fontSize: "30px" }}>Platforms Owned</h1>
            {user.platformsOwned.length !== 0 ?
                <Carousel breakPoints={breakPointsSubscriptions}>
                {platformOwnedList.map((platform) => (
                     <ItemCarousel onClick={()=>linkTo(platform.id)} style={{color: '#FFFFFF', backgroundRepeat: "no-repeat",
                     backgroundPosition: "center",
                     backgroundSize: "cover",
                     backgroundImage:`url(${platform.platformBanner})`}}> </ItemCarousel>
                  ))}
                </Carousel>
                : <h1 style={{color: "white", textAlign: "center"}}>No Platform created yet.</h1>}
            </div>
            :<span> Loading... </span>}


<div id="userItemModal" class="modal" tabindex="-1">
  <div class="modal-dialog">
    
      
      {item !== undefined ?
      <div class="modal-body" >
        <img height="600px" src= {item.picUrl}></img>
      </div>
      :<span> Loading... </span>}
      
    
  </div>
</div>






        </div>
    );
}

export default UserProfilePage;