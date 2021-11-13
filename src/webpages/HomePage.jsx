import React, { Component, useContext, useEffect, useCallback, useState } from 'react'
import Carousel from 'react-elastic-carousel';
import ItemCarousel from "../components/ItemCarousel";
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { useHistory } from 'react-router';
import { getSubscriptionFeed, getUser } from '../adapters/user';
import { GlobalStoreContext } from '../store/useGlobalStore';
import { getQuiz } from '../adapters/quiz';
import { getTrendingFeed } from '../adapters/recommendations';


let breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 4 },
];


const HomePage = () => {
  const [store, dispatch] = useContext(GlobalStoreContext);
  const history = useHistory();
  const [subFeed, setSubFeed] = useState([]);
  const [trendingFeed, setTrendingFeed] = useState([]);
  
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

  const initSubFeed = useCallback(async function(){
    if(store !== undefined && store.userInfo !== undefined){
      let subFeedRes = await getSubscriptionFeed();
      for(let quizId of subFeedRes.feed){
        getQuiz(quizId).then((quiz) => {
          console.log(quiz)
          setSubFeed((prevState) => [...prevState, quiz])
        })
      }
    }
  }, [store]);

  useEffect(() => {
    initSubFeed()
  }, [initSubFeed])

  const initTrendingFeed = useCallback(async function(){
    let trendingFeedRes = await getTrendingFeed();
    console.log(trendingFeedRes)
    setTrendingFeed(trendingFeedRes.feed);
  }, []);

  useEffect(() => {
    initTrendingFeed()
  }, [initTrendingFeed])
  
  return (
    <div style={{backgroundColor: "#360118"}}>
    
    <div style={{ marginBottom: '5rem', marginTop: '3rem'}} className="App">
      <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' }}>Trending</h1>
      <Carousel breakPoints={breakPoints}>
        {
          trendingFeed.map((quiz) => 
            <ItemCarousel
              style={{
                backgroundSize: 'cover',
                backgroundImage: `url(${quiz.backgroundImage})`
              }}
              onClick={() => {
                history.push(`/quiz/${quiz.id}`);
              }}
            >
            </ItemCarousel>
          )
        }
      </Carousel>
    </div>
    { store && store.userInfo &&
      <div>
        <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' }}>From Your Subscriptions</h1>
        <Carousel breakPoints={breakPoints}>
          {
            subFeed.map((quiz) => 
              <ItemCarousel
                style={{
                  backgroundSize: 'cover',
                  backgroundImage: `url(${quiz.backgroundImage})`
                }}
                onClick={() => {
                  history.push(`/quiz/${quiz.id}`);
                }}
              >
              </ItemCarousel>
            )
          }
        </Carousel>
      </div>
    }
    </div>
    )
    
  }
  
  export default HomePage;