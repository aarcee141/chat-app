import React from "react";
import "./Message.css";

function Message({ message }) {
  const date = new Date(message.sentTime);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const time = date.toLocaleTimeString("en-US", { timeStyle: "short" });

  return (
    <>
      <div className="message-header">
        <div>{message.sender}</div>
        <div>{`${month} ${day}, ${time}`}</div>
      </div>
      <div className="message-container">{message.content}</div>
    </>
  );
}

export default Message;
