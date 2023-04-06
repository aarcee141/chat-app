import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import axios from "axios";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import UserList from "./UserList";
import MessageSection from "./MessageSection";
// import ChatInputForm from "./ChatInputForm";


function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages")) || {}
  );
  const [messageHistory, setMessageHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const auth = firebase.auth();
  const user = auth.currentUser;
  const [socket, setSocket] = useState('ws://localhost:8080/echo');
  const [messageId, setMessageId] = useState(0);
  const [activeUsers, setActiveUsers] = useState([]);

  const subscribeRequest = {
    from: user.email,
    messageType: 'subscribe',
  };

  const [messageRequest, setMessageRequest] = useState({});

  const { sendMessage, lastMessage, readyState } = useWebSocket(socket, {
    onOpen: () => sendMessage(JSON.stringify(subscribeRequest))
  });

  // console.log(auth);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get("http://localhost:5000/api/getUsers");
        console.log(response);
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getUsers();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  function handleUserClick(user) {
    setSelectedUser(user);
  }

  function handleSignOut() {
    auth.signOut().then(() => {
      localStorage.removeItem("auth");
      navigate("/");
    });
  }

  function handleMessageChange(event) {
    setNewMessage(event.target.value);
  }

  function handleSendMessage(event) {
    event.preventDefault();
    if (selectedUser && newMessage) {
      const newMessages = { ...messages };
      if (!newMessages[selectedUser.email]) {
        newMessages[selectedUser.email] = [];
      }
      newMessages[selectedUser.email].push({
        sender: user.email,
        text: newMessage,
      });
      setMessageId(messageId + 1)
      setMessageRequest({
        from: user.email,
        to: selectedUser.email,
        message: newMessage,
        messageType: "message",
        clientMessageId: String(Date.now() + "$" + messageId)
      });
      setMessages(newMessages);
      setNewMessage("");
    }
  }

  function handleDeleteMessages(event) {
    event.preventDefault();
    if (selectedUser) {
      const newMessages = { ...messages };
      if (!newMessages[selectedUser.email]) {
        newMessages[selectedUser.email] = [];
      }
      newMessages[selectedUser.email] = []
      setMessages(newMessages);
    }
  }

  useEffect(() => {
    if (messageRequest != {}) {
      sendMessage(JSON.stringify(messageRequest));
    }
  }, [messageRequest]);

  useEffect(() => {
    if (lastMessage != null && lastMessage.data.length > 0) {
      var data = JSON.parse(lastMessage.data)
      if (data.messageType == "message") {
        const newMessages = { ...messages };
        newMessages[data.from].push({
          sender: data.from,
          text: data.message,
        });
        if (data.activeUsers.length > 0) {  
          setActiveUsers(data.activeUsers);
        }
        setMessages(newMessages);
        setMessageHistory((prev) => prev.concat(lastMessage));
      } else if (data.messageType == "subscribe") {
        if (data.activeUsers.length > 0) {  
          setActiveUsers(data.activeUsers);
        }
      } else if (data.messageType == "status") {
        // Do something useful with the status being pushed.
        // The status for a message could be "sent" or "delivered".
        console.log(data)
      }
    }
  }, [lastMessage, setMessageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <UserList
        users={users}
        selectedUser={selectedUser}
        activeUsers={activeUsers}
        handleUserClick={handleUserClick}
        handleSignOut={handleSignOut}
      />
      {selectedUser && (
        <>
        <div style={{ flex: "1", padding: "20px" }}>
        <MessageSection
          selectedUser={selectedUser}
          messages={messages}
          user={user} 
          />
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                width: "100%",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                marginRight: "10px",
                marginBottom: "10px",
              }} />
            <button
              type="submit"
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Send
            </button>
          </form><form onSubmit={handleDeleteMessages}>
            <button
              type="submit"
              style={{
                backgroundColor: "#f05b6a",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Delete chat
            </button>
          </form>
        </div></>
      )}
      <span>The Chat server is currently {connectionStatus}</span>
    </div>
  );

}

export default Chat;
