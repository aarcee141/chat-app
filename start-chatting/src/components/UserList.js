import React from "react";

function UserList({ users, activeUsers, selectedUser, handleUserClick, handleSignOut }) {
    // console.log(users, activeUsers)
    return (
        <div style={{ flex: "0 0 250px", backgroundColor: "#f5f5f5" }}>
            <h2 style={{ padding: "20px" }}>Users</h2>
            <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
                {users.map((u) => (
                    <UserListItem
                        key={u.email}
                        user={u}
                        active={activeUsers.includes(u.email)}
                        selected={selectedUser && u.email === selectedUser.email}
                        handleClick={() => handleUserClick(u)}
                    />
                ))}
            </ul>
            <button
                onClick={() => handleSignOut()}
                style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    margin: "20px",
                    cursor: "pointer",
                }}
            >
                Sign Out
            </button>
        </div>
    );
}

function UserListItem({ user, active, selected, handleClick }) {
    return (
        <li
      style={{
        cursor: "pointer",
        padding: "10px",
        backgroundColor: selected ? "#e0e0e0" : "inherit",
        display: "flex",
        alignItems: "center"
      }}
      onClick={handleClick}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: active ? "green" : "gray",
          marginRight: "10px"
        }}
      ></div>
      <span>{user.email}</span>
    </li>
    );
}

export default UserList;
