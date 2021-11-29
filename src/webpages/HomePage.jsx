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
  { width: 1200, itemsToShow: 3},
];


const HomePage = () => {
  const [store, dispatch] = useContext(GlobalStoreContext);
  const history = useHistory();
  const [subFeed, setSubFeed] = useState([]);
  const [trendingFeed, setTrendingFeed] = useState([]);
  
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
    <div style={mystyle}>
    
    <div style={{ marginBottom: '5rem', marginTop: '3rem'}} className="App">
      <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white' , fontSize: "25px", marginBottom: "2rem"}}>Trending</h1>
      <Carousel breakPoints={breakPoints}>
        {
          trendingFeed.map((quiz) => 
            <ItemCarousel
              style={{
                backgroundRepeat: "no-repeat",
                backgroundPositionX: "center",
                backgroundPositionY: "center",
                backgroundSize: "cover",
                
                
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
        <h1 style={{ textAlign: "left", marginLeft: '1rem', color:'white', fontSize: "25px", marginBottom: "2rem" }}>From Your Subscriptions</h1>
        <Carousel breakPoints={breakPoints}>
          {
            subFeed.map((quiz) => 
              <ItemCarousel
                style={{
                  backgroundSize: 'cover',
                  backgroundPositionX: "center",
                  backgroundPositionY: "center",
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

  const mystyle = {
    background: 'linear-gradient(90deg, rgba(15,0,36,1) 15%, rgba(100,9,121,1) 50%, rgba(44,0,255,1) 100%)'
 }