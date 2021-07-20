import React, { useContext} from "react";
import UserContext from "../../../../context/UserContext";
import CurrentChatContext from "../../../../context/CurrentChatContext";
import { Line } from "../../../UIKit";
import "./Header.css";

const Header = () => {
  const { currentChat, setCurrentChat } = useContext(CurrentChatContext);
  const { userData } = useContext(UserContext);

  const otherUser = currentChat?.members.filter(
    (u) => u.name !== userData.user.name
  );

  const exsitGroup = () => {
    setCurrentChat(null);
  };

  const len = otherUser[0].name.length;
  let length = "";
  if (len <= 5) {
    length = "s";
  } else if (len > 5 && len < 20) {
    length = "m";
  } else {
    length = "l";
  }

  return (
    <>
      <div className="header-continer">
        <Line justify="center">
          {currentChat ? (
            <>
              <div className="header-title" lenght={length}>
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
