import React from "react";
import "./TxtBox.css";

const TxtBox = ({ type, value, setValue, placeholder, children }) => {


  return (
    <div className="txt-box-continer">
      <input
        className="txt"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
      {children}
    </div>
  );
};

export default TxtBox;
