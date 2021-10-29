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
        <div className='mask' >
          <div className='d-flex justify-content-center align-items-center h-100'>
          <MDBCard style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', maxWidth: '33rem' }}>
            <MDBCardBody>
                <MDBCardTitle>Card title</MDBCardTitle>
            <MDBCardText>
                 Some quick example text to build on the card title and make up the bulk of the card's content.
            </MDBCardText>
                <MDBBtn>Button</MDBBtn>
            </MDBCardBody>
        </MDBCard>
          </div>
        </div>
      </div>
       
        
    );
}

export default QuizSummaryPage;