import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import uploadProfilePic from "../../services/UploadProfilePic";
import "./EditProfile.css";

function EditProfile() {
    const auth = firebase.auth();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleGoBack = () => {
        navigate("/");
    };

    const handleUpdateProfilePic = async () => {
        if (file) {
            await uploadProfilePic(file);
            navigate("/");
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
