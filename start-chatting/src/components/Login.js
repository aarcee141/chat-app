import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import React, { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const firebaseConfig = {
    apiKey: "AIzaSyCID011nJBjLjhwyjh3bvF-FjnFkK59pQw",
    authDomain: "start-chatting-fd745.firebaseapp.com",
    projectId: "start-chatting-fd745",
    storageBucket: "start-chatting-fd745.appspot.com",
    messagingSenderId: "855278592853",
    appId: "1:855278592853:web:42cdb87e8d58b95bce05dc",
    measurementId: "G-13JE6CXLQH",
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Set up a listener to watch for changes in the user's authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        console.log(user.email);
        axios
          .post("http://localhost:5000/api/createUser", {
            email: user.email,
            name: user.displayName,
            // Add any other user data you want to store in your database
          })
          .then((response) => {
            // console.log("Print Auth: " + JSON.stringify(auth.currentUser));
            // localStorage.setItem("auth", JSON.stringify(auth));
            // console.log(
            //   "Current User: " + JSON.parse(localStorage.getItem("auth"))
            // );
            navigate("/chat");
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    // Sign in with Google using a popup window
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    // Sign out the current user
    await auth.signOut();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Start Chatting</h1>
      <p style={{ fontSize: "1.2rem" }}>
        {user ? `You are logged in as ${user.email}` : "You are not logged in"}
      </p>
      {user ? (
        <button onClick={handleLogout} className="btn-primary">
          Log out
        </button>
      ) : (
        <button onClick={handleLogin} className="btn-primary">
          Log in with Google
        </button>
      )}
    </div>
  );
}

export default Login;
