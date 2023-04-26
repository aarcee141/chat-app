import React from "react";
import firebase from "firebase/compat/app";
import "./Message.css";

function Message({ message }) {
  const auth = firebase.auth();
  const isSentByCurrentUser = message.sender === auth.currentUser.email;

  function getMessageTime(message) {
    const date = new Date(message.sentTime);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
        ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }


  return (
    <>
      <div className={`message-header" ${isSentByCurrentUser ? 'sent-message-header' : 'received-message-header'}`}>
        {auth.currentUser.photoURL && (
          <div className="photo-container">
            <img src={auth.currentUser.photoURL}></img>
          </div>
        )}
        <div className="message-sender">{message.sender}</div>
        <div className="message-time"> {getMessageTime(message)} </div>
      </div>
      <div
        className={`message-container ${isSentByCurrentUser ? 'sent-message' : 'received-message'
          }`}
      >
        {message.content}
      </div>
    </>);
}

export default Message;
