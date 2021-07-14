import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import GroupLink from "./GroupLink/GroupLink";
import UserContext from "../../../../context/UserContext";
import { SocketContext } from "../../../../context/SocketContext";
import { Row, Search } from "../../../UIKit";
import "./NavBar.css";

const NavBar = ({
  setCurrentChat
}) => {

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const { socket } = useContext(SocketContext);
  const { userData, setUserData } = useContext(UserContext);

  
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const result = await Axios.get(
          `${process.env.REACT_APP_SERVER_URL}private/all`,
          { headers: { Authorization: localStorage.getItem("auth-Token") } }
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
          `${process.env.REACT_APP_SERVER_URL}groups/${userData.user._id}`
        );
        setGroups(result.data);
      } catch (err) {
        console.log(err);
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
      const result = await Axios.get(
        `${process.env.REACT_APP_SERVER_URL}private/${userId}`,
        { headers: { Authorization: localStorage.getItem("auth-Token") } }
      );
      setUsers((prev) => [...prev, result.data]);
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
    } catch (err) {
      console.log(err);
    }
  };


  const handleSearch = async (e) => {
    const value = e.target.value.toLocaleLowerCase();
    if (!value || value === "") {
      try {
        const result = await Axios.get(
          `${process.env.REACT_APP_SERVER_URL}private/all`,
          { headers: { Authorization: localStorage.getItem("auth-Token") } }
        );
        setUsers(result.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(value)
      );
      setUsers(filteredUsers.filter((u) => userData.user?._id !== u._id));
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

  const handleLogout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-Token", "");
  };

  return (
    <>
      <div className="navbar-continer">
        <Row>
          <header className="navbar-header">
            <div className="title">CHATROOM</div>
            <div className="navbar-title-s">Created by Roy Porat</div>
          </header>

          <Search handleSearch={handleSearch}/>

          <ul className="navbar-groups">{linkGroups}</ul>

          <Link to="/" className="link navbar-logout-link" onClick={handleLogout}>
            Log out
            <i className="navbar-logout-icon fas fa-sign-out-alt"></i>
          </Link>
        </Row>
      </div>
    </>
  );
};

export default NavBar;

