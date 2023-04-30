import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSmile } from "@fortawesome/free-solid-svg-icons";
import Message from "../Message/Message";
import firebase from "firebase/compat/app";
import "./MessagePane.css";
import MessageModel from "../../models/MessageModel";
import EmojiPicker from 'emoji-picker-react';

function MessagePane({ user, usersList, messages, setMessages, sendMessage }) {
  const [messageInput, setMessageInput] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideEmojiPicker);
    return () => {
      document.removeEventListener("click", handleClickOutsideEmojiPicker);
    };
  }, []);

  const handleClickOutsideEmojiPicker = (event) => {
    const emojiButton = document.querySelector(".emoji-button");
    const isEmojiButtonClicked = emojiButton && emojiButton.contains(event.target);
    const isEmojiPickerClicked = emojiPickerRef.current && emojiPickerRef.current.contains(event.target);

    if (isEmojiButtonClicked || isEmojiPickerClicked) {
      return;
    }

    setShowEmojiPicker(false);
  };

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
      setMessages([
        ...messages,
        new MessageModel(
          messageRequest.message,
          messageRequest.from,
          messageRequest.to,
          new Date().toISOString(),
          null,
        ),
      ]);
      setMessageInput("");
    }
  };

  const onEmojiClick = (emojiData, event) => {
    setChosenEmoji(emojiData);
    setMessageInput(messageInput + emojiData.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendClick();
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
                  <Message key={message.id} usersList={usersList} message={message} />
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
              onKeyDown={handleKeyDown}
            />
            <div ref={emojiPickerRef} className="emoji-picker" style={{ display: showEmojiPicker ? 'block' : 'none' }}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
            <button className="send-button" onClick={handleSendClick}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
            <button className="emoji-button" onClick={toggleEmojiPicker}>
              <FontAwesomeIcon icon={faSmile} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MessagePane;
