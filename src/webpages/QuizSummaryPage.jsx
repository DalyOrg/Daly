import React from "react";
import toy from './toystory.jpg'
import * as mdb from 'mdb-ui-kit'; // lib
import { Input } from 'mdb-ui-kit'; // module
import { MDBFooter } from 'mdb-react-ui-kit';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';

const QuizSummaryPage = () => {
    return (
        
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
            
            
                <MDBCardTitle className='d-flex justify-content-center'>Toy Story Quiz</MDBCardTitle>
                <MDBCardTitle className='d-flex justify-content-center'>By PIXAR</MDBCardTitle>
                <p className='d-flex justify-content-center'>Time Limit:</p>
                <p className='d-flex justify-content-center'>Number of Questions: </p>
                <p className='d-flex justify-content-center'>Attempt: </p>
                <div className='d-flex justify-content-center'>
                <MDBBtn rounded style={{color: "white", backgroundColor: "#00B5FF"}}>Take Quiz</MDBBtn>
                </div>
                
                
            </MDBCardBody>
        </MDBCard>
          </div>
        </div>
      </div>
       
        
    );
}

export default QuizSummaryPage;