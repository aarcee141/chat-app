import React from "react";

function MessageSection({ selectedUser, messages, user }) {
    return (
        (<div>
            <h2 style={{ marginBottom: "20px" }}>{selectedUser.email}</h2>
            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    height: "400px",
                    overflowY: "scroll",
                    marginBottom: "10px",
                }}
            >
                {messages[selectedUser.email] && messages[selectedUser.email].map((m, index) => (
                    <Message key={index} message={m} user={user} />
                ))}
            </div>
        </div>
        )
    );
}

function Message({ message, user }) {
    const isUserMessage = message.sender === user.email;
    const textAlign = isUserMessage ? "right" : "left";
    const backgroundColor = isUserMessage ? "#25D366" : "#e0e0e0";

    return (
        <div style={{ textAlign }}>
            <div
                style={{
                    display: "inline-block",
                    backgroundColor,
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "5px",
                    position: "relative"
                }}
            >
                {message.text}
                {message.state === "sent" && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <div
                            style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor: "#D32592",
                                borderRadius: "50%",
                                marginRight: "5px"
                            }}
                        />
                    </div>
                )}
                {message.state === "delivered" && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <div
                            style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor: "#D32592",
                                borderRadius: "50%",
                                marginRight: "5px"
                            }}
                        />
                        <div
                            style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor: "#D32592",
                                borderRadius: "50%",
                                marginRight: "5px"
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessageSection;