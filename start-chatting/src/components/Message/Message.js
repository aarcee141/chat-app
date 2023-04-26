import React from "react";
import firebase from "firebase/compat/app";
import "./Message.css";

function Message({ message }) {
  const date = new Date(message.sentTime);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const time = date.toLocaleTimeString("en-US", { timeStyle: "short" });
  const auth = firebase.auth();

  return (
    <>
      <div className="message-header">
        {auth.currentUser.photoURL &&
          <div className="photo-container">
            <img src={auth.currentUser.photoURL}></img>
          </div>}
        <div>{message.sender}</div>
        <div>{`${month} ${day}, ${time}`}</div>
      </div>
      <div className="message-container"> {message.content}</div>
    </>
  );
}

export default Message;
