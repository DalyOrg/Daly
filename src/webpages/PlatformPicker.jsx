import React from "react";
import ItemCarousel from "../components/PlatformPickerCarousel";
import Carousel from 'react-elastic-carousel';
import { useEffect, useState } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import { useParams } from 'react-router';
import { useHistory } from 'react-router';
import "../carousel.css";

const PlatformPicker = () => {

    

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
  
    const linkTo = () => {
      history.push(`/platform/56hs460NfmSBiqE1jx8n`);
    }


    return (
        <div>
            <h1 className='d-flex justify-content-center' style={{color: '#FFFFFF', marginTop: '2rem'}}>Platforms</h1>

                <MDBBtn onClick={ () => incrementSelectedQuestion()} style={{marginLeft: "1rem" , marginBottom: '1rem',color: "white", backgroundColor: "#00B5FF"}}>Add a Platform</MDBBtn>
               
            <div style={{ marginBottom: '5rem', marginTop: '5rem'}}>
                <Carousel>
                {someVar.map((pic) => (
                    
                     <ItemCarousel onClick={linkTo} style={{color: '#FFFFFF',backgroundSize: 'cover',backgroundImage:`url(${pic})`}}> <span>Disney</span></ItemCarousel>
                  ))}
                </Carousel>
            </div>
        </div>
    );
}

export default PlatformPicker;