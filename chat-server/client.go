package main

import (
	"encoding/json"
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
	send chan []byte
}

type Message struct {
	// Sender's email address.
	to string

	// Receiver's email address.
	from string

	// Message to be sent to the receiver.
	message string

	// MessageType
	// 1. Subscribe
	// 2. Message
	// 3. Presence
	messageType string

	messageId int64
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
		if string(objmap["messageType"]) == "\"subscribe\"" {
			fromEmail := string(objmap["from"])
			c.email = fromEmail[1 : len(fromEmail)-1]
			c.hub.register <- c
			continue
		}

		from, ok := objmap["from"]
		var fromString string
		if ok {
			fromString = string(from)[1 : len(string(from))-1]
		} else {
			continue
		}

		to, ok := objmap["to"]
		var toString string
		if ok {
			toString = string(to)[1 : len(string(to))-1]
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

		_, ok = objmap["message"]
		if ok {
			message1 := Message{to: toString, from: fromString, message: string(finalMessage)}
			c.hub.unicast <- &message1
		}
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
		case message, ok := <-c.send:
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
			w.Write(message)
			if err := w.Close(); err != nil {
				return
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
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}
