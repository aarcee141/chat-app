import React, { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import firebase from "firebase/compat/app";
import ChatHome from "./ChatHome/ChatHome";
import "firebase/compat/auth";
import "./Login.css";

function Login() {
  const auth = firebase.auth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [numCharsToShow, setNumCharsToShow] = useState(0);

  useEffect(() => {
    // Set up a listener to watch for changes in the user's authentication state
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        console.log(user.email);
        axios
          .post(
            "http://ubuntu@ec2-54-212-18-31.us-west-2.compute.amazonaws.com:5000/api/createUser",
            {
              email: user.email,
              name: user.displayName,
              // Add any other user data you want to store in your database
            },
            {
              headers: {
                Authorization:
                  "Bearer " + (await firebase.auth().currentUser.getIdToken()),
              },
            }
          )
          .then((response) => {
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

  useEffect(() => {
    // Set up a timer to increment the number of characters to show every 100 milliseconds
    const timerId = setInterval(() => {
      setNumCharsToShow((numChars) => Math.min(numChars + 1, welcomeMessage.length));
    }, 100);

    // Clean up the timer when the component unmounts
    return () => clearInterval(timerId);
  }, []);

  const handleLogin = async () => {
    // Sign in with Google using a popup window
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const welcomeMessage = "Welcome to Expresso Chat...";
  const displayedWelcomeMessage = welcomeMessage.substring(0, numCharsToShow);

  return (
    <>
      {user ? (
        <ChatHome />
      ) : (
        <div className="login-container">
          <h1>{displayedWelcomeMessage}</h1>
          <p>Chat with your friends and family anytime, anywhere.</p>
          <div>
            <button onClick={handleLogin}>Log in with Google</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
