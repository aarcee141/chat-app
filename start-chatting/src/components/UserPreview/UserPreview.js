import React from "react";
import "./UserPreview.css";

function UserPreview({ user, setSelectedUser }) {
  const handleClick = () => {
    console.log(user);
    setSelectedUser(user);
  };

  return (
    <>
      <li className="user-preview" onClick={handleClick}>
        {user.email}
      </li>
      {user.profilePicture && (
        <div className="user-photo">
          <img src={user.profilePicture}></img>
        </div>
      )}

    </>
  );
}

export default UserPreview;
