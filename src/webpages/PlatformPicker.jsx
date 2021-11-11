import React from "react";
import ItemCarousel from "../components/PlatformPickerCarousel";
import Carousel from 'react-elastic-carousel';
import { useEffect, useState } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import { useParams } from 'react-router';
import { useHistory } from 'react-router';
import { useGlobalStore } from "../store/useGlobalStore";
import { getPlatform } from '../adapters/platform';
import { postPlatform } from "../adapters/platform";
import { useCallback } from 'react';
import { Redirect } from "react-router";
import { getUser } from '../adapters/user';
import "../carousel.css";

const PlatformPicker = () => {
    let selectedItem = "";
    const [store, dispatch] = useGlobalStore();
    const [platformList, setPlatformList] = useState([]);
    const [name, setName] = useState();
    const [platformId, setPlatformId] = useState();

    
  


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
            console.log(store.userInfo.platformsOwned);
            console.log(store.userInfo.id);
            if((store.userInfo.platformsOwned !==undefined)){
                store.userInfo.platformsOwned.forEach(platform => initPlatform(platform));
            }
            
        }
    },[store]);



    async function newPlatform(){
        console.log('change Username');
        console.log("here " + name);
        console.log(store.userInfo.id);

        if(store.userInfo === undefined){
            alert("You must log in to create a quiz.");
            return;
        }
            var newPlatform = {
                ownerId: store.userInfo.id,
                name: name,
                quizzes: [],
                platformPicture: undefined,
                platformBanner: undefined,
                subscribersId: undefined,
                subscriberCount: 0,
                chatId: undefined
            };   
            console.log("before post");
            var platform = await postPlatform(newPlatform);
            if(platform){
                console.log(platform);
                
                setPlatformId(platform);
                getUser();
            }
    }








    return (
        <div>
            <h1 className='d-flex justify-content-center' style={{color: '#FFFFFF', marginTop: '2rem'}}>Platforms</h1>

                <MDBBtn data-bs-toggle="modal" data-bs-target="#nameModal"  style={{marginLeft: "1rem" , marginBottom: '1rem',color: "white", backgroundColor: "#00B5FF"}}>Add a Platform</MDBBtn>
               
            <div style={{ marginBottom: '5rem', marginTop: '5rem'}}>
                <Carousel>
                {platformList.map((platform) => (
                     <ItemCarousel onClick={()=>linkTo(platform.id)} style={{color: '#FFFFFF',backgroundSize: 'cover',backgroundImage:`url(${platform.platformBanner})`}}> </ItemCarousel>
                  ))}
                </Carousel>
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
        <MDBBtn rounded data-bs-dismiss="modal" style={{color: "white", backgroundColor: "#00B5FF"}} type="button" onClick={newPlatform} class="btn btn-danger">Submit</MDBBtn>
      </div>
    </div>
  </div>
</div>



                    {
                        platformId ? <Redirect to={`/platform/${platformId}`}/>
                        : ""
                    }

        </div>
    );
}

export default PlatformPicker;