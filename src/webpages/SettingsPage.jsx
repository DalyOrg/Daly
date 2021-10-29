import React from "react";
import { ButtonGroup } from "react-bootstrap";

const SettingsPage = () => {
    return (
        <div class="btn-group-vertical">
            <p style={{margin: "0.5rem", color: "white", fontSize: 30, fontWeight: 'bold'}}>Settings</p>
            <p style={{margin: "0.5rem", color: "white", fontSize: 20, }}>Your username is Emre</p>
            <button style={{margin: "0.5rem",color: "grey", backgroundColor: '#360118', padding: 0, border: 0}}>Change Profile Picture</button>
            <button style={{margin: "0.5rem",color: "grey", backgroundColor: '#360118', padding: 0, border: 0}}>Change Profile Banner</button>
            <button style={{margin: "0.5rem",color: "grey", backgroundColor: '#360118', padding: 0, border: 0}}>Change Username</button>
            <button style={{margin: "0.5rem",color: "red", backgroundColor: '#360118', padding: 0, border: 0}}>Delete Account</button>
        </div>
    );
}

export default SettingsPage;