import React from "react";
import { Line } from "../../../UIKit";
import "./InputMessage.css";

const InputMessage = ({ message, setMessage, sendMessage }) => {
  return (
    <div className="input-continer">
      <form className="input-items">
        <Line>
          <textarea
            className="txt input-text"
            rows="1"
            cols="150"
            placeholder="Type your message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyPress={(event) =>
              event.key === "Enter" ? sendMessage(event) : null
            }
          />
          <button className="input-btn" onClick={(event) => sendMessage(event)}>
            <i class="input-btn-icon fas fa-arrow-alt-circle-right"></i>
          </button>
        </Line>
      </form>
    </div>
  );
};

export default InputMessage;
