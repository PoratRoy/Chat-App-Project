import React from "react";
import { Link } from "react-router-dom";
import "./NotAuthorized.css";

const NotAuthorized = () => {
  return (
    <>
      <h2>You are not authorized to enter this page!</h2>
      <Link to="/">Return to login</Link>
    </>
  );
};

export default NotAuthorized;