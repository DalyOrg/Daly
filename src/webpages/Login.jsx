import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { MDBBtn } from 'mdb-react-ui-kit';

const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
// Adapted from documentation
const auth = getAuth();
signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    // Send to DB
  }).catch((error) => {
  });
}

const LoginPage = () => {
    return (
      <div className='container mt-auto'
        style={{
          paddingTop: '40vh'
        }}
      >
          <div className='d-flex flex-column'>
            <a 
              className='mx-auto'
              href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`
            }>
              <MDBBtn
                rounded size='sm'
                style={{backgroundColor: "#00B5FF"}}>
                Sign in with Google
              </MDBBtn>
            </a>
          </div>
      </div>
    );
}

export default LoginPage;