import React from "react";
import toy from './toystory.jpg'
import * as mdb from 'mdb-ui-kit'; // lib
import { Input } from 'mdb-ui-kit'; // module
import { MDBFooter } from 'mdb-react-ui-kit';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { getQuiz } from '../adapters/quiz';

const QuizSummaryPage = () => {
    const {quizId} = useParams();
    const [quiz, setQuiz] = useState();

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
        <div className='bg-image' style={{backgroundImage: 'url('+toy+')',
        backgroundSize: "cover",
        height: "100vh",
        color: "#f5f5f5" }}>
        <div className='mask'>
          <div className='d-flex justify-content-center align-items-center h-100'>
          <MDBCard style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', maxWidth: '33rem' }}>
              
            <MDBCardBody>
            <div class="btn-group-horizontal" >
            <MDBBtn rounded style={{marginLeft: "1rem" ,marginRight: "12rem", color: "white", backgroundColor: "#00B5FF"}}>Edit Quiz</MDBBtn>
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
                
                
            </MDBCardBody>
        </MDBCard>
          </div>
        </div>
      </div>
      :<span> Loading... </span>}</>
        
    );
}

export default QuizSummaryPage;