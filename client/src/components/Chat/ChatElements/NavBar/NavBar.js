import React, { useContext } from "react";
import { Link } from "react-router-dom";
import GroupLink from "./GroupLink/GroupLink";
import UserContext from "../../../../context/UserContext";
import { Row, Search } from "../../../UIKit";
import "./NavBar.css";

const NavBar = ({
  setCurrentChat,
  addNewGroup,
  handleSearch,
  users,
  groups,
}) => {
  const { userData, setUserData } = useContext(UserContext);

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

// {groups.map((g) => (
//   <li
//     key={g._id}
//     onClick={() => setCurrentChat(g)}
//     className="navbar-group-link"
//   >
//     <GroupLink group={g} />
//   </li>
// ))}

// {users.map((u) => (
//   <li
//     key={u._id}
//     className="navbar-group-link"
//   >
//     <GroupLink user={u} />
//   </li>
// ))}

// //get all users group
// useEffect(() => {
//   const getGroups = async () => {
//     try {
//       const result = await Axios.get(
//         `http://localhost:5000/chat/api/groups/${userData.user._id}`
//       );
//       setGroup(result.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   getGroups();

// }, [userData.user._id]);
