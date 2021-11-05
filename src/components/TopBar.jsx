import "../App.css";
import { MDBBtn } from 'mdb-react-ui-kit';
import { MDBInput } from 'mdb-react-ui-kit';
import { Nav, Navbar, NavbarBrand, NavDropdown } from "react-bootstrap";
import { Cart } from 'react-bootstrap-icons';
import { Collection } from 'react-bootstrap-icons';
import { Person } from 'react-bootstrap-icons';
import { Gear } from 'react-bootstrap-icons';
import { Justify } from 'react-bootstrap-icons';
import { PersonX } from 'react-bootstrap-icons';
import { Search } from 'react-bootstrap-icons';
import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getPlatform } from '../adapters/platform';
//global store
import React, { Component, useContext } from 'react';
import { useGlobalStore } from "../store/useGlobalStore";
import { getLogout } from "../adapters/user";
import { useCallback } from 'react';

//let loggedIn = false;


//export default class TopBar extends Component {
const TopBar =() =>{
    
    const [store, dispatch] = useGlobalStore();
    const history = useHistory();
    const [platform, setPlatform] = useState();
    const {platformId} = useParams();

    const initPlatform = useCallback(async function(){
        let platformObj = await getPlatform(platformId);
        setPlatform(platformObj); 
    }, [platformId])

    useEffect(() => {
        initPlatform();
    }, [initPlatform]);
    
    //render() {
    return (
        <nav class="navbar navbar-dark" style={{backgroundColor: "#8B008B"}}>
        <div class="container-fluid">
        <a class="navbar-brand" href="#" >Daly</a>
        
        
        <form class="d-flex">
        <MDBInput label='Search Quiz' id='typeText' type='text' style={{color: "white"}}/>
        <MDBBtn style={{color: "white", backgroundColor: "#00B5FF", marginLeft: '1rem'}} rounded ><Search color="white" size={20}/></MDBBtn>
        
        </form>
        
        {store.userInfo ?
            <>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <Justify color="white" size={30} />
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item" style={{ marginBottom: "0.5rem" }}>
                        <MDBBtn onClick={() => {
                                history.push('/'+store.userInfo.id+'/platformpicker');
                            }}href="#" style={{ backgroundColor: "#8B008B" }}><Collection color="white" size={20} /> Platform</MDBBtn>
                    </li>
                    <li class="nav-item" style={{ marginBottom: "0.5rem" }}>
                        <MDBBtn href="#" style={{ backgroundColor: "#8B008B" }}><Cart color="white" size={20} /> Shop</MDBBtn>
                    </li>
                    <li class="nav-item" style={{ marginBottom: "0.5rem" }}>
                        <Link to="/user/placeholder">
                            <MDBBtn href="#" style={{ backgroundColor: "#8B008B" }}><Person color="white" size={20} /> Profile</MDBBtn>
                        </Link>
                    </li>
                    <li class="nav-item" style={{ marginBottom: "0.5rem" }}>
                        <Link to="/settings">
                            <MDBBtn href="#" style={{ backgroundColor: "#8B008B" }}><Gear color="white" size={20} /> Settings</MDBBtn>
                        </Link>
                    </li>
                    <li class="nav-item" style={{ marginBottom: "0.5rem" }}>
                        <MDBBtn href="#" style={{ backgroundColor: "#8B008B", color: "red" }}
                            onClick={() => {
                                getLogout();
                                dispatch({type: 'logout'});
                                history.push('/home');
                            }}
                        >
                            <PersonX color="white" size={20}/>
                            Logout
                        </MDBBtn>
                    </li>
                </ul>
            </div></>
            :
            <Link to="/login">
            <button style={
                {   backgroundColor: "#00B5FF", 
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