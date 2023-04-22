import axios from "axios";
import MessageModel from "../models/MessageModel";

async function getUsersList() {
  try {
    const response = await axios.get("http://localhost:5000/api/getMessages");
    const messages = response.data;
    // console.log(
    //   "Message: ",
    //   response,
    //   typeof messages,
    //   Array.isArray(messages)
    // );
    return messages.map(
      (message) =>
        new MessageModel(
          message.content,
          message.time,
          message.toUser,
          message.fromUser
        )
    );
  } catch (error) {
    console.error(error);
  }
}

export default getUsersList;
