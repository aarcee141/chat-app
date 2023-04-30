import React from "react";
import firebase from "firebase/compat/app";
import "./Message.css";

function Message({ usersList, message }) {
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

  const senderUser = usersList?.find(user => user.email === message.sender);

  return (
    <>
      <div className={`message-header" ${isSentByCurrentUser ? 'sent-message-header' : 'received-message-header'}`}>
        {senderUser && (
          <div className="photo-container">
            <img src={senderUser.profilePicture}></img>
          </div>
        )}
        <div className="message-sender">{senderUser.name}</div>
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