import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import { SocketContext } from "../../../context/SocketContext";
import UseContext from "../../../context/UserContext";
import "./Login.css";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUserData } = useContext(UseContext);
  const {socket} = useContext(SocketContext);

  const history = useHistory();
  const handelSubmit = async (event) => {
    event.preventDefault();
    
    const config = {
      header: {
        'Content-Type':'appliction/json'
      }
    }

  try {
      const loginUser = await Axios.post(
        `${process.env.REACT_APP_SERVER_URL}auth/login`,
        { userName, password }, config
      );

      setUserData({
        token: loginUser.data.token,
        user: loginUser.data.user,
      });
      localStorage.setItem("auth-Token", loginUser.data.token);

      socket.emit("addUserToArray", loginUser.data.user._id);

      history.push("/chat");

    } catch (err) {
      setError(err.response.data.error);
      setUserName('');
      setPassword('');
      setTimeout(()=> {
        setError('');
      }, 7500)
    }
  };

  return (
    <form onSubmit={handelSubmit}>
      <div className="login-continer">
        <div className="login-items">
          <h1 className="title">Login</h1>

          {error && <span className="error">{error}</span>}

          <input
            className="text login-group-input"
            placeholder="Enter User Name.."
            type="text"
            value={userName}
            onChange={(event) => {
              setUserName(event.target.value);
            }}
          />

          <input
            className="text login-group-input"
            placeholder="Enter Password.."
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />

          <input className="btn login-btn" type="submit" value="Login" />

          <Link className="link" to="/register">Don't have an account?</Link>
        </div>
      </div>
    </form>
  );
};

export default Login;
