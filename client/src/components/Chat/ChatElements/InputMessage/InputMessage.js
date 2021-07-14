import React, {useState, useContext} from "react";
import Axios from "axios";
import UserContext from "../../../../context/UserContext";
import CurrentChatContext from "../../../../context/CurrentChatContext";
import { SocketContext } from "../../../../context/SocketContext";
import { Line } from "../../../UIKit";
import "./InputMessage.css";
 
const InputMessage = ({ messages, setMessages }) => {

  const [message, setMessage] = useState("");

  const { currentChat } = useContext(CurrentChatContext);
  const { userData } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!currentChat) return;

    const receiverId = currentChat.members.find(
      (member) => member._id !== userData.user._id
    );
    socket.emit("newArrivalMessageToServer", {
      senderId: userData.user._id,
      receiver: receiverId,
      text: message,
    });

    const newMessage = {
      sender: userData.user._id,
      groupId: currentChat._id,
      text: message,
    };

    try {
      const result = await Axios.post(
        `${process.env.REACT_APP_SERVER_URL}messages`,
        newMessage
      );
      setMessages([...messages, result.data]);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };


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
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" ? sendMessage(e) : null
            }
          />
          <button className="input-btn" onClick={(e) => sendMessage(e)}>
            <i class="input-btn-icon fas fa-arrow-alt-circle-right"></i>
          </button>
        </Line>
      </form>
    </div>
  );
};

export default InputMessage;
