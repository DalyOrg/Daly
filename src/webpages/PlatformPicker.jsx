import React from "react";
import ItemCarousel from "../components/PlatformPickerCarousel";
import Carousel from 'react-elastic-carousel';
import { useEffect, useState } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import { useParams } from 'react-router';
import { useHistory } from 'react-router';
import { useGlobalStore } from "../store/useGlobalStore";
import { getPlatform } from '../adapters/platform';
import { useCallback } from 'react';
import "../carousel.css";

const PlatformPicker = () => {
    let selectedItem = "";
    const [store, dispatch] = useGlobalStore();
    const [platformList, setPlatformList] = useState([]);

    
    const pictures = ["https://i.insider.com/5f5768c47ed0ee001e25dd6b?width=1000&format=jpeg&auto=webp",
     "https://www.thetruecolors.org/wp-content/uploads/2021/02/marvel-logo-header-1.jpg", 
     "https://res.cloudinary.com/jerrick/image/upload/f_jpg,fl_progressive,q_auto,w_1024/wv9zgmvj9rpbtqi2a8l0.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/1388px-Star_Wars_Logo.svg.png", 
      "https://thumbs.dreamstime.com/b/set-justice-league-dc-comics-black-logos-kiev-ukraine-november-set-justice-league-dc-comics-black-logos-printed-paper-125514598.jpg"];

      const [someVar, setSomeVar] = useState(pictures);


    function incrementSelectedQuestion(){
        const updatedCarsArray = [...pictures, "https://image.api.playstation.com/vulcan/img/rnd/202103/0201/CNpDMjM6nvuIfDLOYum77kGA.png"];
        setSomeVar(updatedCarsArray);
        console.log(someVar);
         
    }


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
            if((store.userInfo.platformsOwned !==undefined)){
                store.userInfo.platformsOwned.forEach(platform => initPlatform(platform));
            }
            
        }
    },[store]);



    return (
        <div>
            <h1 className='d-flex justify-content-center' style={{color: '#FFFFFF', marginTop: '2rem'}}>Platforms</h1>

                <MDBBtn onClick={ () => incrementSelectedQuestion()} style={{marginLeft: "1rem" , marginBottom: '1rem',color: "white", backgroundColor: "#00B5FF"}}>Add a Platform</MDBBtn>
               
            <div style={{ marginBottom: '5rem', marginTop: '5rem'}}>
                <Carousel>
                {platformList.map((platform) => (
                     <ItemCarousel onClick={()=>linkTo(platform.id)} style={{color: '#FFFFFF',backgroundSize: 'cover',backgroundImage:`url(${platform.platformBanner})`}}> </ItemCarousel>
                  ))}
                </Carousel>
            </div>
        </div>
    );
}

export default PlatformPicker;