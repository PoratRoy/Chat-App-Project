import React, { useState, useContext, useEffect, useRef } from "react";
import Axios from "axios";
import NavBar from "./ChatElements/NavBar/NavBar";
import Header from "./ChatElements/Header/Header";
import Messages from "./ChatElements/Messages/Messages";
import Input from "./ChatElements/Input/Input";
import UserContext from "../../context/UserContext";
import { SocketContext } from "../../context/SocketContext";
import { useHistory } from "react-router-dom";
import "./Chat.css";

const Chat = () => {
  //#region Instances
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [message, setMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);

  const { userData,setUserData } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const history = useHistory();
  const scrollRef = useRef();
  //#endregion

  //#region useEffects

  //socket connection & get new messages
  useEffect(() => {
    
    if(!userData.user){
      setUserData({
        token: undefined,
        user: undefined,
      });
      localStorage.setItem("auth-Token", "");
      history.push("/");
    }

    socket.on("messageFromServer", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  //alert about socket new user & get all socket users
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const result = await Axios.get(
          `https://localhost:5000/chat/api/private/all`,{headers: {Authorization: localStorage.getItem('auth-Token')}} 
        );
        setUsers(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllUsers();

    const getAllUserGroups = async () => {
      try {
        const result = await Axios.get(
          `https://localhost:5000/chat/api/groups/${userData.user._id}`
        );
        setGroups(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllUserGroups();

    socket.on('updateGroups', () => { getAllUserGroups() })

    socket.on("getNewAddedUser", (userId) => { userId && addNewUser(userId) });

    const addNewUser = async (userId) => {
      const result = await Axios.get(
        `https://localhost:5000/chat/api/private/${userId}`,{headers: {Authorization: localStorage.getItem('auth-Token')}} 
      );
      setUsers((prev) => [...prev, result.data]);
    };
  }, [userData.user, socket]);

  //include the new message in the group messages
  useEffect(() => {
    const getSender = async () => {
      const result = await Axios.get(
        `https://localhost:5000/chat/api/private/${arrivalMessage.sender}`,{headers: {Authorization: localStorage.getItem('auth-Token')}} 
      );
      return result.data;
    };

    arrivalMessage &&
      getSender().then((res) => {
        if (currentChat?.members.map((m) => m._id === res._id)) {
          arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
        }
      });
  }, [arrivalMessage, currentChat]);

  //get all user messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const result = await Axios.get(
          `https://localhost:5000/chat/api/messages/${currentChat?._id}`
        );
        setMessages(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  //scroll down
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  //#endregion

  //#region Methodes
  const sendMessage = async (event) => {
    event.preventDefault();

    if (!currentChat) return;

    const newMessage = {
      sender: userData.user._id,
      groupId: currentChat._id,
      text: message,
    };

    const receiverId = currentChat.members.find(
      (member) => member._id !== userData.user._id
    );
    socket.emit("newMessageFromClient", {
      senderId: userData.user._id,
      receiver: receiverId,
      text: message,
    });

    try {
      const result = await Axios.post(
        "https://localhost:5000/chat/api/messages",
        newMessage
      );
      setMessages([...messages, result.data]);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const addNewGroup = async (id) => {
    const newGroup = {
      senderId: userData.user._id,
      receiverId: id,
      createdAt: Date.now(),
    };

    try {
      const result = await Axios.post(
        "https://localhost:5000/chat/api/groups",
        newGroup
      );
      setCurrentChat(result.data);

      const res = await Axios.get(
        `https://localhost:5000/chat/api/groups/${userData.user._id}`
      );
      setGroups(res.data);
      socket.emit('addNewGroup',id)

    } catch (err) {
      console.log(err);
    }
  };

    //search
    const handleSearch = async (e) => {
      const value = e.target.value.toLocaleLowerCase();
      if(!value || value === ''){
        try {
          const result = await Axios.get(
            `https://localhost:5000/chat/api/private/all`,{headers: {Authorization: localStorage.getItem('auth-Token')}} 
          );
          setUsers(result.data);
        } catch (err) {
          console.log(err);
        }
      }else{
        const filteredUsers = users.filter(u => u.name.toLowerCase().includes(value));
        setUsers(filteredUsers.filter(u => userData.user?._id !== u._id));
      }
    };
  //#endregion

  return (
    <>
        <div className="chat-continer">
          <nav className="chat-nav">
            <NavBar
              setCurrentChat={setCurrentChat}
              addNewGroup={addNewGroup}
              handleSearch={handleSearch}
              users={users}
              groups={groups}
            />
          </nav>

          {currentChat ? (

            <div className="chat">
              <header className="chat-header">
                <Header
                  currentChat={currentChat}
                  setCurrentChat={setCurrentChat}
                />
              </header>

              <section className="chat-group">
                <div className="chat-items">
                  <Messages
                    messages={messages}
                    user={userData.user}
                    scrollRef={scrollRef}
                  />

                  <Input
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                  />
                </div>
              </section>
            </div>
          ) : (
            <div className="chat">
              <section className="chat-group">
                <div className="chat-items">
                  <div className="no-chat">No chat selected</div>
                </div>
              </section>
            </div>
          )}
        </div>
    </>
  );
};

export default Chat;

//  const CONNECTION_PORT = "localhost:5000/";
// const socket = useRef()
//    socket.current = io(CONNECTION_PORT);
//-----------------

//const [userName, setUserName] = useState("");

// const [group, setGroup] = useState("");

// const { groupData } = useContext(GroupContext);

// useEffect(() => {
//   socket = io(CONNECTION_PORT);

//   const { groupNameData, userNameData } = groupData;

//   setGroup(groupNameData);
//   setUserName(userNameData);

//   if (group !== "" || userName !== "") {
//     socket.emit("join", { userName: userName, group }, (error) => {
//       if (error) {
//         alert(`${userName}, cannot access group ${group}`);
//       }
//     });

//     socket.on("alert", (message) => {
//       setMessages((messages) => [...messages, message]);
//     });
//   }
// }, [groupData, userName, group]);

// useEffect(() => {
//   //the problem is in the render

//   socket.on("message", (message) => {
//     console.log("enter");
//     setMessages((messages) => [...messages, message]);
//   });
// }, [message]);

// const sendMsg = { message: message, userName: userName, group: group };

// const sendMessage = async (event) => {
//   event.preventDefault();
//     //socket.emit("sendMessage", sendMsg, () => setMessage(""));

// };
