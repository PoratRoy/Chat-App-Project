import React from "react";
import "./Input.css";

const Input = ({ message, setMessage, sendMessage }) => {
  return (
    <div className="input-continer">
      <form className="input-items">
        <textarea
          type="text"
          className="text input-text"
          rows="1"
          cols="150"
          placeholder="Type your message..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyPress={(event) =>
            event.key === "Enter" ? sendMessage(event) : null
          }
        />
        <button className="input-btn"
          onClick={(event) => sendMessage(event)}
        >
          <i class="input-btn-icon fas fa-arrow-alt-circle-right"></i>
        </button>
      </form>
    </div>
  );
};

export default Input;
