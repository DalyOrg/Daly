import React from "react";
import ItemCarousel from "../components/PlatformPickerCarousel";
import Carousel from 'react-elastic-carousel';
import { MDBBtn } from 'mdb-react-ui-kit';
import { useEffect, useState,useCallback } from 'react';
import { useHistory } from 'react-router';
import { useGlobalStore } from "../store/useGlobalStore";
import { getPlatform } from '../adapters/platform';
import { postPlatform } from "../adapters/platform";
import { putUser } from "../adapters/user";
import { Redirect } from "react-router";

import "../carousel.css";

const PlatformPicker = () => {

    const [store, dispatch] = useGlobalStore();
    const [platformList, setPlatformList] = useState([]);
    const [name, setName] = useState();
    const [platformId, setPlatformId] = useState();
    const history = useHistory();
  
    const linkTo = (platformId) => {
      history.push(`/platform/` + platformId);
    }

    let breakPoints = [
      { width: 1, itemsToShow: 1 },
      { width: 550, itemsToShow: 1 },
      { width: 768, itemsToShow: 1 },
      { width: 1200, itemsToShow: 1 },
    ];



    const initPlatform = useCallback(async function(){
      if(store !== undefined && store.userInfo !== undefined && store.userInfo.platformsOwned !== undefined){
        setPlatformList(store.userInfo.platformsOwned);
        store.userInfo.platformsOwned.forEach(async(platform,index) => 
          {
            let platformObj = await getPlatform(platform);
            setPlatformList((prevState) =>
            {
              let newPlatformList = [...prevState];
              newPlatformList[index] = platformObj;
              setPlatformList(newPlatformList);
            }
            );
          }
        )
      }
    }, [store])


    
    useEffect(() => {
      initPlatform();
  }, [initPlatform]);






  
    async function newPlatform(){
        if(store.userInfo === undefined){
            alert("You must log in to create a quiz.");
            return;
        }
            var newPlatform = {
                ownerId: store.userInfo.id,
                name: name,
                quizzes: [],
                platformPicture: "https://i.imgur.com/x3ihOZC.jpg",
                platformBanner: "https://i.imgur.com/tXJmlg8.jpg",
                subscribersId: undefined,
                subscriberCount: 0,
                chatId: undefined
            };       
            var platform = await postPlatform(newPlatform);
            if(platform){
                setPlatformId(platform);  
                var tempUser = {
                  ...store.userInfo,
                  platformsOwned: [...store.userInfo.platformsOwned, platform]
                }
                dispatch({type: 'login', payload: tempUser});
                let newUserInfo = await putUser(tempUser);
                if(newUserInfo){
                  console.log(newUserInfo);
                }                
            }
    }

    return (
      
      <>
      {platformList !== undefined && store !== undefined && store.userInfo !== undefined ?
        <div>
            <h1 className='d-flex justify-content-center' style={{color: '#FFFFFF', marginTop: '2rem'}}>Platforms</h1>

                <MDBBtn data-bs-toggle="modal" data-bs-target="#nameModal"  style={{marginLeft: "1rem" , marginBottom: '1rem',color: "white", backgroundColor: "#640979"}}>Add a Platform</MDBBtn>
               
            <div style={{ marginBottom: '5rem', marginTop: '5rem'}}>
            {platformList.length !== 0 ?
                <Carousel breakPoints={breakPoints}>
                {platformList.map((platform) => (
                     <ItemCarousel onClick={()=>linkTo(platform.id)} style={{color: '#FFFFFF', backgroundRepeat: "no-repeat",
                     backgroundPosition: "center",
                     backgroundSize: "cover",
                     backgroundImage:`url(${platform.platformBanner})`}}> </ItemCarousel>
                  ))}
                </Carousel>
                : <h1 style={{color: "white", textAlign: "center"}}>You haven't created a platform yet.</h1>}
            </div>





            <div id="nameModal" className="modal fade" tabindex="-1">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">New Platform Name</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <input type="text" class="form-control" required placeholder="New Platform Name" value={name ? name : ''} 
                    onChange={
                        e=>setName(e.target.value)
                    }
    ></input>

      </div>

      <div className="modal-footer">
        <MDBBtn rounded data-bs-dismiss="modal" style={{color: "white", backgroundColor: "#640979"}} type="button" onClick={newPlatform} class="btn btn-danger">Submit</MDBBtn>
      </div>
    </div>
  </div>
</div>
                    {
                        platformId ? <Redirect to={`/platform/${platformId}`}/>
                        : ""
                    }
        </div>
       :<span> Loading... </span>}</>
    );
    
}

export default PlatformPicker;