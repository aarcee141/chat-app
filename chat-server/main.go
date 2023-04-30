package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

func main() {
	hub := newHub()
	go hub.run()

	db := NewDatabase("mongodb_config.json")
	go db.run()

	// Initialize the Firebase Admin SDK.
	ctx := context.Background()
	opt := option.WithCredentialsFile("firebase/serviceAccount.json")
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}
	auth := NewAuth(app)

	http.HandleFunc("/echo", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r, db, auth)
	})

	// http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "index.html")
	// })

	http.ListenAndServe(":8080", nil)
	fmt.Print("Started server and listening at 8080")
}
