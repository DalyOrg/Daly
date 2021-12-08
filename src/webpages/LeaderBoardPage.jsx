import React from "react";
import { getLeaderboard } from '../adapters/quiz';
import { useHistory, useParams } from 'react-router';
import { useCallback } from 'react';
import { useEffect, useState, useRef } from 'react';
import { getUser } from '../adapters/user';
import { getQuiz } from '../adapters/quiz';
import { MDBBtn, MDBBtnGroup } from 'mdb-react-ui-kit';
import { getOtherUser } from '../adapters/user';

const LeaderBoardPage = () => {

  const {quizId} = useParams();
  const [rankings, setRankings] = useState([]);

  
  const initLeaderBoard = useCallback(async function(){
    let leaderBoardObj = await getLeaderboard(quizId);
    setRankings(leaderBoardObj.rankings);
    leaderBoardObj.rankings.forEach(async (rank, indx) => {
      let userData = await getOtherUser(rank.userId);
      setRankings((prevState) => {
        let newRanks = [...prevState];
        newRanks[indx] = {...newRanks[indx], ...userData};
        setRankings(newRanks);
        console.log(rankings);

      })
    })
  }, [quizId])


  useEffect(() => {
    initLeaderBoard();
  }, [initLeaderBoard]);


  const history = useHistory();
  
  const linkTo = (quizId) => {

    history.push(`/quiz/` + quizId);
  }

  const userTo = (userId) => {
    console.log("useridd" + userId);
    history.push(`/user/` + userId);
  }



    return (
      <>
       {rankings !== undefined ?
      <>
        <div>
            <div>
                
                <MDBBtn onClick={()=>linkTo(quizId)} style={{marginLeft: "3rem" , marginTop: '2rem',color: "white", backgroundColor: "#5321d0"}}>Back to Quiz Summary</MDBBtn>
            </div>
            <div className='d-flex justify-content-center'>

            
                <div className="row row-cols-3">
                    <div className="col">
                    <div style={{marginTop: '8rem'}}>
                     <p style={{ textAlign: "center",borderRadius: "100px",width: "50px" ,color: "white", backgroundColor: "silver", fontWeight: "bold", fontSize: "30px"}}>2</p>
                     {rankings[1] !== undefined ?
                     <MDBBtn onClick={()=>userTo(rankings[1].userId)} style={{backgroundSize: 'cover',backgroundRepeat: "no-repeat ",color: "white", borderRadius: "100px",  backgroundPosition: "center",backgroundImage: `url(${(rankings[1] && rankings[1].profilePicture) || ""})`, height:"200px", width:"200px"}}></MDBBtn>
                     : <div  style={{backgroundSize: 'cover',backgroundRepeat: "no-repeat ",color: "white", borderRadius: "100px", backgroundImage: `url(${("https://i.imgur.com/H4Dksdd.jpg") })`, height:"200px", width:"200px", backgroundPosition: "center"}}></div>}
                    </div>
                    </div>

                    <div className="col">
                    <div>
                    <p style={{ textAlign: "center",borderRadius: "100px",width: "50px" ,color: "white", backgroundColor: "gold", fontWeight: "bold", fontSize: "30px"}}>1</p>
                    {rankings[0] !== undefined ?
                     <MDBBtn onClick={()=>userTo(rankings[0].userId)} style={{backgroundSize: 'cover',backgroundRepeat: "no-repeat ", backgroundPosition: "center",color: "white", borderRadius: "100px", backgroundImage: `url(${(rankings[0] && rankings[0].profilePicture) || ""})`, height:"200px", width:"200px"}}></MDBBtn>
                     : <div  style={{backgroundSize: 'cover',backgroundRepeat: "no-repeat ",color: "white", borderRadius: "100px", backgroundImage: `url(${("https://i.imgur.com/H4Dksdd.jpg") })`, height:"200px", width:"200px", backgroundPosition: "center"}}></div>}
                    </div>
                    </div>

                    <div className="col">
                    <div style={{marginTop: '8rem'}}>
                     <p style={{ textAlign: "center",borderRadius: "100px",width: "50px" ,color: "white", backgroundColor: "brown", fontWeight: "bold", fontSize: "30px"}}>3</p>
                     {rankings[2] !== undefined ?
                     <MDBBtn onClick={()=>userTo(rankings[2].userId)} style={{backgroundSize: 'cover',backgroundRepeat: "no-repeat ",color: "white", borderRadius: "100px", backgroundPosition: "center" ,backgroundImage: `url(${(rankings[2] && rankings[2].profilePicture) || ""})`, height:"200px", width:"200px"}}></MDBBtn>
                     : <div  style={{backgroundSize: 'cover',backgroundRepeat: "no-repeat ",color: "white", borderRadius: "100px", backgroundImage: `url(${("https://i.imgur.com/H4Dksdd.jpg") })`, height:"200px", width:"200px", backgroundPosition: "center"}}></div>}
                    </div>
                    </div>
                    
                </div>

                </div>
            <div>

            </div>

            <div>


            </div>

            <table class="table" style={{marginTop:"2rem", backgroundColor: "#cabcf6"}}>
  <thead>
    <tr style={{backgroundColor: "#5321d0", color: "white"}}>
      <th scope="col">Position</th>
      <th scope="col">Username</th>
      <th scope="col">Time Spent</th>
      <th scope="col">% of Correct Answers</th>
    </tr>
  </thead>
  <tbody style={{color: "black"}}>
  {rankings.map((rank, index) => (
                         <tr>
                         <th scope="row">{index+1}</th>
                         <td>{rank.username}</td>
                         <td>{rank.time}</td>
                         <td>{rank.score}</td>
                       </tr>
                      
                  ))}

  </tbody>
</table>


        </div>
        </>
        :<span> Loading... </span>}</>
    );
}

export default LeaderBoardPage;