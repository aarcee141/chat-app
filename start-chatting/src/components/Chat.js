import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import axios from "axios";

function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages")) || {}
  );
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const auth = firebase.auth();
  const user = auth.currentUser;

  console.log(auth);

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
      setMessages(newMessages);
      setNewMessage("");
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: "0 0 250px", backgroundColor: "#f5f5f5" }}>
        <h2 style={{ padding: "20px" }}>Users</h2>
        <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
          {users.map((u) => (
            <li
              key={u.email}
              style={{
                cursor: "pointer",
                padding: "10px",
                backgroundColor:
                  selectedUser && u.email === selectedUser.email
                    ? "#e0e0e0"
                    : "inherit",
              }}
              onClick={() => handleUserClick(u)}
            >
              {u.email}
            </li>
          ))}
        </ul>
        <button
          onClick={() => handleSignOut()}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            margin: "20px",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>
      {selectedUser && (
        <div style={{ flex: "1", padding: "20px" }}>
          <h2 style={{ marginBottom: "20px" }}>{selectedUser.email}</h2>
          <div
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              height: "400px",
              overflowY: "scroll",
              marginBottom: "10px",
            }}
          >
            {messages[selectedUser.email] &&
              messages[selectedUser.email].map((m, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: m.sender === user.email ? "right" : "left",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor:
                        m.sender === user.email ? "#eee" : "#e0e0e0",
                      padding: "10px",
                      borderRadius: "10px",
                      marginBottom: "5px",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
          </div>
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
              }}
            />
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
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
