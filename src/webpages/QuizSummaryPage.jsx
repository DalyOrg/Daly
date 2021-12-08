import React from "react";

import * as mdb from 'mdb-ui-kit'; // lib
import { Input } from 'mdb-ui-kit'; // module
import { MDBFooter } from 'mdb-react-ui-kit';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import { useHistory, useParams } from 'react-router';
import { useCallback } from 'react';
import { useEffect, useState, useRef } from 'react';
import { getQuiz, getQuizComments, postQuizComment } from '../adapters/quiz';
import { getOtherUser } from '../adapters/user';
import LikeButton from "../components/LikeButton";
import { ChatTextFill } from "react-bootstrap-icons";
import { FlagFill } from "react-bootstrap-icons";
import { Link as Link2 } from 'react-scroll';
import { Link as Link } from 'react-router-dom';
import { useGlobalStore } from "../store/useGlobalStore";
import ReportModal from "../components/ReportModal";
import { Ellipsis } from "react-bootstrap/esm/PageItem";

const QuizSummaryPage = () => {
    const myRef = useRef(null)
    const {quizId} = useParams();
    const [quiz, setQuiz] = useState();
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [isCommentButtonReady, setIsCommentButtonReady] = useState(true);
    const [store] = useGlobalStore();
    const history = useHistory();
    const [reportMetadata, setReportMetadata] = useState();

    const initQuiz = useCallback(async function(){
        let quizObj = await getQuiz(quizId);
        setQuiz(quizObj); 
    }, [quizId])

    useEffect(() => {
        initQuiz();
    }, [initQuiz]);

    const initComments = useCallback(async function(){
      if(quiz){ // check if quiz exists
        let commentsObj = await getQuizComments(quiz.id);
        setComments(commentsObj.comments);
        commentsObj.comments.forEach(async (comment, indx) => {
          let userData = await getOtherUser(comment.userId);
          setComments((prevState) => {
            let newComments = [...prevState];
            newComments[indx] = {...newComments[indx], ...userData};
            return newComments;
          })
        })
      }
    }, [quiz])

    useEffect(() => {
        initComments();
    }, [initComments]);

    async function postComment(){
      setIsCommentButtonReady(false);
      await postQuizComment(quizId, commentInput);
      await initComments();
      setIsCommentButtonReady(true);
    }
    
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
          <MDBCard style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', maxWidth: '33rem' }}>
              
            <MDBCardBody>
            <div class="btn-group-horizontal" >
            
            <MDBBtn 
              disabled={!(store && store.userInfo && store.userInfo.platformsOwned.includes(quiz.platformId))}
              rounded style={{marginLeft: "1rem" ,marginRight: "12rem", color: "white", backgroundColor: "#5321d0"}}
              onClick={() => history.push(`/quiz/${quizId}/edit`)}
            >
                Edit Quiz
            </MDBBtn>

            <Link to={`/quiz/${quizId}/leaderboard`}>
            <MDBBtn rounded style={{marginLeft: "1rem",color: "white", backgroundColor: "#5321d0"}}>Leader Board</MDBBtn>
            </Link>
            </div>
            
            
                <MDBCardTitle className='d-flex justify-content-center'>{quiz.name}</MDBCardTitle>
                <MDBCardTitle style={{ marginBottom: '1.5rem' }} className='d-flex justify-content-center'>{quiz.creator}</MDBCardTitle>
                <p className='d-flex justify-content-center'>Time Limit: {quiz.timeLimitSeconds}</p>
                <p className='d-flex justify-content-center'>Number of Questions: {quiz.questions.length}</p>
                
                <div className='d-flex justify-content-center'>
                <Link to={`/quiz/${quizId}/take`}>
                <MDBBtn rounded style={{color: "white", backgroundColor: "#5321d0"}}>Take Quiz</MDBBtn>
                </Link>
                </div>
                <div
                  className='d-flex justify-content-center mt-3 gap-3'
                >
                  <MDBBtn
                    style={{color: "white", backgroundColor: "#5321d0"}}
                    onClick={() => {
                      history.push(`/platform/${quiz.platformId}`)
                    }}
                  >
                    Platform
                  </MDBBtn>
                  { store && store.userInfo &&
                  <LikeButton
                    quiz={quiz}
                    setQuiz={setQuiz}
                  />
                  }
                </div>
                
                
            </MDBCardBody>
        </MDBCard>
          </div>
        </div>
        
      </div>
      <div>
      <Link2 activeClass="active" to="comments" spy={true} smooth={true}>
        <button className="btn-block" data-bs-target="#collapseTarget" data-bs-toggle="collapse" style={{backgroundColor: "#5321d0", height: "8vh"}}>
        <ChatTextFill style={{color:"white"}}size={30}></ChatTextFill>
            <span style={{fontSize: '15px', marginLeft: '10px', color: "white"}}>Comments</span>
        </button>
        </Link2>
        <div className="collapse" id="collapseTarget">

    { store && store.userInfo &&
    <>
      <input
        type="text"
        className="form-control" 
        required placeholder="Comment" 
        style={{ marginLeft:"60px", marginTop: "20px", marginBottom: "15px"}}
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
      />
      <MDBBtn
        rounded
        style={{color: "white", backgroundColor: "#5321d0", marginLeft:"60px", marginBottom: "10px"}}
        disabled={!isCommentButtonReady}
        onClick={postComment}
      >
        Submit
      </MDBBtn>
    </>
    }

         <div id="comments"className="container-sm" style={{maxHeight: "40vh", overflowY: "scroll", marginTop: "20px"}}>

       
          
      { comments &&
        comments.map((comment) => 
        <div className="card" style={{backgroundColor: "#640979", marginBottom: "10px", maxHeight: "25vh", overflowX: 'hidden'}}>
            <div className="row row-cols-3">
              <div className="col">
               <div className="col">
                  <img width="100"
                    style={{borderRadius:"50%", marginTop: "10px", objectFit: "cover", marginLeft: "10px"}}
                    height="100"
                    alt='User Profile'
                    src={`${comment.profilePicture ? comment.profilePicture :
                      'https://i.imgur.com/gpOVR3I.png'
                    }`}
                  />
                  <p style={{color: "white", marginLeft: "13px", overflow: "hidden", maxWidth: "115px", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{comment.username ? comment.username : 'loading...'}</p>
                </div>
                
              { store && store.userInfo &&
              <div className="col" style={{marginTop: "5px", marginLeft: "30px"}}>
                <MDBBtn rounded style={{color: "white", backgroundColor: "red", marginBottom: "10px"}}
                  data-bs-toggle="modal" data-bs-target="#reportModal"
                  onClick={() => setReportMetadata({
                    type: 'comment', quizId: quiz.id,
                    userId: comment.userId, commentText: comment.commentText
                  })}
                >
                  <FlagFill />
                </MDBBtn>
              </div>
              }
              </div>
             <div className="col my-auto"  style={{color: "white"}}> {comment.commentText} </div>
             <div className="col" style={{color: "grey"}}>posted on {(new Date(comment.timestamp._seconds*1000)).toLocaleString('en-us')}</div>
          </div>
        </div>
        )
        }

         </div>
         
         
         </div>
   
     </div>
     </>
      :<span> Loading... </span>}
      <ReportModal
        reasons={['Offensive Language', 'Quiz Spoilers', 'Other']}
        metadata={reportMetadata}
      />
    </>  
    );
}

export default QuizSummaryPage;