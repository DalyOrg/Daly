
import React, { Component } from 'react'
import Carousel from 'react-elastic-carousel';
import ItemCarousel from "../components/ItemCarousel";
import { MDBBtn } from 'mdb-react-ui-kit';

  let breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 550, itemsToShow: 2 },
        { width: 768, itemsToShow: 3 },
        { width: 1200, itemsToShow: 4 },
      ];
      const activateLasers = () => {
        console.log("EMREEE");
    }
export default class HomePageComponent extends Component {

    render() {
        return (
            <div style={{backgroundColor: "#360118"}}>
        
            <div style={{ marginBottom: '5rem', marginTop: '3rem'}} className="App">
           <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' }}>Trending</h1> 
              <Carousel breakPoints={breakPoints}>
                  <ItemCarousel>One</ItemCarousel>
                <ItemCarousel onClick={activateLasers}>Two</ItemCarousel>
                <ItemCarousel>Three</ItemCarousel>
                <ItemCarousel>Four</ItemCarousel>
                <ItemCarousel>Five</ItemCarousel>
                <ItemCarousel>Six</ItemCarousel>
                <ItemCarousel>Seven</ItemCarousel>
                <ItemCarousel>Eight</ItemCarousel>
              </Carousel>
              </div>
                <div>
                <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' }}>From Your Subscriptions</h1>
                <Carousel breakPoints={breakPoints}>
                  <ItemCarousel>One</ItemCarousel>
                <ItemCarousel onClick={activateLasers}>Two</ItemCarousel>
                <ItemCarousel>Three</ItemCarousel>
                <ItemCarousel>Four</ItemCarousel>
                <ItemCarousel>Five</ItemCarousel>
                <ItemCarousel>Six</ItemCarousel>
                <ItemCarousel>Seven</ItemCarousel>
                <ItemCarousel>Eight</ItemCarousel>
              </Carousel>
    
                </div>
              
            
          </div>
        )
    }
}


