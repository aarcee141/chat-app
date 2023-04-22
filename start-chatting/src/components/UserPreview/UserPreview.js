import React from "react";
import "./UserPreview.css";

function UserPreview({ user }) {
  return (
    <>
      <li className="user-preview">{user.name}</li>
    </>
  );
}

export default UserPreview;
