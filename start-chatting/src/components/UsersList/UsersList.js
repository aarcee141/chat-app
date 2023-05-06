import React, { useState, useEffect } from "react";
import getUsersList from "../../services/GetUserList";
import UserPreview from "../UserPreview/UserPreview";
import "./UsersList.css";

function UsersList({ users, setSelectedUser, emailToUnreadMessagesCount }) {
  return (
    <div className="user-list-container">
      <ul className="user-list">
        {users && (
          <div>
            {users.map((user) => (
              <UserPreview
                user={user}
                setSelectedUser={setSelectedUser}
                unReadMessagesCount={
                  emailToUnreadMessagesCount.get(user.email) ?? 0
                }
              ></UserPreview>
            ))}
          </div>
        )}
      </ul>
    </div>
  );
}

export default UsersList;
