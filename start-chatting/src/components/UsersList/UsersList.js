import React, { useState, useEffect } from "react";
import getUsersList from "../../services/GetUserList";
import UserPreview from "../UserPreview/UserPreview";
import "./UsersList.css";

function UsersList() {
  const [users, setUsers] = useState(null);
  // Input: None
  // UserPreview
  // Output: Sidepane html
  // API calls: GetUserList
  getUsersList().then((x) => setUsers(x));
  // * On clicking the user we would need a call back on which user we have selected.
  // * Then the call back can be a function which would return the user object to Chat home.
  // * Chat home should have information about all the messages for the selected user which it passes to Message section.
  // * So we pass in a list of messages or pass in the selected user and the list of messages.
  // * We can make a messages object similar to the one which we created for users.
  // * Fields for message model: content, time

  return (
    <div className="user-list-container">
      <ul className="user-list">
        {users && (
          <div>
            {users.map((user) => (
              <UserPreview user={user}></UserPreview>
            ))}
          </div>
        )}
      </ul>
    </div>
  );
}

export default UsersList;
