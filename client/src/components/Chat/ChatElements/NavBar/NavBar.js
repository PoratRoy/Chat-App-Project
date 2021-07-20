import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import GroupLink from "./GroupLink/GroupLink";
import UserContext from "../../../../context/UserContext";
import HasErrorContext from "../../../../context/HasErrorContext";
import CurrentChatContext from "../../../../context/CurrentChatContext";
import { SocketContext } from "../../../../context/SocketContext";
import LogoutBtn from './LogoutBtn/LogoutBtn';
import { Row, Search } from "../../../UIKit";
import "./NavBar.css";

const NavBar = () => {

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const { setCurrentChat } = useContext(CurrentChatContext);
  const { userData, setUserData } = useContext(UserContext);
  const { setHasError } = useContext(HasErrorContext);
  const { socket } = useContext(SocketContext);

  
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const result = await Axios.get(
          `${process.env.REACT_APP_SERVER_URL}private/all`,
          { headers: { Authorization: localStorage.getItem("auth-Token") } }
        );
        setUsers(result.data);
      } catch (error) {
        setHasError(error);
      }
    };
    getAllUsers();

    const getAllUserGroups = async () => {
      try {
        const result = await Axios.get(
          `${process.env.REACT_APP_SERVER_URL}groups/${userData.user._id}`
        );
        setGroups(result.data);
      } catch (error) {
        setHasError(error);
      }
    };
    getAllUserGroups();


    socket.on("updateGroups", () => {
      getAllUserGroups();
    });

    socket.on("getNewRegisterUser", (userId) => {
      userId && addNewUser(userId);
    });

    const addNewUser = async (userId) => {
      try{
        const result = await Axios.get(
          `${process.env.REACT_APP_SERVER_URL}private/${userId}`,
          { headers: { Authorization: localStorage.getItem("auth-Token") } }
        );
        setUsers((prev) => [...prev, result.data]);
      } catch(error){
        setHasError(error);
      }
    };
  }, [userData.user, socket]);


  const addNewGroup = async (id) => {
    const newGroup = {
      senderId: userData.user._id,
      receiverId: id,
      createdAt: Date.now(),
    };

    try {
      const result = await Axios.post(
        `${process.env.REACT_APP_SERVER_URL}groups`,
        newGroup
      );
      setCurrentChat(result.data);

      const res = await Axios.get(
        `${process.env.REACT_APP_SERVER_URL}groups/${userData.user._id}`
      );
      setGroups(res.data);
      socket.emit("addNewGroup", id);
    } catch (error) {
      setHasError(error);
    }
  };




//-----//


  const linkGroups = [];
  const usersAlreadyWithGroup = [];

  //loop on the users and groups and if match push the elemnt to the link groups array
  users.forEach((u) => {
    groups.forEach((g) => {
      if (userData.user._id !== u._id) {
        if (u._id === g.members[0]._id || u._id === g.members[1]._id) {
          linkGroups.push(
            <li
              key={u._id}
              className="navbar-group-link"
              onClick={() => setCurrentChat(g)}
            >
              <GroupLink user={u} />
              <span className="active-chat">Continue chat...</span>
            </li>
          );
          usersAlreadyWithGroup.push(u._id);
        }
      }
    });
  });

  const usersWithoutGroup = users.filter(
    (u) =>
      userData.user?._id !== u._id && !usersAlreadyWithGroup.includes(u._id)
  );
  usersWithoutGroup.forEach((u) => {
    linkGroups.push(
      <li
        key={u._id}
        className="navbar-group-link"
        onClick={() => addNewGroup(u._id)}
      >
        <GroupLink user={u} />
      </li>
    );
  });



  return (
    <>
      <div className="navbar-continer">
        <Row>
          <header className="navbar-header">
            <div className="title">CHATROOM</div>
            <div className="navbar-title-s">Created by Roy Porat</div>
          </header>

          <Search users={users} setUsers={setUsers}/>

          <ul className="navbar-groups">{linkGroups}</ul>

          <LogoutBtn setUserData={setUserData}/>

        </Row>
      </div>
    </>
  );
};

export default NavBar;

