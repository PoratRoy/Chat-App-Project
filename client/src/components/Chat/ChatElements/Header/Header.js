import React from "react";
import "./Header.css";

const Header = ({ currentChat, setCurrentChat }) => {
  const exsitGroup = () => {
    setCurrentChat(null);
  };

  return (
    <>
      <div className="header-continer">
        {currentChat ? (
          <div>
            <div className="header-title">
              Chat with {currentChat?.members[1].name}
            </div>
            <button className="header-exist" onClick={exsitGroup}>
              X
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Header;
