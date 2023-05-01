import React, { useState, useEffect } from "react";
import UsersList from "../UsersList/UsersList";
import MessagePane from "../MessagePane/MessagePane";
import getMessages from "../../services/GetMessages";
import firebase from "firebase/compat/app";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useNavigate } from "react-router-dom";
import MessageModel from "../../models/MessageModel";
import Header from "../Header/Header";
import getUsersList from "../../services/GetUserList";
import Home from "./Home";

function ChatHome() {
  const auth = firebase.auth();
  const [messages, setMessages] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserMessages, setSelectedUserMessages] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  function getCurrentUser(usersList) {
    return usersList.find((user) => user.email === auth.currentUser?.email);
  }

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
    } else {
      getUsersList().then((users) => {
        setCurrentUser(getCurrentUser(users));
        // Filter out the current user.
        const filteredUsers = users.filter(
          (user) => user.email !== auth.currentUser.email
        );
        setUsersList(filteredUsers);
      });
      getMessages().then((messages) => setMessages(messages));
    }
  }, [auth.currentUser, navigate]);

  const subscribeRequest = {
    from: auth.currentUser ? auth.currentUser.email : "example123@gmail.com",
    messageType: "subscribe",
  };
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://ubuntu@ec2-54-212-18-31.us-west-2.compute.amazonaws.com:8080/echo",
    {
      onOpen: () => sendMessage(JSON.stringify(subscribeRequest)),
      shouldReconnect: (closeEvent) => true,
    }
  );

  useEffect(() => {
    if (selectedUser != null && messages != null) {
      setSelectedUserMessages(
        messages.filter((message) => {
          return (
            (message.receiver === selectedUser.email &&
              message.sender === auth.currentUser.email) ||
            (message.sender === selectedUser.email &&
              message.receiver === auth.currentUser.email)
          );
        })
      );
    }
  }, [selectedUser, messages]);

  useEffect(() => {
    const notificationSound = new Audio("Message - Notification.mp3");
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
            null
          ),
        ]);
        notificationSound.play();
      }
    }
  }, [lastMessage]);

  return (
    <div className="start-chatting">
      {currentUser && usersList && (
        <Header
          currentUser={currentUser}
          usersList={usersList}
          setSelectedUser={setSelectedUser}
        />
      )}
      <UsersList
        users={usersList}
        setSelectedUser={setSelectedUser}
      ></UsersList>
      {selectedUser ? (
        <MessagePane
          user={selectedUser}
          currentUser={currentUser}
          setMessages={setMessages}
          messages={selectedUserMessages}
          sendMessage={sendMessage}
        ></MessagePane>
      ) : (
        <Home />
      )}
    </div>
  );
}

export default ChatHome;
