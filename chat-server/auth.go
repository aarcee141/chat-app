package main

import (
	"context"
	"log"

	firebase "firebase.google.com/go"
)

type Auth struct {
	app *firebase.App
}

func NewAuth(app *firebase.App) *Auth {
	auth := &Auth{app: app}
	return auth
}

func (auth *Auth) VerifyIdToken(idToken string) string {
	// [START verify_id_token_golang]
	ctx := context.Background()
	client, err := auth.app.Auth(ctx)
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	token, err := client.VerifyIDToken(ctx, idToken)
	if err != nil {
		log.Fatalf("error verifying ID token: %v\n", err)
	}
	email := token.Claims["email"].(string)
	// [END verify_id_token_golang]

	return email
}
