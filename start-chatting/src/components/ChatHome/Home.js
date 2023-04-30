import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-image"></div>
      <div className="home-content">
        <div>
          <h1 className="home-heading">Welcome to Expresso Chat</h1>
          <p className="home-subheading">
            We're glad to have you here! Start chatting with your friends now.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
