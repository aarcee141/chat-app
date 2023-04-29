import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import axios from "axios";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getAuth } from "firebase/auth";

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
  const [socket, setSocket] = useState("ws://localhost:8080/echo");
  const [messageId, setMessageId] = useState(0);
  const [clientMessageId, setClientMessageId] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [token, setToken] = useState([]);

  const [messageRequest, setMessageRequest] = useState({});

  const subscribeRequest = {
    from: user.email,
    messageType: "subscribe",
  };

  const { sendMessage, lastMessage, readyState } = useWebSocket(socket, {
    onOpen: () => sendMessage(JSON.stringify(subscribeRequest)),
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get("http://localhost:5000/api/getUsers");
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

  async function handleSendMessage(event) {
    event.preventDefault();
    if (selectedUser && newMessage) {
      const newMessages = { ...messages };
      if (!newMessages[selectedUser.emailId]) {
        newMessages[selectedUser.emailId] = [];
      } // Increment the message Id counter.

      setToken(await getAuth().currentUser.getIdToken());

      setMessageId(messageId + 1);
    }
  }

  // ClientMessageId is updated when messageId changes.
  useEffect(() => {
    setClientMessageId(String(Date.now() + "$" + messageId));
  }, [messageId]);

  // message is sent to server when clientMessageId is updated and user has been selected.
  useEffect(() => {
    if (selectedUser && newMessage) {
      const newMessages = { ...messages };
      console.log("Client Message Id changed", newMessage);
      if (!newMessages[selectedUser.emailId]) {
        newMessages[selectedUser.emailId] = [];
      }
      newMessages[selectedUser.emailId].push({
        sender: user.email,
        text: newMessage,
        clientMessageId: clientMessageId,
        state: "not_sent",
      });
      setMessageRequest({
        from: user.email,
        to: selectedUser.emailId,
        message: newMessage,
        messageType: "message",
        authToken: token,
        clientMessageId: clientMessageId,
      });
      setMessages(newMessages);
      setNewMessage("");
    }
  }, [clientMessageId]);

  function handleDeleteMessages(event) {
    event.preventDefault();
    if (selectedUser) {
      const newMessages = { ...messages };
      if (!newMessages[selectedUser.emailId]) {
        newMessages[selectedUser.emailId] = [];
      }
      newMessages[selectedUser.emailId] = [];
      setMessages(newMessages);
    }
  }

  useEffect(() => {
    if (messageRequest != {}) {
      console.log(messageRequest);
      sendMessage(JSON.stringify(messageRequest));
    }
  }, [messageRequest]);

  useEffect(() => {
    if (lastMessage != null && lastMessage.data.length > 0) {
      var data = JSON.parse(lastMessage.data);

      if (data.activeUsers.length > 0) {
        setActiveUsers(data.activeUsers);
      }
      if (data.messageType == "message") {
        const newMessages = { ...messages };
        newMessages[data.from].push({
          sender: data.from,
          text: data.message,
          state: "received",
        });
        setMessages(newMessages);
        setMessageHistory((prev) => prev.concat(lastMessage));
      } else if (data.messageType == "status") {
        console.log(data);
        const newMessages = { ...messages };
        newMessages[selectedUser.emailId]
          .filter((state) => state.clientMessageId == data.clientMessageId)
          .map((m) => {
            if (m.state == "not_sent" || m.state == "sent") {
              m.state = data.statusType;
            }
          });
        setMessages(newMessages);
      } else if (data.messageType == "previousMessage") {
        // TODO(sheldont): Process previous day's messages that are loaded from the database.
        console.log(data.previousMessages);
      }
    }
  }, [lastMessage, setMessageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Connected",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {selectedUser && (
        <>
          <div style={{ flex: "1", padding: "20px" }}>
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
            <form onSubmit={handleDeleteMessages}>
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
          </div>
        </>
      )}
      <span>The Chat server is currently {connectionStatus}</span>
    </div>
  );
}

export default Chat;
