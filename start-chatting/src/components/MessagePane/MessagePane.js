import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Message from "../Message/Message";
import firebase from "firebase/compat/app";
import "./MessagePane.css";
import MessageModel from "../../models/MessageModel";

function MessagePane({ user, messages, sendMessage }) {
  const [messageInput, setMessageInput] = useState("");

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleSendClick = async () => {
    if (messageInput.trim() !== "") {
      console.log(`Sending message: ${messageInput}`);

      const messageRequest = {
        from: firebase.auth().currentUser.email,
        to: user.email,
        message: messageInput,
        messageType: "message",
        authToken: await firebase.auth().currentUser.getIdToken(),
        clientMessageId: String(Date.now()),
      };
      sendMessage(JSON.stringify(messageRequest));
      messages.push(
        new MessageModel(
          messageRequest.message,
          messageRequest.from,
          messageRequest.to,
          new Date().toISOString(),
          null
        )
      );
      setMessageInput("");
    }
  };

  return (
    <>
      {user && (
        <div className="message-pane">
          <h2>{user.name}</h2>
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
      )}
    </>
  );
}

export default MessagePane;
