import React from "react";
import "./GroupLink.css";

const GroupLink = ({user}) => {

  return (
    <>
        <button className="group-link-btn">{user.name}</button>
    </>
  );
};

export default GroupLink;