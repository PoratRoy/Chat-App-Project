import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import UseContext from "../../../context/UserContext";
import { SocketContext } from "../../../context/SocketContext";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUserData } = useContext(UseContext);
  const {socket} = useContext(SocketContext);

  const history = useHistory();


  const handelSubmit = async (event) => {
    event.preventDefault();

    console.log('enter');
    const config = {
      header: {
        'Content-Type':'appliction/json'
      }
    }

    try {
      const newUser = { name, userName, password };
      await Axios.post(
        "https://localhost:5000/chat/api/auth/register",
        newUser, config
        );
        
        const loginUser = await Axios.post(
          "https://localhost:5000/chat/api/auth/login",
          {
            userName,
            password,
          }, config
          );

          setUserData({
            token: loginUser.data.token,
            user: loginUser.data.user,
          });
      localStorage.setItem("auth-Token", loginUser.data.token);

      socket.emit("addNewUser", loginUser.data.user._id);

      history.push("/chat");

    } catch (err) {
      setError(err.response.data.error);
      setName('');
      setUserName('');
      setPassword('');
      setTimeout(()=> {
        setError('');
      }, 7500)
    }
  };

  return (
    <form onSubmit={handelSubmit}>
      <div className="register-continer">
        <div className="register-items">
          <h1 className="title">Register</h1>

          {error && <span className="error">{error}</span>}

          <input
            className="text register-input"
            placeholder="Enter Your Name.."
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="text register-input"
            placeholder="Enter Your User Name.."
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <input
            className="text register-input"
            placeholder="Enter Your Password.."
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input className="btn register-btn" type="submit" value="Register" />

          <Link className="link" to="/">Already have an account?</Link>
        </div>
      </div>
    </form>
  );
};

export default Register;
