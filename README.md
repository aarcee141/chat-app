# Chat App 💻

An easy-to-use chat app where you can communicate with all signed up users. The project has three sections:
1. React JS frontend (start-chatting)
2. Node JS backend (login-server) --> Handles the login/signup and user management.
3. Go backend (chat-server) --> Handles the actual messaging via websockets.

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/YourUsername/chat-app.git
```

### 2. Install the required dependencies in each of the sections:
- `start-chatting`:
```bash
cd start-chatting
npm install
```
- `login-server`:
```bash
cd start-chatting
npm install
```
- `chat-server`: 
```bash
cd chat-server
go get .
```

### 3. Add the firebase service account metadata.
This is to ensure that your server can send auth tokens to firebase for verification. You need to add this file to two locations:
- `chat-server/firebase/serviceAccount.json` for the go chat server.
- `login-server/config/firebase/serviceAccount.json` for the login & user-management server.

## Running the project. 
### 1. You will need to run each of the sections independently. To do this create three terminals and in each of them paste the following commands:
- `start-chatting`:
```bash
cd start-chatting
npm start
```
- `login-server`:
```bash
cd start-chatting
npm start
```
- `chat-server`: 
```bash
cd chat-server
go run *.go
```

