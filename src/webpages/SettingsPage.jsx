import React, {useContext} from "react";
import { useEffect, useState } from 'react';
import { ButtonGroup } from "react-bootstrap";
import { GlobalStoreContext } from '../store/useGlobalStore';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import ReactRoundedImage from "react-rounded-image";
import { putUser, getLogout, deleteUser} from "../adapters/user";
import { uploadUserImage } from "../adapters/images";
import { useHistory } from 'react-router-dom';

const SettingsPage = () => {

    const [store, dispatch] = useContext(GlobalStoreContext);

    const [profilepic, setProfilePic] = useState();
    const [profilebanner, setProfileBanner] = useState();
    const [name, setName] = useState();
    
    const history = useHistory();

    //TODO
    function deleteAccount(){
        console.log('delete account', store.userInfo.id, store.userInfo.username);
        deleteUser(store.userInfo);
        getLogout();
        dispatch({type: 'logout'});
        history.push(`/`);
    }

    //TODO
    async function changeUsername(){
      var tempUser = {
        ...store.userInfo,
        username: name
      }
      let newUserInfo = await putUser(tempUser);
      dispatch({type: 'login', payload: tempUser});
    }

    const uploadImage =async (base64EncodedImage)=>{
      console.log("uploading image...");
      var url = await uploadUserImage(base64EncodedImage);
      console.log("upload complete");
      if(url){
        return url.data;
      }else{
        console.log("unable to grab link", url);
      }
    }

    //TODO
    async function changeProfilePic(){
        var url= await uploadImage(profilepic);
        var tempUser = {
          ...store.userInfo,
          profilePicture: url
        }
        dispatch({type: 'login', payload: tempUser});
        let newUserInfo = await putUser(tempUser);
        console.log('change profile pic');
        if(newUserInfo){
          console.log(newUserInfo);
          console.log(store.userInfo.profilePicture);
        }
    }

    async function changeProfileBanner(){
      var url= await uploadImage(profilebanner);
      var tempUser = {
        ...store.userInfo,
        profileBanner: url
      }
      dispatch({type: 'login', payload: tempUser});
      console.log(profilebanner);
      let newUserInfo = await putUser(tempUser);
      console.log('change profile banner');
      if(newUserInfo){
        console.log(newUserInfo);
      }
      console.log(store.userInfo.profileBanner);
    }  


    function updateProfilePic(event){
        var file=event.target.files[0];

        let reader = new FileReader();
        reader.onloadend = function() {
            setProfilePic(reader.result);
            console.log(profilepic);
        }
        reader.readAsDataURL(file);
    }


    function updateProfileBanner(event){
        var file=event.target.files[0];

        let reader = new FileReader();
        reader.onloadend = function() {
            setProfileBanner(reader.result);
            console.log(profilebanner);
        }
        reader.readAsDataURL(file);
    }

    function getUsername(){
        return store.userInfo.username;
    }

    return (
        <>
        {store !== undefined && store.userInfo !== undefined ?
        <div>
        <div className="btn-group-vertical" >
            <p style={{margin: "0.5rem", color: "white", fontSize: 30, fontWeight: 'bold'}}>Settings</p>
            <p style={{margin: "0.5rem", color: "white", fontSize: 20, }}>Your username is {getUsername()}</p>
            <button data-bs-toggle="modal" data-bs-target="#profilePictureModal" style={{margin: "0.5rem",color: "grey", backgroundColor: 'transparent', padding: 0, border: 0}}>Change Profile Picture</button>
            <button data-bs-toggle="modal" data-bs-target="#profileBannerModal" style={{margin: "0.5rem",color: "grey", backgroundColor: 'transparent', padding: 0, border: 0}}>Change Profile Banner</button>
            <button data-bs-toggle="modal" data-bs-target="#usernameModal" style={{margin: "0.5rem",color: "grey", backgroundColor: 'transparent', padding: 0, border: 0}}>Change Username</button>
            <button data-bs-toggle="modal" data-bs-target="#deleteAccountModal" style={{margin: "0.5rem",color: "red", backgroundColor: 'transparent', padding: 0, border: 0}}>Delete Account</button>
        </div>

<div id="deleteAccountModal" className="modal fade" tabindex="-1">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Delete Account</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <p>We are really sorry that you are leaving. Are you sure that you want to continue deleting your account ?</p>
      </div>
      <div className="modal-footer">
      <MDBBtn rounded data-bs-dismiss="modal" style={{color: "white", backgroundColor: "#00B5FF"}}>Close</MDBBtn>
        
        <button type="button" data-bs-dismiss="modal" onClick={()=>deleteAccount()} class="btn btn-danger">Delete Account</button>
      </div>
    </div>
  </div>
</div>





<div id="usernameModal" className="modal fade" tabindex="-1">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Change Username</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <input type="text" class="form-control" required placeholder="New Username" value={name ? name : ''} 
                    onChange={
                        e=>setName(e.target.value)
                    }
    ></input>

      </div>

      <div className="modal-footer">
        <MDBBtn rounded data-bs-dismiss="modal" style={{color: "white", backgroundColor: "#00B5FF"}} type="button" onClick={()=>changeUsername()} class="btn btn-danger">Submit</MDBBtn>
      </div>
    </div>
  </div>
</div>




<div id="profilePictureModal" className="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Change Profile Picture</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <label  style={{color: "white", backgroundColor: "#8B008B", borderRadius: '50px'}} className="upload-button">
                                <input type="file"  accept=".jpg,.png,.img" onChange={e=>updateProfilePic(e)}></input>
                                Upload Image</label><br/>
      <div style={{left: "27%", width:'70%', height: '70%', position: 'relative'}}>
      {profilepic !== undefined ? <ReactRoundedImage image={profilepic}/> : ""}                          
      </div>
      </div>
      <div className="modal-footer">
        <p>note it will take longer for image to update if the file is big</p>
        <button type="button" class="btn btn-primary" onClick={()=>changeProfilePic()} data-bs-dismiss="modal" style={{color: "white", backgroundColor: "#00B5FF"}}>Submit</button>
      </div>
    </div>
  </div>
</div>


<div id="profileBannerModal" className="modal fade" tabindex="-1">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Change Profile Banner Picture</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <label style={{color: "white", backgroundColor: "#8B008B", borderRadius: '50px'}} className="upload-button">
                                <input type="file"  accept=".jpg,.png,.img" onChange={e=>updateProfileBanner(e)}></input>
                                Upload Image</label>
      <div>
          {profilebanner !== undefined ? <img style={{width:'70%', height: '70%', position: 'relative'}} src={profilebanner}/> : ""}                          
      </div>
                                
      </div>
      <div className="modal-footer">
        <p>note it will take longer for image to update if the file is big</p>
        <MDBBtn rounded type="button" onClick={()=>changeProfileBanner()} data-bs-dismiss="modal" style={{color: "white", backgroundColor: "#00B5FF"}}>Submit</MDBBtn>
      </div>
    </div>
  </div>
</div>






        </div>
        :<span> Loading... </span>}</>
    );
}

export default SettingsPage;