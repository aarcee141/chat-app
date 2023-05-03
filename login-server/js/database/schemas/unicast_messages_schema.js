"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnicastMessagesModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const unicastMessagesSchema = new mongoose_1.default.Schema({
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
const UnicastMessagesModel = mongoose_1.default.model("Unicast_messages", unicastMessagesSchema);
exports.UnicastMessagesModel = UnicastMessagesModel;
