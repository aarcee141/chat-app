import Message from "../Message/Message";
import "./MessagePane.css";

function MessagePane({ user, messages }) {
  return (
    <>
      <div className="message-pane">
        {user && <h2>{user.name}</h2>}
        {messages && (
          <div>
            {messages.map((message) => (
              <Message message={message}></Message>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MessagePane;
