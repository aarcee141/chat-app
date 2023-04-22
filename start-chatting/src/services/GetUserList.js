import axios from "axios";
import UserModel from "../models/UserModel";

async function getUsersList() {
  try {
    const response = await axios.get("http://localhost:5000/api/getUsers");
    const users = response.data;
    // console.log("Users: ", response, typeof users, Array.isArray(users));
    return users.map((user) => new UserModel(user.displayName, user.emailId));
  } catch (error) {
    console.error(error);
  }
}

export default getUsersList;
