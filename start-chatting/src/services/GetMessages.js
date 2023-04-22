import axios from "axios";
import MessageModel from "../models/MessageModel";

function getMessages() {
  try {
    return [
      new MessageModel(
        "Hello",
        "ravi4594@gmail.com",
        "sheltauro@gmail.com",
        null,
        null
      ),
    ];
    // const response = await axios.get("http://localhost:5000/api/getMessages");
    // const messages = response.data;
    // console.log(
    //   "Message: ",
    //   response,
    //   typeof messages,
    //   Array.isArray(messages)
    // );
    // return messages.map(
    //   (message) =>
    //     new MessageModel(
    //       message.content,
    //       message.sender,
    //       message.receiver,
    //       message.sentTime,
    //       message.receivedTime
    //     )
    // );
  } catch (error) {
    console.error(error);
  }
}

export default getMessages;
