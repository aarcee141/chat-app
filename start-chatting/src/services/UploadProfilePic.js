import axios from "axios";
import UserModel from "../models/UserModel";
import firebase from "firebase/compat/app";

async function uploadProfilePic(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://ubuntu@ec2-54-212-18-31.us-west-2.compute.amazonaws.com:5000/api/uploadProfilePicture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization:
            "Bearer " + (await firebase.auth().currentUser.getIdToken()),
        },
      }
    );
  } catch (error) {
    console.log("kuch wrong hai");
    console.error(error);
  }
}

export default uploadProfilePic;
