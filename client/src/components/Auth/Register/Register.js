import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import UseContext from "../../../context/UserContext";
import { SocketContext } from "../../../context/SocketContext";
import { Form, Card, TxtBox } from "../../UIKit";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUserData } = useContext(UseContext);
  const { socket } = useContext(SocketContext);

  const history = useHistory();

  const handelSubmit = async (event) => {
    event.preventDefault();

    const config = {
      header: {
        "Content-Type": "appliction/json",
      },
    };

    try {
      //try to register. if succesed login with the same new user
      const newUser = { name, userName, password };
      await Axios.post(
        `${process.env.REACT_APP_SERVER_URL}auth/register`,
        newUser,
        config
      );

      const loginUser = await Axios.post(
        `${process.env.REACT_APP_SERVER_URL}auth/login`,
        {
          userName,
          password,
        },
        config
      );

      setUserData({
        token: loginUser.data.token,
        user: loginUser.data.user,
      });
      localStorage.setItem("auth-Token", loginUser.data.token);

      //alert to everyone someone new register
      socket.emit("addNewRegisterUser", loginUser.data.user._id);

      history.push("/chat");
    } catch (err) {
      setError(err.response.data.error);
      setName("");
      setUserName("");
      setPassword("");
      setTimeout(() => {
        setError("");
      }, 7500);
    }
  };

  return (
    <Card>
      <Form
        handelSubmit={handelSubmit}
        title="Register"
        error={error}
        btn="Register"
        link="/"
        linkTxt="Already have an account?"
      >
        <section className="form-input-items">
          <TxtBox
            className="text register-input"
            placeholder="Enter Your Name.."
            value={name}
            setValue={setName}
          />

          <TxtBox
            placeholder="Enter Your User Name.."
            value={userName}
            setValue={setUserName}
          />

          <TxtBox
            placeholder="Enter Your Password.."
            type="password"
            value={password}
            setValue={setPassword}
          />
        </section>

      </Form>
    </Card>
  );
};

export default Register;
