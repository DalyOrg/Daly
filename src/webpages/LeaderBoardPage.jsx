import React from "react";
import { getLeaderboard } from '../adapters/quiz';
import { useHistory, useParams } from 'react-router';
import { useCallback } from 'react';
import { useEffect, useState, useRef } from 'react';
import { getUser } from '../adapters/user';
import { getQuiz } from '../adapters/quiz';
import { MDBBtn } from 'mdb-react-ui-kit';
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






    return (
      <>
       {rankings !== undefined ?
      <>
        <div>
            <div>
                
                <MDBBtn style={{marginLeft: "3rem" , marginTop: '2rem',color: "white", backgroundColor: "#00B5FF"}}>Back to Quiz Summary</MDBBtn>
            </div>
            <div className='d-flex justify-content-center'>

            
                <div className="row row-cols-3">
                    <div className="col">
                    <div  style={{marginTop: '8rem', marginRight: '15rem' ,backgroundSize: 'cover',backgroundRepeat: "no-repeat ",color: "white", borderRadius: "100px", backgroundImage:`url(https://mariopartylegacy.com/wp-content/uploads/2011/08/marioprofile.png)`, height:"200px", width:"200px"}}>
                    <p style={{ textAlign: "center",borderRadius: "100px",width: "50px" ,color: "white", backgroundColor: "silver", fontWeight: "bold", fontSize: "30px"}}>2</p>
                    </div>
                    </div>

                    <div className="col">
                    <div  style={{marginTop: '2rem', backgroundSize: 'cover',backgroundRepeat: "no-repeat ",color: "white", borderRadius: "100px", backgroundImage:`url(https://avatarfiles.alphacoders.com/979/97952.png)`, height:"200px", width:"200px"}}>
                    <p style={{ textAlign: "center",borderRadius: "100px",width: "50px" ,color: "white", backgroundColor: "gold", fontWeight: "bold", fontSize: "30px"}}>1</p>
                    </div>
                    </div>

                    <div className="col">
                    <div  style={{marginTop: '8rem', backgroundSize: 'cover',backgroundRepeat: "no-repeat ",color: "white", borderRadius: "100px", backgroundImage:`url(https://ssb.wiki.gallery/images/thumb/9/93/Pikachu_SSBU.png/1200px-Pikachu_SSBU.png)`, height:"200px", width:"200px"}}>
                    <p style={{ textAlign: "center",borderRadius: "100px",width: "50px" ,color: "white", backgroundColor: "brown", fontWeight: "bold", fontSize: "30px"}}>3</p>
                    </div>
                    </div>
                    
                </div>

                </div>
            <div>

            </div>

            <div>


            </div>

            <table class="table" style={{marginTop:"2rem", backgroundColor: "#F7E7CE"}}>
  <thead>
    <tr style={{backgroundColor: "#8B008B", color: "white"}}>
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