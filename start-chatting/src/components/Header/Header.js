import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/compat/app";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
    const auth = firebase.auth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await auth.signOut();
        navigate("/");
    };

    const handleEditProfile = () => {
    };

    return (
        <header>
            <div className="left">
                <FontAwesomeIcon icon={faComments} className="app-icon" />
                <span>Start Chatting!</span>
            </div>
            <div className="center-right">
                {auth.currentUser?.photoURL && (
                    <div className="logged-in-user-photo">
                        <img src={auth.currentUser.photoURL} alt="User profile" />
                    </div>
                )}
                <span>
                    Logged in as: <div>{auth.currentUser?.displayName}</div>
                </span>
            </div>
            <div className="right">
                <div className="dropdown">
                    <button className="dropbtn">Settings</button>
                    <div className="dropdown-content">
                        <button className="dropdown-item" to="#">Edit Profile</button>
                        <button className="dropdown-item" onClick={handleSignOut}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
