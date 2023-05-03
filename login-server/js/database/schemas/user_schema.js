"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        // This code generates a random number, converts it to a base-36 string,
        // and then takes a substring starting from the second character.
        // This will give you a random string with 11 characters.
        default: Math.random().toString(36).substring(2),
    },
    emailId: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    profilePicture: {
        type: String,
    },
});
const UserModel = mongoose_1.default.model("Users", userSchema);
exports.UserModel = UserModel;
