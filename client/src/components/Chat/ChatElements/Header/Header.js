import React, {useContext} from "react";
import UserContext from "../../../../context/UserContext";
import CurrentChatContext from "../../../../context/CurrentChatContext";
import {Line} from '../../../UIKit'
import "./Header.css";

const Header = () => {
    
  const { currentChat, setCurrentChat } = useContext(CurrentChatContext);
  const { userData } = useContext(UserContext);

  const otherUser = currentChat?.members.filter(u => u.name !== userData.user.name);

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
                Chat with {otherUser[0].name}
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
