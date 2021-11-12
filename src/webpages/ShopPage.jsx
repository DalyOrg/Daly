import React from "react";
import { useGlobalStore } from "../store/useGlobalStore";
import {useContext, useState} from "react";
import ItemCarousel from "../components/ItemCarousel";
import Carousel from 'react-elastic-carousel';
import { GlobalStoreContext } from '../store/useGlobalStore';
import {MDBBtn } from 'mdb-react-ui-kit';

const ShopPage = () => {

    const [store] = useContext(GlobalStoreContext);
    const [item, setItem] = useState();

    let breakPoints = [
        { width: 1, itemsToShow: 2 },
        { width: 550, itemsToShow: 3 },
        { width: 768, itemsToShow: 4 },
        { width: 1200, itemsToShow: 5 },
      ];

      const pictures = ["https://grid-paint.com/images/png/5634464558350336.png",
       "https://grid-paint.com/images/png/4624511991283712.png",
       "https://www.kindpng.com/picc/m/15-156291_iron-man-png-iron-man-8-bit-iron.png",
       "https://www.pngfind.com/pngs/m/15-158318_bulbasaur-pixel-sprite-mario-flower-pixel-hd-png.png",
       "https://cdna.artstation.com/p/assets/images/images/004/983/380/large/mar-daniel-garcia-8-bit-art-batman.jpg?1487654590",
        "https://ctl.s6img.com/society6/img/BBwaqn3kl90gxakf4t4ukdoulJQ/w_700/prints/~artwork/s6-0016/a/5492688_12740327/~~/deadpool-8-bit-prints.jpg",
    "https://grid-paint.com/images/png/5634464558350336.png", ];

       

    return ( 
        <>
        {store !== undefined && store.userInfo !== undefined ?
        <div style={{backgroundColor: "#360118"}}>
            
        <div class="d-flex justify-content-between">
      <div>
      <h1 style={{fontSize: "80px", color: "white", marginLeft: "20px"}}>Shop</h1>
      </div>
      <div>
      <h1 style={{fontSize: "40px", color: "white", marginRight: "20px", marginTop: "30px"}}>Badges: <span style={{color: "yellow"}}>250</span></h1>
      </div>
    </div>

        <div style={{ marginBottom: '5rem', marginTop: '3rem'}} className="App">
          <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' }}>Hot</h1>
          <Carousel breakPoints={breakPoints}>
            {pictures.map((item) => (
                     <ItemCarousel onClick={() => setItem(item)} data-bs-toggle="modal" data-bs-target="#itemModal" style={{color: '#FFFFFF',backgroundSize: 'cover',backgroundImage:`url(${item})`}}><span style={{backgroundColor:"yellow", color: 'black', fontWeight: "bold"}}>50</span> </ItemCarousel>
                  ))}
          </Carousel>
        </div>
        <div>
          <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' }}>New</h1>
          <Carousel breakPoints={breakPoints}>
          {pictures.map((item) => (
                     <ItemCarousel onClick={() => setItem(item)}  data-bs-toggle="modal" data-bs-target="#itemModal"style={{color: '#FFFFFF',backgroundSize: 'cover',backgroundImage:`url(${item})`}}><span style={{backgroundColor:"yellow", color: 'black', fontWeight: "bold"}}>50</span> </ItemCarousel>
                  ))}
       
          </Carousel>
        
        </div>
        




<div id="itemModal" className="modal fade" tabindex="-1">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Shop</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">

      <div class="d-flex justify-content-between">
      <div>
      <img width="200" height="200" src= {item}></img>
      </div>
      <div>
            <p style={{fontSize: '40px'}}>Cost: <span style={{color: "black", fontWeight: "bold"}}>50</span></p>
      </div>
    </div>

      </div>
      
      <div className="modal-footer">
      
        <MDBBtn rounded type="button"  style={{color: "black", backgroundColor: "yellow",fontWeight:"bold"}}>Buy</MDBBtn>
      </div>
    </div>
  </div>
</div>
        
        </div>
        :<span> Loading... </span>}</>
    );
}

export default ShopPage;