import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import uploadProfilePic from "../../services/UploadProfilePic";

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
        <div>
            <h1>Edit Profile</h1>
            <div>
                <label>
                    Upload Profile Picture:
                    <input type="file" onChange={handleFileChange} />
                </label>
            </div>
            <button onClick={handleUpdateProfilePic}
            >Save Changes</button>
            <button onClick={handleGoBack}>Go Back!</button>

        </div>
    );
}

export default EditProfile;
