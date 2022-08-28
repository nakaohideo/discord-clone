import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // { Link, Redirect }
import axios from "axios";

import { getBasicData } from "../js/_getBasicData";

import "./_login.sass";

const startPoint =
  window.location.href.toString().includes("localhost") ||
  window.location.href.toString().includes("127.0.0.1")
    ? ""
    : "/discord-clone-react"; //packageJson.homepage;

const server = ""; // "http://127.0.0.1:5000";

const sendLoginData = (e, user, pswrd, history) => {
  e.preventDefault();
  let data = {
    username: user,
    password: pswrd,
  };

  const config = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  };

  axios
    .post(`${server}/api/users/login`, data, config)
    .then((res) => {
      if (res.data.data === "done") {
        history.push(`${startPoint}/chat`); // /?id=${res.data.data}
      } else {
        alert("Try again...");
      }
    })
    .catch((err) => console.error("error...", err));
};

const Login = () => {
  document.title = "login section";

  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const history = useHistory();

  const queryParams = new URLSearchParams(window.location.search);
  // console.log(queryParams.get('status')===null);
  useEffect(() => {
    if (queryParams.get("status") === "done") {
      // successfully registered
      alert("registration is done...");
    }

    getBasicData(history);
  }, []);

  return (
    <div className="login">
      <h2 className="title">Login</h2>
      <h2 className="username">UserName:</h2>
      <h2 className="password">Password:</h2>

      <input
        type="text"
        className="e-name"
        rows="1"
        cols="20"
        onChange={(event) => setUserName(event.target.value)}
      />
      <input
        type="password"
        className="e-pass"
        rows="1"
        cols="20"
        onChange={(event) => setPassword(event.target.value)}
      />

      <form
        onSubmit={(event) => sendLoginData(event, userName, password, history)}
      >
        <button type="submit" className="go-button">
          GO
        </button>
      </form>

      <a href="/signup" className="sign-up-button">
        Sign up
      </a>
    </div>
  );
};

export default Login;
