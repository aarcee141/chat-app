import React, { useState, useEffect } from "react";
import UsersList from "../UsersList/UsersList";
import MessagePane from "../MessagePane/MessagePane";
import getMessages from "../../services/GetMessages";

function ChatHome() {
  // Inputs:
  // Userlist
  // MessageSection
  //   const [messages, setMessages] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserMessages, setSelectedUserMessages] = useState(null);

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
      ></MessagePane>
    </>
  );
}

export default ChatHome;
