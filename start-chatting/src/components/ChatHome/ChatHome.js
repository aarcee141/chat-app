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
  const [usersList, setUsersList] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  function getCurrentUser(usersList) {
    return usersList.find((user) => user.email === auth.currentUser?.email);
  }

  function initialize() {
    getUsersList().then((users) => {
      // Set current user.
      setCurrentUser(getCurrentUser(users));
      // Set users list.
      setUsersList(
        // Filter out the current user before setting users list.
        users.filter((user) => user.email !== auth.currentUser.email)
      );
    });

    // Set messages.
    getMessages().then((messages) => setMessages(messages));
  }

  // Get all messages for the selected users in the users list.
  function getUserMessages(user) {
    if (messages == null) return [];

    return messages.filter((message) => {
      return (
        (message.receiver === user.email &&
          message.sender === auth.currentUser.email) ||
        (message.sender === user.email &&
          message.receiver === auth.currentUser.email)
      );
    });
  }

  // Sort the users list based on the most recent messages sent or received for that user.
  function sortUsersListByLastMessage() {
    if (usersList == null || messages == null) return [];

    var getMostRecentMessageTimeStamp = (messages) => {
      return messages.reduce((latestTimestamp, message) => {
        return new Date(message.sentTime) > new Date(latestTimestamp)
          ? message.sentTime
          : latestTimestamp;
      }, "0000-01-01T00:00:00.000Z");
    };

    usersList.sort((a, b) => {
      return (
        new Date(getMostRecentMessageTimeStamp(getUserMessages(b))) -
        new Date(getMostRecentMessageTimeStamp(getUserMessages(a)))
      );
    });
  }

  // Filter users to only have the users which have sent/recieved a message to currentUser.
  function getFilteredUsersList() {
    if (usersList == null || messages == null) return [];

    sortUsersListByLastMessage();
    return usersList.filter((user) =>
      messages.some(
        (message) =>
          (message.sender === user.email &&
            message.receiver === auth.currentUser.email) ||
          (message.sender === auth.currentUser.email &&
            message.receiver === user.email)
      )
    );
  }

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
    } else {
      initialize();
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

  // Append the messages with the last message received by the user and make
  // a notification sound.
  useEffect(() => {
    const notificationSound = new Audio("Message - Notification.mp3");
    if (lastMessage != null && lastMessage.data.length > 0) {
      var data = JSON.parse(lastMessage.data);

      if (data.messageType === "message") {
        setMessages((messages) => [
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
        users={getFilteredUsersList()}
        setSelectedUser={setSelectedUser}
      ></UsersList>
      {selectedUser ? (
        <MessagePane
          user={selectedUser}
          currentUser={currentUser}
          setMessages={setMessages}
          messages={getUserMessages(selectedUser)}
          sendMessage={sendMessage}
        ></MessagePane>
      ) : (
        <Home />
      )}
    </div>
  );
}

export default ChatHome;
