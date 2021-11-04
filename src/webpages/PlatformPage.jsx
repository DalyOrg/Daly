import React from "react";
import "./platformPage.css";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBBtnGroup } from 'mdb-react-ui-kit';
import { PencilFill } from 'react-bootstrap-icons';
import ItemCarousel from "../components/ItemCarousel";
import Carousel from 'react-elastic-carousel';


let breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 },
  ];
const PlatformPage = () => {
   
 

    const pictures = ["https://cdn.onebauer.media/one/empire-tmdb/films/127585/images/ai9UKd8KownQKGIh1m5p3DuEeMm.jpg?format=jpg&quality=80&width=960&height=540&ratio=16-9&resize=aspectfill",
     "https://hips.hearstapps.com/digitalspyuk.cdnds.net/17/21/1495551278-guardians-of-the-galaxy-vol-2-cast.jpg", 
     "https://m.media-amazon.com/images/M/MV5BNjUzNzc3NjQ4OF5BMl5BanBnXkFtZTgwNzgyODI4NjM@._V1_.jpg",
      "https://www.cnet.com/a/img/bt5N5n2-PK73HYAx2FM0wsRs_no=/1200x630/2019/04/19/f20d0d6a-1781-49a4-90ab-e285109b65b2/avengers-endgame-imax-poster-crop.png", 
      "https://www.cnet.com/a/img/5OVL3iMZjo0wld8Uj15_C00bqKo=/940x0/2021/09/03/afa4abf1-ea46-45bf-b4d0-84259920a236/qlwgiefucodivdzjgil7.jpg"];


    return (
        <div>
            <div className="platformBanner" style={{backgroundSize: 'cover',backgroundImage:`url(https://www.thetruecolors.org/wp-content/uploads/2021/02/marvel-logo-header-1.jpg)`}}>
                <span className="changeBannerButton"><MDBBtn style={{backgroundColor: "#00B5FF"}}>Edit Banner Picture</MDBBtn></span>
  
            </div>


            <div class="container">

                    <div class="row">
            
                    <div  style={{marginTop: '0.5rem', backgroundSize: 'cover',backgroundRepeat: "no-repeat ",color: "white", borderRadius: "100px", backgroundImage:`url(https://i.etsystatic.com/13260891/r/il/b4ff68/2708215129/il_570xN.2708215129_c0k6.jpg)`, height:"200px", width:"200px"}}>
                    <MDBBtn rounded size='sm' style={{backgroundColor: "#00B5FF"}}><PencilFill color="white" size={20}/></MDBBtn>
                        </div>
                       
                     <div class="col" style={{marginTop: '4rem'}}>
                         <span style={{fontSize: "20px", color: "white" , marginLeft: '6rem'}}>Subscribers<span style={{fontSize: "15px",display: "block", fontWeight: "bold", marginLeft: '6rem'}}>25K</span></span>
                    </div>
                     <div class="col" style={{marginTop: '4rem'}}>
                     <span style={{fontSize: "20px", color: "white" }}>Quizzes<span style={{fontSize: "15px",display: "block", fontWeight: "bold"}}>20</span></span>
                    </div>
                    <div class="col" style={{marginTop: '4rem'}}>
                    <MDBBtn rounded size='lg' style={{backgroundColor: "#00B5FF"}}>Create</MDBBtn>
                    </div>
                 </div>

                        <div class="col" style={{color: "white"}}>
                          <span style={{fontSize: "25px", marginRight: '1rem', marginTop: "1rem"}}>Marvel Platform</span>
                          <MDBBtn rounded size='sm' style={{backgroundColor: "#00B5FF"}}><PencilFill color="white" size={20}/></MDBBtn>
                     </div>
            </div>


            <div style={{ marginBottom: '5rem', marginTop: '5rem'}}>
                <Carousel breakPoints={breakPoints}>
                {pictures.map((pic) => (
                     <ItemCarousel style={{color: '#FFFFFF',backgroundSize: 'cover',backgroundImage:`url(${pic})`}}></ItemCarousel>
                  ))}
                </Carousel>
            </div>

            <MDBBtn rounded className='mx-2' color='danger' style={{marginBottom: "1rem"}}>
                 DELETE PLATFORM
            </MDBBtn>
        </div>

        
    );
}

export default PlatformPage;