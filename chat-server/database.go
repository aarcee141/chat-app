package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Database struct {
	Client *mongo.Client

	Database *mongo.Database

	// Channel containing DB write operations.
	WriteToDb chan *MessageSchemaDB

	// Channel containing DB bulk read operations whose results will be sent to the client.
	ReadFromDb chan *ReadMessageAndSendToClient
}

type MessageSchemaDB struct {
	ID              primitive.ObjectID `bson:"_id,omitempty"`
	Sender          string             `bson:"sender,omitempty"`
	Receiver        string             `bson:"receiver,omitempty"`
	Content         string             `bson:"content,omitempty"`
	Time            primitive.DateTime `bson:"time,omitempty"`
	ClientMessageId string             `bson:"clientMessageId,omitempty"`
}

type ReadMessageAndSendToClient struct {
	Client              *Client
	MessageReadSchemaDb *MessageReadSchemaDB
}

type MessageReadSchemaDB struct {
	StartTime primitive.DateTime
	Sender    string
	Receiver  string
}

func NewDatabase() *Database {
	db := &Database{WriteToDb: make(chan *MessageSchemaDB), ReadFromDb: make(chan *ReadMessageAndSendToClient)}

	// Set client options
	clientOptions := options.Client().ApplyURI("mongodb://ec2-54-185-192-156.us-west-2.compute.amazonaws.com:27017")
	// clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	db.Client = client
	db.Database = client.Database("test")
	collection := db.Database.Collection("unicast_messages")
	println(collection.Name())

	return db
}

func (db *Database) Close() {
	err := db.Client.Disconnect(context.Background())
	if err != nil {
		log.Fatal(err)
	}
}

func (db *Database) UnicastMessages() *mongo.Collection {
	return db.Database.Collection("unicast_messages")
}

func (db *Database) run() {
	for {
		select {
		case m := <-db.WriteToDb:
			db.AddMessage(m)
		case qc := <-db.ReadFromDb:
			messages := db.ReadMessages(qc.MessageReadSchemaDb)
			if len(messages) > 0 {
				qc.Client.send <- qc.Client.ConvertMessageSchemaDBsToMessage(messages)
			}
		}
	}
}

func (db *Database) AddMessage(m *MessageSchemaDB) bool {
	collection := db.Database.Collection("unicast_messages")
	_, err := collection.InsertOne(context.Background(), m)
	if err != nil {
		log.Println(err)
	}
	return true
}

func (db *Database) ReadMessages(constraints *MessageReadSchemaDB) []MessageSchemaDB {
	collection := db.Database.Collection("unicast_messages")

	// Define a filter based on the constraints.
	filter := bson.M{
		"time": bson.M{
			"$gt": constraints.StartTime,
		},
	}

	// Conditionally add the Sender field to the filter if it's not null.
	if constraints.Sender != "" {
		filter["sender"] = constraints.Sender
	}

	// Conditionally add the Receiver field to the filter if it's not null.
	if constraints.Receiver != "" {
		filter["receiver"] = constraints.Receiver
	}
	ctx := context.Background()
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		log.Println(err)
	}
	var data []MessageSchemaDB
	for cursor.Next(ctx) {
		var message MessageSchemaDB
		if err := cursor.Decode(&message); err != nil {
			log.Fatal(err)
		}
		data = append(data, message)
	}
	return data
}
