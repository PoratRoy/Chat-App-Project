import React, { useContext } from "react";
import UserContext from "../../../../context/UserContext";
import HasErrorContext from "../../../../context/HasErrorContext";
import Axios from "axios";
import "./Search.css";

const Search = ({users, setUsers}) => {

  const { setHasError } = useContext(HasErrorContext);
  const { userData } = useContext(UserContext);


  const handleSearch = async (e) => {
    const value = e.target.value.toLocaleLowerCase();
    if (!value || value === "") {
      try {
        const result = await Axios.get(
          `${process.env.REACT_APP_SERVER_URL}private/all`,
          { headers: { Authorization: localStorage.getItem("auth-Token") } }
        );
        setUsers(result.data);
      } catch (error) {
        setHasError(error);
      }
    } else {
      const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(value)
      );
      setUsers(filteredUsers.filter((u) => userData.user?._id !== u._id));
    }
  };

  return (
    <div className="search">
      <input className="txt" placeholder="Search" onChange={handleSearch} />
      <i className="fas fa-search search-icon"></i>
    </div>
  );
};

export default Search;
