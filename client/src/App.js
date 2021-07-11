import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import UserContext from "./context/UserContext";
import { SocketContext, socket } from "./context/SocketContext";
import Axios from "axios";
import PrivateRoute from "./components/routing/PrivateRouting";

import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import Chat from "./components/Chat/Chat";

const App = () => {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {

    let token = localStorage.getItem("auth-Token");
    if (!token) {
      localStorage.setItem("auto-Token", "");
      token = "";
    }

    const fetchPrivateData = async () => {
      try {
        const resToken = await Axios.post(
          "https://localhost:5000/chat/api/auth/tokenIsValid",
          null,
          { headers: {"x-auth-Token": token} }
          );
          
        if (resToken.data) {
          setUserData({
            token,
            user: resToken.data,
          });
        }
      } catch (error) {
        localStorage.removeItem("auto-Token");
      }
    };
    fetchPrivateData();
  }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ userData, setUserData }}>
        <SocketContext.Provider value={{ socket }}>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute path="/chat" component={Chat} />
          </Switch>
        </SocketContext.Provider>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

export default App;

