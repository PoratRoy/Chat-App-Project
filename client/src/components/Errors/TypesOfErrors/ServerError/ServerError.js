import React from "react";
import { Link } from "react-router-dom";
import "./ServerError.css";

const ServerError = () => {
  return (
    <>
      <h2>oops.. Internal Server Error</h2>
      <Link to="/">Return to login</Link>
    </>
  );
};

export default ServerError;
