import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
});

const UserModel = mongoose.model("Users", userSchema);

export { UserModel };
