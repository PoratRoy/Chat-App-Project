import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import NavBar from "./ChatElements/NavBar/NavBar";
import Header from "./ChatElements/Header/Header";
import Messages from "./ChatElements/Messages/Messages";
import InputMessage from "./ChatElements/InputMessage/InputMessage";
import UserContext from "../../context/UserContext";
import CurrentChatContext from "../../context/CurrentChatContext";
import { SocketContext } from "../../context/SocketContext";
import "./Chat.css";

const Chat = () => {
  //#region Instances
  const [newArrivalMessage, setNewArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);

  const { userData, setUserData } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const history = useHistory();
  //#endregion

  //#region useEffects

  useEffect(() => {
    //push to login if the user has no token
    if (!userData.user) {
      setUserData({
        token: undefined,
        user: undefined,
      });
      localStorage.setItem("auth-Token", "");
      history.push("/");
    }
  }, [history, setUserData, userData.user]);

  useEffect(() => {
    //init the new messaga
    socket.on("newArrivalMessageToClient", (data) => {
      setNewArrivalMessage({
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  useEffect(() => {
    //add the new message to the array of all the messages
    const membersId = currentChat?.members.map((m)=> m._id);
    if (
      newArrivalMessage &&
      membersId?.includes(newArrivalMessage.senderId) 
    ) {
      const receiverMembers = currentChat?.members.filter((m) => {
        return m._id !== newArrivalMessage.senderId;
      });
      if (receiverMembers?.map((m) => m._id === newArrivalMessage.receiverId)) {
        newArrivalMessage &&
          setMessages((prev) => [...prev, newArrivalMessage]);
        setNewArrivalMessage(null);
      }
    }
  }, [newArrivalMessage, currentChat]);

  useEffect(() => {
    //get all the messages of the current chat
    const getMessages = async () => {
      try {
        const result = await Axios.get(
          `${process.env.REACT_APP_SERVER_URL}messages/${currentChat?._id}`
        );
        setMessages(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  //#endregion

  return (
    <>
      <CurrentChatContext.Provider value={{ currentChat, setCurrentChat }}>
        <div className="chat-continer">
          <nav className="chat-nav">
            <NavBar />
          </nav>

          {currentChat ? (
            <>
              <header className="chat-header">
                <Header />
              </header>

              <section className="chat-group">
                <Messages messages={messages} user={userData.user} />

                <InputMessage messages={messages} setMessages={setMessages} />
              </section>
            </>
          ) : (
            <section className="chat-group">
              <div className="no-chat">No chat selected</div>
            </section>
          )}
        </div>
      </CurrentChatContext.Provider>
    </>
  );
};

export default Chat;
