import mongoose from "mongoose";

const unicastMessagesSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  message_status: {
    type: String,
    required: true,
  },
  time: {
    // Time at which the server received the message.
    type: Date,
    required: true,
  },
  clientMessageId: {
    type: String,
    required: true,
  },
});

const UnicastMessagesModel = mongoose.model("Unicast_messages", unicastMessagesSchema);

export { UnicastMessagesModel };
