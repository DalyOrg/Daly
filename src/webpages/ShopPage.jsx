import React from "react";
import { useGlobalStore } from "../store/useGlobalStore";
import {useContext, useState, useCallback} from "react";
import ItemCarousel from "../components/ItemCarousel";
import Carousel from 'react-elastic-carousel';
import { GlobalStoreContext } from '../store/useGlobalStore';
import {MDBBtn } from 'mdb-react-ui-kit';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { getItems } from '../adapters/item';
import { putUser} from "../adapters/user";

const ShopPage = () => {

    const [store, dispatch] = useContext(GlobalStoreContext);
    const [badge, setBadge] = useState();
    const [item, setItem] = useState();
    const [itemList, setItemList] = useState([]);



    const initItems = useCallback(async function(){
      if(store !== undefined && store.userInfo !== undefined){
        let itemObjs = await getItems();
        setItemList(itemObjs)
        
        console.log(itemList);
      }
    }, [store.userInfo, dispatch]);
  
    useEffect(() => {
      initItems()
    }, [initItems])
  
    useEffect(() => {
      if(store !== undefined){
        setBadge(store.userInfo.badges);
      }
      
    }, [])
      
    
    

    async function buyItem(){
        
      if(store.userInfo !== undefined && item !== undefined){
          console.log("inside if");
        if(badge > item.price){
          console.log("inside badge if");
          console.log(item.price);
          let newBadge = badge - item.price;
          setBadge(newBadge)
          console.log(newBadge);
        }
        var tempUser = {
          ...store.userInfo,
          badges: badge
        }
        
        let newUserInfo = await putUser(tempUser);
        dispatch({type: 'login', payload: tempUser});
        console.log(newUserInfo);
        
      }
  }



    let breakPoints = [
        { width: 1, itemsToShow: 2 },
        { width: 550, itemsToShow: 3 },
        { width: 768, itemsToShow: 4 },
        { width: 1200, itemsToShow: 5 },
      ];

      const pictures = ["https://i.imgur.com/9uW16qm.png",
       "https://www.pngall.com/wp-content/uploads/2017/03/Winnie-The-Pooh-PNG-File.png",
       "https://freepngimg.com/thumb/sonic_the_hedgehog/21035-3-sonic-the-hedgehog-transparent-image.png",
       "https://www.pngfind.com/pngs/m/15-158318_bulbasaur-pixel-sprite-mario-flower-pixel-hd-png.png",
       "https://cdna.artstation.com/p/assets/images/images/004/983/380/large/mar-daniel-garcia-8-bit-art-batman.jpg?1487654590",
        "https://ctl.s6img.com/society6/img/BBwaqn3kl90gxakf4t4ukdoulJQ/w_700/prints/~artwork/s6-0016/a/5492688_12740327/~~/deadpool-8-bit-prints.jpg",
    "https://upload.wikimedia.org/wikipedia/en/0/01/Sheriff_Woody.png", ];

       

    return ( 
        <>
        {store !== undefined && store.userInfo !== undefined ?
        <div style={mystyle}>
            
        <div class="d-flex justify-content-between">
      <div>
      <h1 style={{fontSize: "80px", color: "white", marginLeft: "20px"}}>Shop</h1>
      </div>
      <div>
      <h1 style={{fontSize: "40px", color: "white", marginRight: "20px", marginTop: "30px"}}>Badges: <span style={{color: "yellow"}}>{store.userInfo.badges}</span></h1>
      </div>
    </div>

        <div style={{ marginBottom: '5rem', marginTop: '3rem'}} className="App">
          <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' }}>Hot</h1>
          <Carousel breakPoints={breakPoints}>
            {itemList.map((item) => (
                     <ItemCarousel onClick={()=>setItem(item)} data-bs-toggle="modal" data-bs-target="#itemModal" style={{color: '#FFFFFF',backgroundSize: 'cover',backgroundImage:`url(${item.picUrl})`, backgroundPositionX: "center",
                     }}><span style={{backgroundColor:"#5321d0", color: 'white', fontWeight: "bold", borderRadius: "4px"}}>{item.price}</span> </ItemCarousel>
                  ))}
          </Carousel>
        </div>
        <div>
          <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' }}>New</h1>
          <Carousel breakPoints={breakPoints}>
          {pictures.map((item) => (
                     <ItemCarousel onClick={()=>setItem(item)}  data-bs-toggle="modal" data-bs-target="#itemModal"style={{color: '#FFFFFF',backgroundSize: 'cover',backgroundImage:`url(${item})`}}><span style={{backgroundColor:"#5321d0", color: 'white', fontWeight: "bold", borderRadius: "4px"}}>50</span> </ItemCarousel>
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

      {item !== undefined ?
      <div class="d-flex justify-content-between">
        
      <div>
      
      <img width="200" maxHeight="500" src= {item.picUrl}></img>
      </div>
      <div>
            <p style={{fontSize: '40px'}}>Cost: <span style={{color: "black", fontWeight: "bold"}}>{item.price}</span></p>
      </div>
      
    </div>
:<span> Loading... </span>}
      </div>
      
      <div className="modal-footer">
      
        <MDBBtn rounded data-bs-dismiss="modal" type="button" onClick={()=>buyItem()} style={{color: "black", backgroundColor: "yellow",fontWeight:"bold"}}>Buy</MDBBtn>
      </div>
    </div>
  </div>
</div>
        
        </div>
        :<span> Loading... </span>}</>
    );
}

export default ShopPage;

const mystyle = {
  background: 'linear-gradient(90deg, rgba(15,0,36,1) 15%, rgba(100,9,121,1) 50%, rgba(44,0,255,1) 100%)'
}