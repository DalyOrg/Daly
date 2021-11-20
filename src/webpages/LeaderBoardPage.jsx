import React from "react";
import { getLeaderboard } from '../adapters/quiz';
import { MDBBtn } from 'mdb-react-ui-kit';
const LeaderBoardPage = () => {
    return (
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
    <tr>
      <th scope="row">1</th>
      <td>Sonic</td>
      <td>5</td>
      <td>80</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Mario</td>
      <td>8</td>
      <td>70</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Pikachu</td>
      <td>8</td>
      <td>60</td>
      
    </tr>

    <tr>
      <th scope="row">4</th>
      <td>Sonic</td>
      <td>5</td>
      <td>80</td>
    </tr>
    <tr>
      <th scope="row">5</th>
      <td>Mario</td>
      <td>8</td>
      <td>70</td>
    </tr>
    <tr>
      <th scope="row">6</th>
      <td>Pikachu</td>
      <td>8</td>
      <td>60</td>
      
    </tr>
  </tbody>
</table>


        </div>
    );
}

export default LeaderBoardPage;