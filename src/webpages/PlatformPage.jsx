import React from "react";
import "./platformPage.css";
import {  MDBBtn } from 'mdb-react-ui-kit';
import { PencilFill } from 'react-bootstrap-icons';
import ItemCarousel from "../components/ItemCarousel";
import Carousel from 'react-elastic-carousel';
import { useGlobalStore } from "../store/useGlobalStore";
import { getPlatform, deletePlatform, putPlatformBanner } from '../adapters/platform';
import { useCallback } from 'react';
import { Redirect, useParams } from 'react-router';
import { useState } from 'react';
import { useEffect } from 'react';
import { getQuiz } from '../adapters/quiz';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import SubscribeButton from "../components/SubscribeButton";
import {uploadUserImage} from "../adapters/images";

let breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 },
  ];
const PlatformPage = () => {
    const [store, dispatch] = useGlobalStore();
    const [quizList, setQuizList] = useState([]);

    const [platform, setPlatform] = useState();
      const {platformId} = useParams();

    const history = useHistory();
  
    const linkTo = (quizId) => {

      history.push(`/quiz/` + quizId);
    }


    async function deletePlatformAction(){
        var res = await deletePlatform(platform.id);
        history.push("/" + platform.ownerId + '/platformpicker');
        window.location.reload();
    }

    var platformOwner = false;
  
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

   const uploadImage =async (base64EncodedImage)=>{
    console.log("uploading image...");
    var url = await uploadUserImage(base64EncodedImage);
    console.log("upload complete");
    if(url){
      return url.data;
    }else{
      console.log("unable to grab link", url);
    }
  }

   async function updateBackground(e){
        var file=e.target.files[0];

        let reader = new FileReader();
        reader.onloadend = async function() {
            var url = await uploadImage(reader.result);
            setPlatform({...platform, platformBanner:url});
            console.log(url);
            //put new banner in database...
            await putPlatformBanner(platform.id, url);
        }
        await reader.readAsDataURL(file);
   }

    return (
        <>
        {platform !== undefined ?
        <div>
            <div className="platformBanner" style={{backgroundSize: 'cover',backgroundImage:`url(${platform.platformBanner})`}}>
                {platformOwner !== false ?
                <span className="changeBannerButton">                   
                <label className={"btn waves-effect"} style={{backgroundColor: "#640979", cursor: "pointer", color:"white", fontSize:"20px", padding:"8px", borderRadius:"10px"}}>
                    <input type="file" name="backgroundImage" accept=".jpg,.png,.img,.jpeg" onChange={e=>updateBackground(e)}></input>
                    Edit Banner Picture</label>
                    </span> 
                : <></>}
            </div>


            <div className="container">

                    <div className="row">
            
                    <div  style={{backgroundColor: "grey",marginTop: '0.5rem', backgroundSize: 'cover',backgroundRepeat: "no-repeat ",color: "white", borderRadius: "100px", backgroundImage:`url(${platform.platformPicture})`, height:"200px", width:"200px"}}>
                    {platformOwner !== false ?
                    <MDBBtn rounded size='sm' style={{backgroundColor: "#640979"}}><PencilFill color="white" size={20}/></MDBBtn>
                    : <></>}   
                    </div>
                       
                     <div className="col" style={{marginTop: '4rem'}}>
                         <span style={{fontSize: "20px", color: "white" , marginLeft: '6rem'}}>Subscribers<span style={{fontSize: "15px",display: "block", fontWeight: "bold", marginLeft: '6rem'}}>{platform.subscriberCount}</span></span>
                    </div>
                     <div className="col" style={{marginTop: '4rem'}}>
                     <span style={{fontSize: "20px", color: "white" }}>Quizzes<span style={{fontSize: "15px",display: "block", fontWeight: "bold"}}>{(platform.quizzes).length}</span></span>
                    </div>
                    <div className="col" style={{marginTop: '4rem'}}>
                    {platformOwner !== false ? 
                    <Link to={`/platform/${platformId}/create`}>
                        <MDBBtn rounded size='lg' style={{backgroundColor: "#640979"}}>Create</MDBBtn>
                    </Link>
                    :
                    <>
                    { store && store.userInfo &&
                        <SubscribeButton platformId={platformId} /> 
                    }
                    </>
                    }
                    </div>
                 </div>

                        <div className="col" style={{color: "white"}}>
                          <span style={{fontSize: "25px", marginRight: '1rem', marginTop: "1rem"}}>{platform.name}</span>
                          {platformOwner !== false ?
                          <MDBBtn rounded size='sm' style={{backgroundColor: "#640979"}}><PencilFill color="white" size={20}/></MDBBtn>
                          : <></>}  
                          </div>
            </div>

            {(platform.quizzes) !== undefined ?              
            <div style={{ marginBottom: '5rem', marginTop: '5rem'}}>
                
                {(platform.quizzes).length !== 0 ?
                <Carousel breakPoints={breakPoints}>
                
                {quizList.map((quiz) => (
                     <ItemCarousel onClick={()=>linkTo(quiz.id)} style={{color: '#FFFFFF', backgroundRepeat: "no-repeat",
                     backgroundPosition: "center",
                     backgroundSize: "cover",backgroundImage:`url(${quiz.backgroundImage})`}}></ItemCarousel>
                  ))}
                </Carousel>
            : <h1 style={{color: "white", textAlign: "center"}}>You haven't created a quiz yet.</h1>}
            </div>
            : <h1 style={{color: "white", textAlign: "center"}}>Loading</h1>}
            {platformOwner !== false ?
            <MDBBtn rounded className='mx-2' color='danger' style={{marginBottom: "1rem"}} onClick={()=>deletePlatformAction()}>
                 DELETE PLATFORM
            </MDBBtn>
            : <></>}  
        </div>

        :<span> Loading... </span>}</>
    );
}

export default PlatformPage;