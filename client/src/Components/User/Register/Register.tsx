import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";

import {
  IconArrowRight,
  IconLock,
  IconUser,
  IconMail,
} from "@tabler/icons-react";

import "../User.css";
import logo from "../../assets/media/logo.png";

const Register = () => {

  const navigateTo = useNavigate();

  const [mail, setMail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const resetFields = () => {
    setMail("");
    setUsername("");
    setPassword("");
  };

  const createUser = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    Axios.post("http://localhost:8081/register", {
      Mail: mail,
      Username: username,
      Password: password,
    }).then(() => {
      navigateTo("/login");
      resetFields;
    });
  };

  return (
    <div className="registerPage flex">
      <div className="container flex">
        <div className="videoDiv">

          <div className="textDiv">
            <h2 className="title">Find the best production for your needs</h2>
            <p>Free & low price prods !</p>
          </div>

          <div className="footerDiv flex">
            <span className="text">Already have an account ?</span>
            <Link to="/login">
              <button className="btn">Login</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="Logo" />
            <h3>Welcome !</h3>
          </div>

          <form action="" className="form grid">
            <span className="showMessage">Register</span>
            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex">
                <IconUser className="icon" />
                <input
                  type="text"
                  id="username"
                  placeholder="Enter Username"
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
              </div>

              <label htmlFor="Mail">Mail</label>
              <div className="input flex">
                <IconMail className="icon" />
                <input
                  type="text"
                  id="Mail"
                  placeholder="Enter Mail"
                  onChange={(event) => {
                    setMail(event.target.value);
                  }}
                />
              </div>

              <div className="inputDiv">
                <label htmlFor="password">Password</label>
                <div className="input flex">
                  <IconLock className="icon" />
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
                </div>

                <button type="submit" className="btn flex" onClick={createUser}>
                  <span>Register</span>
                  <IconArrowRight className="icon" />
                </button>
              </div>
            </div>
          </form>
          <span className="forgotPassword">
            Forgot your password ? <a href="">click Here</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
