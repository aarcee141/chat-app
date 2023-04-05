package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
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
	// 3. presence
	MessageType string `json:"messageType"`

	// Sent, delivered, read.
	StatusType string `json:"statusType"`

	// Message Id unique for every client.
	ClientMessageId string `json:"clientMessageId"`
}

func (c *Client) readPump() {
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

		userArr := make([]interface{}, 0, len(c.hub.clients))
		for key := range c.hub.clients {
			userArr = append(userArr, key)
		}

		activeUsers, err := json.Marshal(userArr)
		if err != nil {
			log.Printf("error: %v", err)
		}
		objmap["activeUsers"] = activeUsers

		finalMessage, err := json.Marshal(objmap)
		if err != nil {
			log.Printf("error: %v", err)
		}

		// For messageType == Subscribe, we send a self notification message with the list of active users.
		if string(objmap["messageType"]) == "\"subscribe\"" {
			c.email = fromString
			c.hub.register <- c
			// Message from User A -> server -> A.
			c.send <- &Message{To: fromString, From: fromString, Message: string(finalMessage)}
			continue
		}

		to, ok := objmap["to"]
		var toString string
		if ok {
			toString = string(to)[1 : len(string(to))-1]
		} else {
			continue
		}

		messageId, ok := objmap["clientMessageId"]
		var mIdString string
		if ok {
			mIdString = string(messageId)[1 : len(string(messageId))-1]
		} else {
			continue
		}

		finalMessage, err = json.Marshal(objmap)
		if err != nil {
			log.Printf("error: %v", err)
		}

		// Message from User A -> server -> B.
		message1 := Message{
			To:              toString,
			From:            fromString,
			Message:         string(finalMessage),
			ClientMessageId: mIdString,
			MessageType:     "message"}
		c.hub.unicast <- &message1

		// "Sent" notification message to the client.
		// Message from A -> server -> A
		objmap["to"] = objmap["from"]
		objmap["messageType"] = json.RawMessage("\"status\"")
		objmap["statusType"] = json.RawMessage("\"sent\"")
		delete(objmap, "message")

		finalMessage, err = json.Marshal(objmap)
		if err != nil {
			log.Printf("error: %v", err)
		}

		messageSent := &Message{
			To:              fromString,
			From:            fromString,
			MessageType:     "status",
			StatusType:      "sent",
			Message:         string(finalMessage),
			ClientMessageId: mIdString,
		}
		c.send <- messageSent
	}
}

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
			message := messageWithMetadata.Message
			w.Write([]byte(message))
			if err := w.Close(); err != nil {
				return
			}

			// Send a "delivered" notification back the client via the hub.
			fmt.Println(messageWithMetadata)
			if messageWithMetadata.MessageType == "message" {
				message1 := &Message{
					To:              messageWithMetadata.From,
					From:            messageWithMetadata.From,
					ClientMessageId: messageWithMetadata.ClientMessageId,
					MessageType:     "status",
					StatusType:      "delivered"}

				messageString, err := json.Marshal(message1)
				fmt.Println("message1: ", message1)
				if err != nil {
					log.Printf("error: %v", err)
					return
				}
				fmt.Println("messageString: ", string(messageString))
				message1.Message = string(messageString)
				fmt.Println("apple: ", message1)

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
func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{hub: hub, conn: conn, send: make(chan *Message)}

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}
