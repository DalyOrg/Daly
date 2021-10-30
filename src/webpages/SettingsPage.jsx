import React, {useContext} from "react";
import { ButtonGroup } from "react-bootstrap";
import { GlobalStoreContext } from '../store/useGlobalStore';

const SettingsPage = () => {
    const [store] = useContext(GlobalStoreContext);

    function getUsername(){
        return store.userInfo.username;
    }

    return (
        <div class="btn-group-vertical" >
            <p style={{margin: "0.5rem", color: "white", fontSize: 30, fontWeight: 'bold'}}>Settings</p>
            <p style={{margin: "0.5rem", color: "white", fontSize: 20, }}>Your username is {getUsername()}</p>
            <button style={{margin: "0.5rem",color: "grey", backgroundColor: '#360118', padding: 0, border: 0}}>Change Profile Picture</button>
            <button style={{margin: "0.5rem",color: "grey", backgroundColor: '#360118', padding: 0, border: 0}}>Change Profile Banner</button>
            <button style={{margin: "0.5rem",color: "grey", backgroundColor: '#360118', padding: 0, border: 0}}>Change Username</button>
            <button style={{margin: "0.5rem",color: "red", backgroundColor: '#360118', padding: 0, border: 0}}>Delete Account</button>
        </div>
    );
}

export default SettingsPage;