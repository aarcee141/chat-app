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

  useEffect(() => {
    // Set up a listener to watch for changes in the user's authentication state
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        console.log(user.email);
        axios
          .post(
            "http://localhost:5000/api/createUser",
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
            navigate("/test");
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

  return (
    <div
      className="login-container"
    >
      <h1 style={{ fontSize: "4rem", margin: 0 }}>Welcome to The Future Of Chat</h1>
      <p style={{ fontSize: "1.5rem", margin: "2rem 0" }}>
        Chat with your friends and family anytime, anywhere.
      </p>
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={handleLogin}
        >
          Log in with Google
        </button>
      </div>
      {user && <ChatHome />}
    </div>
  );
}

export default Login;
