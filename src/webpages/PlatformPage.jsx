import React from "react";
import "./platformPage.css";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBBtnGroup } from 'mdb-react-ui-kit';
import { PencilFill } from 'react-bootstrap-icons';
import ItemCarousel from "../components/ItemCarousel";
import Carousel from 'react-elastic-carousel';
import { useGlobalStore } from "../store/useGlobalStore";
import { getPlatform } from '../adapters/platform';
import { useCallback } from 'react';
import { useParams } from 'react-router';
import { useState } from 'react';
import { useEffect } from 'react';
import { getQuiz } from '../adapters/quiz';

let breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 },
  ];
const PlatformPage = () => {
    const [store, dispatch] = useGlobalStore();
    const [quizList, setQuizList] = useState([]);
    
    var platformOwner = false;


      const [platform, setPlatform] = useState();
      const {platformId} = useParams();
  
      const initPlatform = useCallback(async function(){
          let platformObj = await getPlatform(platformId);
          setPlatform(platformObj); 
      }, [platformId])

    useEffect(() => {
        initPlatform();
    }, [initPlatform]);
    
    useEffect(() => {
        if(platform !== undefined){
            platform.quizzes.forEach(quiz => initQuiz(quiz))
        }
    }, [platform]);



    async function initQuiz(quizId){
        let quizObj = await getQuiz(quizId);
        setQuizList([...quizList, quizObj])
    }

   if(store.userInfo !== undefined){

    if(store.userInfo.platformsOwned !== undefined){
        platformOwner = store.userInfo.platformsOwned.includes(platformId);
    }
   

   }

    return (
        <>
        {platform !== undefined ?
        <div>
            <div className="platformBanner" style={{backgroundSize: 'cover',backgroundImage:`url(${platform.platformBanner})`}}>
                {platformOwner !== false ?
                <span className="changeBannerButton"><MDBBtn style={{backgroundColor: "#00B5FF"}}>Edit Banner Picture</MDBBtn></span>
                : <></>}
            </div>


            <div className="container">

                    <div className="row">
            
                    <div  style={{marginTop: '0.5rem', backgroundSize: 'cover',backgroundRepeat: "no-repeat ",color: "white", borderRadius: "100px", backgroundImage:`url(${platform.platformPicture})`, height:"200px", width:"200px"}}>
                    {platformOwner !== false ?
                    <MDBBtn rounded size='sm' style={{backgroundColor: "#00B5FF"}}><PencilFill color="white" size={20}/></MDBBtn>
                    : <></>}   
                    </div>
                       
                     <div className="col" style={{marginTop: '4rem'}}>
                         <span style={{fontSize: "20px", color: "white" , marginLeft: '6rem'}}>Subscribers<span style={{fontSize: "15px",display: "block", fontWeight: "bold", marginLeft: '6rem'}}>25K</span></span>
                    </div>
                     <div className="col" style={{marginTop: '4rem'}}>
                     <span style={{fontSize: "20px", color: "white" }}>Quizzes<span style={{fontSize: "15px",display: "block", fontWeight: "bold"}}>20</span></span>
                    </div>
                    <div className="col" style={{marginTop: '4rem'}}>
                    {platformOwner !== false ? 
                    <MDBBtn rounded size='lg' style={{backgroundColor: "#00B5FF"}}>Create</MDBBtn>
                    : <MDBBtn rounded size='lg' style={{backgroundColor: "#00B5FF"}}>Subscribe</MDBBtn>}  
                    </div>
                 </div>

                        <div className="col" style={{color: "white"}}>
                          <span style={{fontSize: "25px", marginRight: '1rem', marginTop: "1rem"}}>{platform.name}</span>
                          {platformOwner !== false ?
                          <MDBBtn rounded size='sm' style={{backgroundColor: "#00B5FF"}}><PencilFill color="white" size={20}/></MDBBtn>
                          : <></>}  
                          </div>
            </div>


            <div style={{ marginBottom: '5rem', marginTop: '5rem'}}>
                <Carousel breakPoints={breakPoints}>
                
                {quizList.map((pic) => (
                     <ItemCarousel style={{color: '#FFFFFF',backgroundSize: 'cover',backgroundImage:`url(${pic.backgroundImage})`}}></ItemCarousel>
                  ))}
                </Carousel>
            </div>
            {platformOwner !== false ?
            <MDBBtn rounded className='mx-2' color='danger' style={{marginBottom: "1rem"}}>
                 DELETE PLATFORM
            </MDBBtn>
            : <></>}  
        </div>

        :<span> Loading... </span>}</>
    );
}

export default PlatformPage;