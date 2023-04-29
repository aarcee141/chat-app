import { useState, useEffect } from "react";
import ReactSearchBox from "react-search-box";
import getUsersList from "../../services/GetUserList";
import "./SearchBox.css";

function SearchBox({ setSelectedUser }) {
    const [usersList, setUsersList] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getUsersList().then((x) => setUsersList(x));
    }, []);

    const handleSelect = (user) => {
        setSelectedUser(user);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    let filteredUsers = [];
    if (usersList) {
        const filteredUsers = usersList && usersList.filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    const renderOption = (user) => {
        return (
            <div key={user.email} className="user-option">
                <img src={user.photoURL} alt={user.name} />
                <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="search-box-container">
            {usersList && (
                <ReactSearchBox
                    placeholder="Search for a user..."
                    data={filteredUsers}
                    onSelect={handleSelect}
                    onChange={handleSearch}
                    autoFocus
                    fuseConfigs={{
                        tokenize: true,
                        threshold: 0.3,
                    }}
                    renderOption={renderOption}
                />
            )}
        </div>
    );
}

export default SearchBox;
