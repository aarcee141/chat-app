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

function ChatHome() {
  const auth = firebase.auth();
  const [messages, setMessages] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserMessages, setSelectedUserMessages] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUsersList().then((x) => {
      setUsersList(x);
    });
  }, []);

  useEffect(() => {
    if (usersList) {
      const currentUser = usersList.find(
        (user) => user.email === auth.currentUser?.email
      );
      if (currentUser) {
        setCurrentUser(currentUser);
      } else {
        // This should never happen.
      }
    }
  }, [usersList, auth.currentUser]);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
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
    getMessages().then((messages) => setMessages(messages));
  }, []);

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
      }
    }
  }, [lastMessage]);

  return (
    <div className="start-chatting">
      {currentUser && usersList && (
        <Header currentUser={currentUser} usersList={usersList} setSelectedUser={setSelectedUser} />
      )}
      <UsersList setSelectedUser={setSelectedUser}></UsersList>
      <MessagePane
        user={selectedUser}
        usersList={usersList}
        setMessages={setMessages}
        messages={selectedUserMessages}
        sendMessage={sendMessage}
      ></MessagePane>
    </div>
  );
}

export default ChatHome;
