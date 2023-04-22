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
        {user.name}
      </li>
    </>
  );
}

export default UserPreview;
