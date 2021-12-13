import "../App.css";
import { MDBBtn } from 'mdb-react-ui-kit';
import { MDBInput } from 'mdb-react-ui-kit';
import { Archive, Cart } from 'react-bootstrap-icons';
import { Collection } from 'react-bootstrap-icons';
import { Person } from 'react-bootstrap-icons';
import { Gear } from 'react-bootstrap-icons';
import { Justify } from 'react-bootstrap-icons';
import { PersonX } from 'react-bootstrap-icons';
import { Search } from 'react-bootstrap-icons';
import { Link, useHistory } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';
import { useGlobalStore } from "../store/useGlobalStore";
import { getLogout } from "../adapters/user";

const TopBar =() =>{
    
    const [store, dispatch] = useGlobalStore();
    const [searchText, setSearchText] = useState("");
    const history = useHistory();

    //render() {
    return (
        
        <nav className="navbar navbar-dark navbar-fixed-top" style={topbarstyle}>
            
        <div className="container-fluid">
        <Link to="/home">
        <button className="navbar-brand" >Daly</button>
        </Link>
        
        <form className="d-flex" onSubmit={e => {
            e.preventDefault();
            history.push('/search/'+searchText);
            window.location.reload();
        }}>
        <MDBInput id='typeText' type='text' onChange={e => setSearchText(e.target.value)} value={searchText} style={{color: "white", width: "100%"}}/>
        <MDBBtn style={{color: "white", backgroundColor: "#5321d0", marginLeft: '1rem'}} rounded ><Search color="white" size={20} onClick={()=>{
            history.push('/search/'+searchText);
        }}/></MDBBtn>
        
        </form>
        
        {store.userInfo ?
            <>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <Justify color="white" size={30} />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item" style={{ marginBottom: "0.5rem" }}>
                        <MDBBtn  onClick={() => {
                                history.push('/'+store.userInfo.id+'/platformpicker');
                            }}data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" style={{ backgroundColor: "transparent" }}><Collection color="white" size={20} /> Platform</MDBBtn>
                    </li>
                    <li className="nav-item" style={{ marginBottom: "0.5rem" }}>
                    
                        <MDBBtn onClick={()=> { history.push('/shop');}}data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" style={{ backgroundColor: "transparent" }}><Cart color="white" size={20} /> Shop</MDBBtn>
                        
                    </li>
                    <li className="nav-item" style={{ marginBottom: "0.5rem" }}>
                        <Link to={"/user/"+store.userInfo.id} >
                            <MDBBtn data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" style={{ backgroundColor: "transparent" }}><Person color="white" size={20} /> Profile</MDBBtn>
                        </Link>
                    </li>
                    <li className="nav-item" style={{ marginBottom: "0.5rem" }}>
                        <Link to="/user/reports">
                            <MDBBtn data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" style={{ backgroundColor: "transparent" }}>
                                <Archive color="white" size={20} /> Reports
                            </MDBBtn>
                        </Link>
                    </li>
                    <li className="nav-item" style={{ marginBottom: "0.5rem" }}>
                        <Link to="/settings">
                            <MDBBtn data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" style={{ backgroundColor: "transparent" }}><Gear color="white" size={20} /> Settings</MDBBtn>
                        </Link>
                    </li>
                    <li className="nav-item" style={{ marginBottom: "0.5rem" }}>
                        <MDBBtn data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" style={{ backgroundColor: "transparent", color: "red" }}
                            onClick={() => {
                                getLogout();
                                dispatch({type: 'logout'});
                                history.push('/home');
                            }}
                        >
                            <PersonX style={{marginRight: "10px"}}color="white" size={20}/><span >Logout</span></MDBBtn>
                    </li>
                </ul>
            </div></>
            :
            <Link to="/login">
            <button style={
                {   backgroundColor: "#640979", 
                color: "white", 
                border: "none",
                padding: "6px 15px",
                borderRadius: "10px",
                textAlign: "center",
                display: "inline-block",
                fontSize: "15px",
                cursor: "pointer"
            }
        }>Login</button>
        </Link>
    }
    </div>
    </nav>
    
    
    )
    //}
}

export default TopBar;


const topbarstyle = {
    backgroundColor: "rgba(18, 5, 77, .5)"
 }