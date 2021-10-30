import React, { Component } from 'react'
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
import { Link } from 'react-router-dom';

export default class TopBar extends Component {
    render() {
        return (
            <nav class="navbar navbar-dark" style={{backgroundColor: "#8B008B"}}>
            <div class="container-fluid">
                <Link to="/">
                    <a class="navbar-brand" href="#" >Daly</a>
                </Link>

                <form class="d-flex">
                <MDBInput label='Search Quiz' id='typeText' type='text' style={{color: "white"}}/>
            <MDBBtn style={{color: "white", backgroundColor: "#00B5FF", marginLeft: '1rem'}} rounded ><Search color="white" size={20}/></MDBBtn>
    
            </form>


                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <Justify color="white" size={30}/>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item" style={{marginBottom: "0.5rem"}}>
                        <MDBBtn  href="#" style={{backgroundColor: "#8B008B"}}><Collection color="white" size={20}/> Platform</MDBBtn>
                    </li>
                    <li class="nav-item" style={{marginBottom: "0.5rem"}}>
                        <MDBBtn  href="#" style={{backgroundColor: "#8B008B"}}><Cart color="white" size={20}/> Shop</MDBBtn>
                    </li>
                    <li class="nav-item" style={{marginBottom: "0.5rem"}}>
                        <Link to="/user/placeholder">
                            <MDBBtn  href="#" style={{backgroundColor: "#8B008B"}}><Person color="white" size={20}/> Profile</MDBBtn>
                        </Link>
                    </li>
                    <li class="nav-item" style={{marginBottom: "0.5rem"}}>
                        <Link to="/settings">
                            <MDBBtn  href="#" style={{backgroundColor: "#8B008B"}}><Gear color="white" size={20}/> Settings</MDBBtn>
                        </Link>
                    </li>
                    <li class="nav-item" style={{marginBottom: "0.5rem"}}>
                        <MDBBtn  href="#" style={{backgroundColor: "#8B008B", color: "red"}}><PersonX color="white" size={20}/> Logout</MDBBtn>
                    </li>
                </ul>
                </div>
            </div>
            </nav>
                        
            
        )
    }
}
