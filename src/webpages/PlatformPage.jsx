import React from "react";
import "./platformPage.css";
import {  MDBBtn } from 'mdb-react-ui-kit';
import { PencilFill } from 'react-bootstrap-icons';
import ItemCarousel from "../components/ItemCarousel";
import Carousel from 'react-elastic-carousel';
import { useGlobalStore } from "../store/useGlobalStore";
import { getPlatform, deletePlatform, putPlatformBanner, putPlatformPic, putPlatformName } from '../adapters/platform';
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
      const [subCount, setSubCount] = useState();

    const [uploadProgress, setUploadProgress] = useState("");
    const [platformPic, setPlatformPic] = useState();
    const [platformBanner, setPlatformBanner] = useState();

    const history = useHistory();
  
    const linkTo = (quizId) => {

      history.push(`/quiz/` + quizId);
    }

    const [name, setName] = useState();
    const [resetModal, setResetModal] = useState(0);

    async function deletePlatformAction(){
        var res = await deletePlatform(platform.id);
        history.push("/" + platform.ownerId + '/platformpicker');
        window.location.reload();
    }

    var platformOwner = false;
  
      const initPlatform = useCallback(async function(){
          let platformObj = await getPlatform(platformId);
          setPlatform(platformObj); 
          setSubCount(platformObj.subscriberCount);
          setPlatformBanner(platformObj.platformBanner);
          setPlatformPic(platformObj.platformPicture);
      }, [platformId])

    useEffect(() => {
        initPlatform();
    }, [initPlatform]);
    

 

   if(store.userInfo !== undefined){

    if(store.userInfo.platformsOwned !== undefined){
        platformOwner = store.userInfo.platformsOwned.includes(platformId);
    }
   

   }

   const uploadImage =async (base64EncodedImage)=>{
    setUploadProgress("Uploading...");
    var url = await uploadUserImage(base64EncodedImage);
    setUploadProgress("Upload Complete!");
    if(url){
      return url.data;
    }else{
      console.log("unable to grab link", url);
    }
  }

   async function updateBackground(){
      var url = await uploadImage(platformBanner);
      setPlatform({...platform, platformBanner:url});
      await putPlatformBanner(platform.id, url);
   }

   async function updatePlatformPic(){
        var url = await uploadImage(platformPic);
        setPlatform({...platform, platformPicture:url});
        await putPlatformPic(platform.id, url);
   }

   async function updatePlatformName(name){
        setPlatform({...platform, name: name});
        await putPlatformName(platform.id, name);
   }

  //  const initQuiz = useCallback(async function(quizId){
  //     let quizObj = await getQuiz(quizId);
  //     console.log("quiz",quizObj);
  //     setQuizList([...quizList, quizObj])
  //   },[platform])

  // useEffect(() => {
  //   if(platform !== undefined){
  //     platform.quizzes.forEach((quiz) => initQuiz(quiz));
  //   }
  // }, [initQuiz]);


  const initQuiz = useCallback(async function(){
    if(store !== undefined && platform !== undefined){
      setQuizList(platform.quizzes);
      platform.quizzes.forEach(async(quiz,index) => 
        {
          let quizObj = await getQuiz(quiz);
          setQuizList((prevState) =>
          {
            let newQuizList = [...prevState];
            newQuizList[index] = quizObj;
            return newQuizList;
          }
          );
        }
      )
    }
  }, [platform,store])


  
  useEffect(() => {
    initQuiz();
}, [initQuiz]);

  const subsChange = function(amount){
    setSubCount(subCount+amount);
  }

    return (
        <>
        {platform !== undefined ?
        <div>
            <div className="platformBanner" style={{backgroundSize: 'cover',backgroundImage:`url(${platform.platformBanner})`, backgroundPositionX: "center",backgroundPositionY: "center"}}>
                {platformOwner !== false ?
                <span className="changeBannerButton">                   
                {/* <label className={"btn waves-effect"} style={{backgroundColor: "#640979", cursor: "pointer", color:"white", fontSize:"15px", padding:"8px", borderRadius:"10px"}}>
                    <input type="file" name="backgroundImage" accept=".jpg,.png,.img,.jpeg" ></input>
                    Edit Banner Picture</label> */}
                    <button className={"btn waves-effect"} data-bs-toggle="modal" data-bs-target="#platformBannerModal" style={{backgroundColor: "#640979", cursor: "pointer", color:"white", fontSize:"15px", padding:"8px", borderRadius:"10px"}}>Edit Banner Picture</button>
                    </span> 
                : <></>}
            </div>


            
            <div className="container">
                    <div className="d-flex bd-highlight mb-3">
                    <div className="p-2 bd-highlight" >
                    <div  style={{backgroundColor: "grey", backgroundSize: 'cover',backgroundPositionX: "center",backgroundPositionY: "center",backgroundRepeat: "no-repeat ",color: "white", borderRadius: "100px", backgroundImage:`url(${platform.platformPicture})`, height:"200px", width:"200px"}}>
                    {platformOwner !== false ?
                    // <label className={"btn waves-effect"} style={{backgroundColor: "#640979", cursor: "pointer", color:"white", fontSize:"20px", padding:"8px", borderRadius:"20px"}}>
                    // <input type="file" name="backgroundImage" accept=".jpg,.png,.img,.jpeg" onChange={e=>updatePlatformPic(e)}></input>
                    // <PencilFill color="white" size={20}/></label>
                    <button className={"btn waves-effect"} data-bs-toggle="modal" data-bs-target="#platformPicModal" style={{backgroundColor: "#640979", cursor: "pointer", color:"white", fontSize:"20px", padding:"8px", borderRadius:"20px"}}><PencilFill color="white" size={20}/></button>
                    : <></>}   
                    
                    </div>
                    <p style={{fontSize: "25px", textAlign: "center", color: "white"}}>{platform.name}
                      <span style={{}}>
                      {platformOwner !== false ?
                          <MDBBtn 
                          data-mdb-toggle="modal" 
                          data-mdb-target="#nameModal" 
                          onClick  = {()=>{
                            setName(platform.name);
                            setResetModal(resetModal +1);
                          }}
                          rounded size='sm' style={{backgroundColor: "#640979"}}><PencilFill color="white" size={20}/></MDBBtn>
                          : <></>}  

                      </span>
                    
                    </p>
                    
                          
                    </div>
                       
                     <div className="mx-auto mx-5 mt-5" style={{}}>
                         <span style={{fontSize: "20px", color: "white"}}>Subscribers<span style={{fontSize: "15px",display: "block", fontWeight: "bold"}}>{subCount}</span></span>
                    </div>
                     <div className="mx-auto mx-5 mt-5" style={{}}>
                     <span style={{fontSize: "20px", color: "white" }}>Quizzes<span style={{fontSize: "15px",display: "block", fontWeight: "bold"}}>{(platform.quizzes).length}</span></span>
                    </div>
                    <div className="ms-auto p-2 bd-highlight" style={{}}>
                    {platformOwner !== false ? 
                    <Link to={`/platform/${platformId}/create`}>
                        <MDBBtn className='me-auto' rounded size='lg' style={{backgroundColor: "#640979"}}>Create</MDBBtn>
                    </Link>
                    :
                    <>
                    { store && store.userInfo &&
                        <SubscribeButton 
                        platformId={platformId}
                        subsChange = {subsChange}
                        /> 
                    }
                    </>
                    }
                    </div>
                 </div>
                 </div>
                        
            

            {(platform.quizzes) !== undefined ?              
            <div key={quizList} style={{marginTop: "3rem"}}>
                
                {(platform.quizzes).length !== 0 ?
                <Carousel key={quizList} breakPoints={breakPoints}>
                
                {quizList.map((quiz) => (
                     <ItemCarousel key={quizList} onClick={()=>linkTo(quiz.id)} style={{color: '#FFFFFF', backgroundRepeat: "no-repeat",
                     backgroundPosition: "center",
                     backgroundSize: "cover",backgroundImage:`url(${quiz.backgroundImage})`}}></ItemCarousel>
                  ))}
                </Carousel>
            : <h1 style={{color: "white", textAlign: "center"}}>No quiz exists yet.</h1>}
            </div>
            : <h1 style={{color: "white", textAlign: "center"}}>Loading</h1>}
            {platformOwner !== false ?
            <MDBBtn rounded className='mx-2' color='danger' style={{marginTop: "4rem"}} data-bs-toggle="modal" data-bs-target="#deleteModal">
                 DELETE PLATFORM
            </MDBBtn>
            : <></>}  
        </div>

            :<span> Loading... </span>}
        
        {/* modal for name change */}
<div class="modal hide fade in" style={{pointerEvents: 'none'}} id="nameModal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog" style={{pointerEvents: 'all'}}>
    <div class="modal-content">
      <div class="modal-header" style={{backgroundColor: 'purple'}}>
        <h5 class="modal-title" id="editModalLabel" style={{color: "white"}}>Platform Name Change</h5>
        <button type="button" onClick={()=>setName('')} class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-center pb-0" style={{maxHeight: '460px', overflowY:'auto'}}>
          <span key={resetModal}>
                <input type="text" id="name" name="name" defaultValue={name} required 
                            onChange={
                            e=>setName(e.target.value)
                            }/></span>
          <div class="row col-4 offset-4 my-2 mb-3">
            <button type="button" onClick={()=>updatePlatformName(name)} class="btn btn-primary" data-mdb-dismiss="modal" style={{backgroundColor: '#00B5FF'}}>
                Save
            </button>
      </div>
      </div>
    </div>
   </div>
</div>

{/* banner change modal */}
<div id="platformBannerModal" className="modal fade" tabindex="-1">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Change Platform Banner Picture</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>setUploadProgress("")}></button>
      </div>
      <div className="modal-body">
      <label style={{color: "white", backgroundColor: "#8B008B", borderRadius: '50px'}} className="upload-button">
                                <input type="file"  accept=".jpg,.png,.img" onChange={event=>{
                                  var file=event.target.files[0];

                                  let reader = new FileReader();
                                  reader.onloadend = function() {
                                      setPlatformBanner(reader.result);
                                  }
                                  reader.readAsDataURL(file);
                                }}>
                                </input>
                                Upload Image</label>
      <div>
          {platformBanner !== undefined ? <img style={{width:'70%', height: '70%', position: 'relative'}} src={platformBanner}/> : ""}                          
      </div>
                                
      </div>
      <div className="modal-footer">
        <h3 key={uploadProgress}>{uploadProgress}</h3>
        <p>note it will take longer for image to update if the file is big</p>
        <MDBBtn rounded type="button" onClick={()=>updateBackground()} style={{color: "white", backgroundColor: "#00B5FF"}}>Submit</MDBBtn>
      </div>
    </div>
  </div>
</div>

{/* pic change modal */}
<div id="platformPicModal" className="modal fade" tabindex="-1">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Change Platform Picture</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>setUploadProgress("")}></button>
      </div>
      <div className="modal-body">
      <label style={{color: "white", backgroundColor: "#8B008B", borderRadius: '50px'}} className="upload-button">
                                <input type="file"  accept=".jpg,.png,.img" onChange={event=>{
                                  var file=event.target.files[0];

                                  let reader = new FileReader();
                                  reader.onloadend = function() {
                                      setPlatformPic(reader.result);
                                  }
                                  reader.readAsDataURL(file);
                                }}>
                                </input>
                                Upload Image</label>
      <div>
          {platformBanner !== undefined ? <img style={{width:'70%', height: '70%', position: 'relative'}} src={platformPic}/> : ""}                          
      </div>
                                
      </div>
      <div className="modal-footer">
        <h3 key={uploadProgress}>{uploadProgress}</h3>
        <p>note it will take longer for image to update if the file is big</p>
        <MDBBtn rounded type="button" onClick={()=>updatePlatformPic()} style={{color: "white", backgroundColor: "#00B5FF"}}>Submit</MDBBtn>
      </div>
    </div>
  </div>
</div>

<div id="deleteModal" className="modal fade" tabindex="-1">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Delete Platform</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <p>Are you sure about deleting this platform?</p>
      </div>
      <div className="modal-footer">
      <MDBBtn rounded data-bs-dismiss="modal" style={{color: "white", backgroundColor: "#00B5FF"}}>Close</MDBBtn>
        
        <button type="button" data-bs-dismiss="modal" onClick={()=>deletePlatformAction()} class="btn btn-danger">Delete Platform</button>
      </div>
    </div>
  </div>
</div>

        </>
    );
}

export default PlatformPage;