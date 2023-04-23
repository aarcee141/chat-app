import React, { useState, useEffect } from "react";
import UsersList from "../UsersList/UsersList";
import MessagePane from "../MessagePane/MessagePane";
import getMessages from "../../services/GetMessages";
import firebase from "firebase/compat/app";
import useWebSocket, { ReadyState } from "react-use-websocket";

function ChatHome() {
  //   const [messages, setMessages] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserMessages, setSelectedUserMessages] = useState(null);

  const auth = firebase.auth();
  const subscribeRequest = {
    from: auth.currentUser,
    messageType: "subscribe",
  };
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:8080/echo",
    {
      onOpen: () => sendMessage(JSON.stringify(subscribeRequest)),
      shouldReconnect: (closeEvent) => true,
    }
  );

  //   getMessages().then((value) => setMessages(value));

  //   useEffect(() => {
  //     if (messages != null) {
  //       setSelectedUserMessages(
  //         messages.filter((message) => {
  //           return message.receiver === selectedUser;
  //         })
  //       );
  //     }
  //   }, [selectedUser, messages]);
  useEffect(() => {
    console.log("SelectedUser: " + selectedUser);
  }, [selectedUser]);

  return (
    <>
      <UsersList setSelectedUser={setSelectedUser}></UsersList>
      <MessagePane
        user={selectedUser}
        messages={selectedUserMessages}
        sendMessage={sendMessage}
      ></MessagePane>
    </>
  );
}

export default ChatHome;
