import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import uploadProfilePic from "../../services/UploadProfilePic";
import "./EditProfile.css";

function EditProfile() {
    const auth = firebase.auth();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [uploadPercentage, setUploadPercentage] = useState(0);


    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (!auth.currentUser) {
          navigate("/");
        }
      }, [auth.currentUser, navigate]);

    const handleGoBack = () => {
        navigate("/");
    };

    const handleUpdateProfilePic = async () => {
        if (file) {
            let resp = await uploadProfilePic(file);
            if (resp.status === "success") {
                navigate("/");
            } else {
                setErrorMessage(resp.message)
            }
        }
    };

    return (
        <div className="edit-profile-container">
            <h1>Edit Profile</h1>
            <div className="edit-profile-input-container">
                <label>
                    <span>Upload Profile Picture:</span>
                    <input type="file" onChange={handleFileChange} />
                </label>
                <label>{errorMessage}</label>
            </div>
            <div className="edit-profile-button-container">
                <button className="save-changes-button" onClick={handleUpdateProfilePic}>
                    Save Changes
                </button>
                <button className="go-back-button" onClick={handleGoBack}>
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default EditProfile;
