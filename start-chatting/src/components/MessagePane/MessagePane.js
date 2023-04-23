import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Message from "../Message/Message";
import firebase from "firebase/compat/app";
import "./MessagePane.css";

function MessagePane({ user, messages, sendMessage }) {
  const [messageInput, setMessageInput] = useState("");

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleSendClick = () => {
    if (messageInput.trim() !== "") {
      console.log(`Sending message: ${messageInput}`);
      console.log("Selected User: " + JSON.stringify(user.email));

      const messageRequest = {
        from: firebase.auth().currentUser.email,
        to: user.email,
        message: messageInput,
        messageType: "message",
        authToken: firebase.auth().authToken,
      };
      console.log(messageRequest);
      sendMessage(JSON.stringify(messageRequest));
      setMessageInput("");
    }
  };

  return (
    <div className="message-pane">
      {user && <h2>{user.name}</h2>}
      <div className="messages">
        {messages && (
          <div>
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          placeholder="Type a message"
          className="message-input"
          value={messageInput}
          onChange={handleInputChange}
        />
        <button className="send-button" onClick={handleSendClick}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}

export default MessagePane;
