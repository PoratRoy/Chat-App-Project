import React from "react";
import "./Messages.css";
import Message from "./Message/Message";

const Messages = ({ messages, user, scrollRef }) => {
  
  return (
      <div className="chats">
        {messages.map((message, i) => (
          <div key={i} ref={scrollRef}>
            <Message message={message} user={user} />
          </div>
        ))}
      </div>
  );
};

export default Messages;
