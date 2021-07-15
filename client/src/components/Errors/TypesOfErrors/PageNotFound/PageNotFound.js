import React from "react";
import { Link } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
  return (
    <>
      <h2>404 Page Not Found</h2>
      <Link to="/">Return to login</Link>
    </>
  );
};

export default PageNotFound;
