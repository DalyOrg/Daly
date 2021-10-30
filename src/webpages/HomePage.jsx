import React, { Component, useContext, useEffect, useCallback } from 'react'
import Carousel from 'react-elastic-carousel';
import ItemCarousel from "../components/ItemCarousel";
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { useHistory } from 'react-router';
import { getUser } from '../adapters/user';
import { useGlobalStore } from '../store/useGlobalStore';


let breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 4 },
];


const HomePage = () => {
  const {quizId} = useParams();
  const [store, dispatch] = useGlobalStore();
  const history = useHistory();
  
  const linkTo = () => {
    history.push(`/quiz/DqEulgCMYOtWQLCD3sgo`);
  }

  const initUser = useCallback(async function(){
    if(store.userInfo === undefined){
      let userInfo = await getUser();
      if(userInfo.id){
        dispatch({type: 'login', payload: userInfo})
      }
    }
  }, [store.userInfo, dispatch]);

  useEffect(() => {
    initUser()
  }, [initUser])
  
  return (
    <div style={{backgroundColor: "#360118"}}>
      <h1> {store.userinfo !== undefined ? store.userInfo.username : 'hello'} </h1>
    
    <div style={{ marginBottom: '5rem', marginTop: '3rem'}} className="App">
      <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' }}>Trending</h1>
      <Carousel breakPoints={breakPoints}>
        <ItemCarousel onClick={linkTo} style={{backgroundSize: 'cover',backgroundImage:`url(https://nypost.com/wp-content/uploads/sites/2/2021/10/lightyear-6.jpg?quality=90&strip=all)` }}></ItemCarousel>
    
        <ItemCarousel>Two</ItemCarousel>
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
        <ItemCarousel>Two</ItemCarousel>
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
  
  export default HomePage;