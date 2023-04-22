import React, { useState, useEffect } from "react";
import getUsersList from "../../services/GetUserList";
import UserPreview from "../UserPreview/UserPreview";
import "./UsersList.css";

function UsersList({ setSelectedUser }) {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    getUsersList().then((x) => setUsers(x));
  }, []);

  return (
    <div className="user-list-container">
      <ul className="user-list">
        {users && (
          <div>
            {users.map((user) => (
              <UserPreview
                user={user}
                setSelectedUser={setSelectedUser}
              ></UserPreview>
            ))}
          </div>
        )}
      </ul>
    </div>
  );
}

export default UsersList;
