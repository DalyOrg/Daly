import React from "react";

import * as mdb from 'mdb-ui-kit'; // lib
import { Input } from 'mdb-ui-kit'; // module
import { MDBFooter } from 'mdb-react-ui-kit';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import { useHistory, useParams } from 'react-router';
import { useCallback } from 'react';
import { useEffect, useState, useRef } from 'react';
import { getQuiz } from '../adapters/quiz';
import LikeButton from "../components/LikeButton";
import { ChatTextFill } from "react-bootstrap-icons";
import { FlagFill } from "react-bootstrap-icons";
import { Link as Link2 } from 'react-scroll';
import { Link as Link } from 'react-router-dom';

const QuizSummaryPage = () => {
    const myRef = useRef(null)
    const {quizId} = useParams();
    const [quiz, setQuiz] = useState();
    const history = useHistory();

    const initQuiz = useCallback(async function(){
        let quizObj = await getQuiz(quizId);
        setQuiz(quizObj); 
    }, [quizId])


    useEffect(() => {
        initQuiz();
    }, [initQuiz]);

    
    return (
        <>
        {quiz !== undefined ?
        <>
        <div className='bg-image' style={{backgroundImage: `url(${quiz.backgroundImage})`,
        backgroundSize: "cover",
        height: "100vh",
        color: "#f5f5f5" }}>
        <div className='mask'>
          <div className='d-flex justify-content-center align-items-center h-100'>
          <MDBCard style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', maxWidth: '33rem' }}>
              
            <MDBCardBody>
            <div class="btn-group-horizontal" >
            
            <Link to={`/quiz/${quizId}/edit`}>
            <MDBBtn rounded style={{marginLeft: "1rem" ,marginRight: "12rem", color: "white", backgroundColor: "#00B5FF"}}>Edit Quiz</MDBBtn>
            </Link>

            <MDBBtn rounded style={{marginLeft: "1rem",color: "white", backgroundColor: "#00B5FF"}}>Leader Board</MDBBtn>
            </div>
            
            
                <MDBCardTitle className='d-flex justify-content-center'>{quiz.name}</MDBCardTitle>
                <MDBCardTitle style={{ marginBottom: '1.5rem' }} className='d-flex justify-content-center'>{quiz.creator}</MDBCardTitle>
                <p className='d-flex justify-content-center'>Time Limit: {quiz.timeLimitSeconds}</p>
                <p className='d-flex justify-content-center'>Number of Questions: {quiz.questions.length}</p>
                <p className='d-flex justify-content-center'>Attempt: </p>
                <div className='d-flex justify-content-center'>
                <Link to={`/quiz/${quizId}/take`}>
                <MDBBtn rounded style={{color: "white", backgroundColor: "#00B5FF"}}>Take Quiz</MDBBtn>
                </Link>
                </div>
                <div
                  className='d-flex justify-content-center mt-3 gap-3'
                >
                  <MDBBtn
                    style={{color: "white", backgroundColor: "#00B5FF"}}
                    onClick={() => {
                      history.push(`/platform/${quiz.platformId}`)
                    }}
                  >
                    Platform
                  </MDBBtn>
                  <LikeButton
                    quiz={quiz}
                    setQuiz={setQuiz}
                  />
                </div>
                
                
            </MDBCardBody>
        </MDBCard>
          </div>
        </div>
        
      </div>
      <div>
      <Link2 activeClass="active" to="comments" spy={true} smooth={true}>
         <button className="btn-block" data-bs-target="#collapseTarget" data-bs-toggle="collapse" style={{backgroundColor: "#8B008B", height: "8vh"}}>
         <ChatTextFill style={{color:"white"}}size={30}></ChatTextFill>
             <span style={{fontSize: '15px', marginLeft: '10px', color: "white"}}>Comments</span>
         </button>
         </Link2>
         <div className="collapse" id="collapseTarget">
         <input style={{ marginLeft:"60px", marginTop: "20px", marginBottom: "15px"}} type="text" class="form-control" required placeholder="Comment" 
     
    ></input>

    <MDBBtn rounded style={{color: "white", backgroundColor: "#00B5FF", marginLeft:"60px", marginBottom: "10px"}}>Submit</MDBBtn>

         <div id="comments"className="container-sm" style={{maxHeight: "40vh", overflowY: "scroll", marginTop: "20px"}}>

       
          
      <div className="card" style={{backgroundColor: "#8B008B", marginBottom: "10px", maxHeight: "25vh", overflowY: "scroll", overflowX: 'hidden'}}>
          <div className="row row-cols-3">
          
            <div className="col">

             <div className="col"><img width="100" style={{borderRadius:"50%", marginTop: "10px", marginLeft: "10px"}} height="100" src="https://media.istockphoto.com/photos/side-view-of-maine-coon-sitting-and-looking-away-picture-id102716889?k=20&m=102716889&s=612x612&w=0&h=A4CvsPKg1CrrSp6b5Rnf8oc2RkIjaaQinUCJuBXYEL8="></img></div>
             <div className="col" style={{color: "white", marginLeft: "25px"}}>Emre Ban</div>
             <div className="col" style={{marginTop: "5px", marginLeft: "30px"}}><MDBBtn rounded style={{color: "white", backgroundColor: "red", marginBottom: "10px"}}><FlagFill></FlagFill></MDBBtn></div>
            </div>
        
         
           <div className="col my-auto"  style={{color: "white"}}> I really liked it</div>
          
           <div className="col" style={{color: "grey"}}>posted on 10/11/2021 at 10:59PM</div>
          
        </div>
      </div>

         </div>
         
         
         </div>
   
     </div>
     </>
      :<span> Loading... </span>}</>
        
    );
}

export default QuizSummaryPage;