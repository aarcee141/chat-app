import React from "react";
import "./Message.css";

function Message({ message }) {
  return (
    <>
      <li className="message-container">{message}</li>
    </>
  );
}

export default Message;
