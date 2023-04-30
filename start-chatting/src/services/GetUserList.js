import axios from "axios";
import UserModel from "../models/UserModel";
import firebase from "firebase/compat/app";

async function getUsersList() {
  try {
    const response = await axios.get(
      "http://ubuntu@ec2-54-212-18-31.us-west-2.compute.amazonaws.com:5000/api/getUsers",
      {
        headers: {
          Authorization:
            "Bearer " + (await firebase.auth().currentUser.getIdToken()),
        },
      }
    );
    const users = response.data;
    // console.log("Users: ", response, typeof users, Array.isArray(users));
    return users.map(
      (user) =>
        new UserModel(user.displayName, user.emailId, user.profilePicture)
    );
  } catch (error) {
    console.error(error);
  }
}

export default getUsersList;
