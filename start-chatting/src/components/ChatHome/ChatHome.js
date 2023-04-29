import React, { useState, useEffect } from "react";
import UsersList from "../UsersList/UsersList";
import MessagePane from "../MessagePane/MessagePane";
import getMessages from "../../services/GetMessages";
import firebase from "firebase/compat/app";
import useWebSocket, { ReadyState } from "react-use-websocket";
import MessageModel from "../../models/MessageModel";
import Header from "../Header/Header";

function ChatHome() {
  const [messages, setMessages] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserMessages, setSelectedUserMessages] = useState(null);

  const auth = firebase.auth();
  const subscribeRequest = {
    from: auth.currentUser.email,
    messageType: "subscribe",
  };
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:8080/echo",
    {
      onOpen: () => sendMessage(JSON.stringify(subscribeRequest)),
      shouldReconnect: (closeEvent) => true,
    }
  );

  useEffect(() => {
    getMessages().then((messages) => setMessages(messages));
  }, []);

  useEffect(() => {
    console.log("Triggered: " + JSON.stringify(messages));
    if (selectedUser != null && messages != null) {
      setSelectedUserMessages(
        messages.filter((message) => {
          return (
            (message.receiver === selectedUser.email && message.sender === auth.currentUser.email) ||
            (message.sender === selectedUser.email && message.receiver === auth.currentUser.email)
          );
        })
      );
    }
  }, [selectedUser, messages]);

  useEffect(() => {
    if (lastMessage != null && lastMessage.data.length > 0) {
      var data = JSON.parse(lastMessage.data);

      if (data.messageType === "message") {
        setMessages([
          ...messages,
          new MessageModel(
            data.message,
            data.from,
            data.to,
            data.serverTime,
            null,
          ),
        ]);
        console.log(
          "Last element: " + JSON.stringify(messages[messages.length - 1])
        );
      }
    }
  }, [lastMessage]);

  return (
    <div className="start-chatting">
      <Header> setSelectedUser={setSelectedUser} </Header>
      <UsersList setSelectedUser={setSelectedUser}></UsersList>
      <MessagePane
        user={selectedUser}
        setMessages={setMessages}
        messages={selectedUserMessages}
        sendMessage={sendMessage}
      ></MessagePane>
    </div>
  );
}

export default ChatHome;
