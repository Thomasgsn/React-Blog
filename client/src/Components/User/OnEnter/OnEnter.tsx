import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconUserPlus, IconUser } from "@tabler/icons-react";

import axios from "axios";

import "../User.css";

const OnEnter = () => {
  const navigateTo = useNavigate();
  
  useEffect(() => {
    axios.get("http://localhost:8081/user").then((res) => {
      if (res.data.valid === true) {
        navigateTo("/home");
      } else {
        navigateTo("/login");
      }
    });
  }, [navigateTo]);

  return (
    <div className="onEnterPage flex">
      <div className="container flex">
        <div className="infoDiv">
          <div className="headerDiv">
            <img src="media/logo.png" alt="Logo" />
            <h3>Welcome !</h3>
          </div>
          <div className="textDiv">
            <h2 className="title">Explore a new world !</h2>
            <p>Free blog.</p>
          </div>
          <div className="footerDiv flex">
            <span className="text">
              You need to be logged for enter in the Blog Universe.
            </span>
            <Link to="/login">
              <button className="btn">Login</button>
            </Link>
          </div>
          <div className="inputDiv">
            <div>
              <span>Already have an acount ?</span>
              <Link to="/login" className="link flex">
                <p>Login</p>
                <IconUser className="icon" />
              </Link>
            </div>
            <div>
              <span>Don't have an account ?</span>
              <Link to="/register" className="link flex">
                <p>Register</p>
                <IconUserPlus className="icon" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnEnter;
