import React from "react";
import "./UserPreview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

function UserPreview({ user, setSelectedUser }) {
  const handleClick = () => {
    console.log(user);
    setSelectedUser(user);
  };

  return (
    <div className="user-container">
      {user.profilePicture ? (
        <div className="user-photo">
          <img src={user.profilePicture} alt="User profile" />
        </div>
      ) : (
        <div className="user-photo">
          <FontAwesomeIcon icon={faUserCircle} size="2x" />
        </div>
      )}
      <div className="user-info" onClick={handleClick}>
        <span className="user-name">{user.name}</span>
        <span className="user-email">{user.email}</span>
      </div>
    </div>
  );
}

export default UserPreview;
