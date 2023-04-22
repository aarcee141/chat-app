import React, { useState, useEffect } from "react";
import UsersList from "../UsersList/UsersList";
import MessageSection from "../MessagePane/MessagePane";

function ChatHome() {
  // Inputs:
  // Userlist
  // MessageSection
  return (
    <>
      <UsersList></UsersList>
      <MessageSection></MessageSection>
    </>
  );
}

export default ChatHome;
