import React from "react";
import {Line} from '../../../UIKit'
import "./Header.css";

const Header = ({ currentChat, setCurrentChat }) => {
  const exsitGroup = () => {
    setCurrentChat(null);
  };

  return (
    <>
      <div className="header-continer">
        <Line justify="center">
          {currentChat ? (
            <>
              <div className="header-title">
                Chat with {currentChat?.members[1].name}
              </div>
              <button className="header-exist" onClick={exsitGroup}>
                X
              </button>
            </>
          ) : null}
        </Line>
      </div>
    </>
  );
};

export default Header;
