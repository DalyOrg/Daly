import React, { Component } from 'react'
import "../App.css";
import { Nav, Navbar, NavbarBrand, NavDropdown } from "react-bootstrap";
import { Cart } from 'react-bootstrap-icons';
import { Collection } from 'react-bootstrap-icons';
import { Person } from 'react-bootstrap-icons';
import { Gear } from 'react-bootstrap-icons';
import { Justify } from 'react-bootstrap-icons';
import { PersonX } from 'react-bootstrap-icons';
export default class TopBar extends Component {
    render() {
        return (
            <nav class="navbar navbar-dark" style={{backgroundColor: "#8B008B"}}>
            <div class="container-fluid">
                <a class="navbar-brand" href="#" >Daly</a>


                <form class="d-flex">
            <input class="form-control me-2 rounded" type="search" placeholder="Search" aria-label="Search"></input>
            <button style={{backgroundColor: "#00B5FF", color: "white"}} type="submit" class="rounded">Search</button>
    
            </form>


                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <Justify color="white" size={30}/>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                    <a class="nav-link active" href="#"><Collection color="white" size={20}/> Platform</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link active" href="#"> <Cart color="white" size={20}/> Shop</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link active" href="#"><Person color="white" size={20}/> Profile</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link active" href="#"><Gear color="white" size={20}/> Settings</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link active" style={{color: "red"}} href="#"><PersonX color="white" size={20}/> Logout</a>
                    </li>
                </ul>
                </div>
            </div>
            </nav>
                        
            
        )
    }
}
