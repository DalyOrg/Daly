import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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
    console.log(error.message);
  });
}

const LoginPage = () => {
    return (
        <div>
            <a href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}>
              <button className="signinButton">
                Sign in with Google
              </button>
            </a>
        </div>
    );
}

export default LoginPage;