import axios from "axios";
import MessageModel from "../models/MessageModel";
import firebase from "firebase/compat/app";

async function getMessages() {
  try {
    const response = await axios.get(
      "http://ubuntu@ec2-54-212-18-31.us-west-2.compute.amazonaws.com:5000/api/getUserMessages",
      {
        headers: {
          Authorization:
            "Bearer " + (await firebase.auth().currentUser.getIdToken()),
        },
      }
    );
    console.log("GetUserMessages: " + JSON.stringify(response));
    const messages = response.data;
    return [...messages.messagesFromUser, ...messages.messagesToUser]
      .map(
        (message) =>
          new MessageModel(
            message.content,
            message.sender,
            message.receiver,
            message.time,
            null
          )
      )
      .sort((a, b) => (a.sentTime > b.sentTime ? 1 : -1));
  } catch (error) {
    console.error(error);
  }
}

export default getMessages;
