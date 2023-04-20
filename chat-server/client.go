package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Client struct {
	// Email address of the client.
	email string

	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan *Message

	// Store the messages already received by ensuring that the messageId is unique.
	// KV(ClientMessageId -> true)
	sentMessages map[string]bool
}

type Message struct {
	// Sender's email address.
	To string `json:"to"`

	// Receiver's email address.
	From string `json:"from"`

	// Message to be sent to the receiver.
	Message string `json:"message"`

	// MessageType
	// 1. subscribe
	// 2. message
	// 3. status
	// 4. load previous messages (previousMessage)
	MessageType string `json:"messageType"`

	// Sent, delivered, read.
	StatusType string `json:"statusType"`

	// Message Id unique for every client.
	ClientMessageId string `json:"clientMessageId"`

	ActiveUsers []string `json:"activeUsers"`

	// Array of previous messages.
	PreviousMessages []Message `json:"previousMessages"`
}

func (c *Client) ConvertMessageSchemaDBsToMessage(dbMessages []MessageSchemaDB) *Message {
	// Create an array of active users.
	activeUsers := make([]string, 0, len(c.hub.clients))
	for key := range c.hub.clients {
		activeUsers = append(activeUsers, key)
	}

	previousMessages := make([]Message, len(dbMessages))
	for i, msg := range dbMessages {
		previousMessages[i] = Message{
			To:               msg.Receiver,
			From:             msg.Sender,
			Message:          msg.Content,
			MessageType:      "message",
			ClientMessageId:  msg.ClientMessageId,
			ActiveUsers:      nil,
			PreviousMessages: nil,
		}
	}
	loadMessage := &Message{
		To:               c.email,
		From:             c.email,
		MessageType:      "previousMessage",
		ActiveUsers:      activeUsers,
		PreviousMessages: previousMessages,
	}
	return loadMessage
}

// Function to load user messages from db for the current user from the previous 24 hours.
func (c *Client) loadUserMessages(db *Database) {
	user := c.email
	userIsSender := &MessageReadSchemaDB{
		StartTime: primitive.NewDateTimeFromTime(time.Now().Add(time.Hour * -24)),
		Sender:    user,
		Receiver:  "",
	}
	userIsReceiver := &MessageReadSchemaDB{
		StartTime: primitive.NewDateTimeFromTime(time.Now().Add(time.Hour * -24)),
		Sender:    "",
		Receiver:  user,
	}
	db.ReadFromDb <- &ReadMessageAndSendToClient{Client: c, MessageReadSchemaDb: userIsSender}
	db.ReadFromDb <- &ReadMessageAndSendToClient{Client: c, MessageReadSchemaDb: userIsReceiver}
}

// Function to constantly read & process messages from the client.
func (c *Client) readPump(db *Database) {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		mess := string(message)

		var objmap map[string]json.RawMessage
		err = json.Unmarshal([]byte(mess), &objmap)
		if err != nil {
			log.Printf("error: %v", err)
			continue
		}

		from, ok := objmap["from"]
		var fromString string
		if ok {
			fromString = string(from)[1 : len(string(from))-1]
		} else {
			continue
		}

		activeUsers := make([]string, 0, len(c.hub.clients))
		for key := range c.hub.clients {
			activeUsers = append(activeUsers, key)
		}

		// For messageType == Subscribe, we send a self notification message with the list of active users.
		if string(objmap["messageType"]) == "\"subscribe\"" {
			c.email = fromString
			c.hub.register <- c
			// Message from User A -> server -> A.
			c.send <- &Message{
				To:          fromString,
				From:        fromString,
				MessageType: "subscribe",
				ActiveUsers: activeUsers}

			// Load user messages from db.
			c.loadUserMessages(db)
			continue
		}

		messageId, ok := objmap["clientMessageId"]
		var mIdString string
		if ok {
			mIdString = string(messageId)[1 : len(string(messageId))-1]
		} else {
			continue
		}

		// Check if the same message has already been received by the server.
		if _, ok := c.sentMessages[mIdString]; ok {
			continue
		} else {
			c.sentMessages[mIdString] = true
		}

		to, ok := objmap["to"]
		var toString string
		if ok {
			toString = string(to)[1 : len(string(to))-1]
		} else {
			continue
		}

		messageBytes, ok := objmap["message"]
		var messageString string
		if ok {
			messageString = string(messageBytes)[1 : len(string(messageBytes))-1]
		} else {
			continue
		}

		// Message from User A -> server -> B.
		message1 := Message{
			To:              toString,
			From:            fromString,
			Message:         messageString,
			ClientMessageId: mIdString,
			MessageType:     "message",
			ActiveUsers:     activeUsers}

		if toString != fromString {
			c.hub.unicast <- &message1
		}

		// Add messages to database asynchronously.
		messageToDb := &MessageSchemaDB{
			Sender:          fromString,
			Receiver:        toString,
			Content:         messageString,
			MessageStatus:   "sent",
			Time:            primitive.NewDateTimeFromTime(time.Now()),
			ClientMessageId: mIdString,
		}
		db.WriteToDb <- messageToDb

		// "Sent" notification message to the client.
		// Message from A -> server -> A
		objmap["to"] = objmap["from"]
		objmap["messageType"] = json.RawMessage("\"status\"")
		objmap["statusType"] = json.RawMessage("\"sent\"")
		delete(objmap, "message")

		messageSent := &Message{
			To:              fromString,
			From:            fromString,
			MessageType:     "status",
			StatusType:      "sent",
			ClientMessageId: mIdString,
			ActiveUsers:     activeUsers,
		}
		c.send <- messageSent
	}
}

// Function to send a message to the client post processing.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case messageWithMetadata, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			messageString, err := json.Marshal(messageWithMetadata)
			if err != nil {
				log.Printf("error: %v", err)
				return
			}
			w.Write([]byte(messageString))
			if err := w.Close(); err != nil {
				return
			}

			// Send a "delivered" notification back the client via the hub.
			if messageWithMetadata.MessageType == "message" {
				message1 := &Message{
					To:              messageWithMetadata.From,
					From:            messageWithMetadata.From,
					ClientMessageId: messageWithMetadata.ClientMessageId,
					MessageType:     "status",
					StatusType:      "delivered",
					ActiveUsers:     messageWithMetadata.ActiveUsers}

				c.hub.unicast <- message1
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// serveWs handles websocket requests from the peer.
func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request, db *Database) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := &Client{hub: hub, conn: conn, send: make(chan *Message), sentMessages: make(map[string]bool)}

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump(db)
}
