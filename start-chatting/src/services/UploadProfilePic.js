import axios from "axios";
import UserModel from "../models/UserModel";
import firebase from "firebase/compat/app";

async function uploadProfilePic(file) {
    try {
        const response = await axios.get("http://localhost:5000/api/uploadProfilePicture", {
            headers: {
                Authorization:
                    "Bearer " + (await firebase.auth().currentUser.getIdToken()),
            },
            body: {
                file: file,
            }
        });
        const users = response.data;
        // console.log("Users: ", response, typeof users, Array.isArray(users));
    } catch (error) {
        console.error(error);
    }
}

export default uploadProfilePic;
