import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/compat/app";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import SearchBox from "./SearchBox";

function Header({ currentUser, usersList, setSelectedUser }) {
  const auth = firebase.auth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <header>
      <div className="left">
        <FontAwesomeIcon icon={faComments} className="app-icon" />
        <span>InstaChat</span>
      </div>
      <div className="center-right">
        {currentUser.profilePicture && (
          <div className="logged-in-user-photo">
            <img src={currentUser.profilePicture} alt="User profile" />
          </div>
        )}
        <span>
          Logged in as: <div>{currentUser.name}</div>
        </span>
      </div>
      <div className="right">
        <div className="dropdown">
          <button className="dropbtn">Settings</button>
          <div className="dropdown-content">
            <button className="dropdown-item" onClick={handleEditProfile}>
              Edit Profile
            </button>
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
