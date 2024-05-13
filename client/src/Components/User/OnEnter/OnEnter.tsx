import { Link } from "react-router-dom";

import { IconUserPlus, IconUser } from "@tabler/icons-react";

import "../User.css";
import logo from "../../assets/media/logo.png";

const OnEnter = () => {
  return (
    <div className="onEnterPage flex">
      <div className="container flex">
        <div className="videoDiv">
          <div className="textDiv">
            <h2 className="title">Find the best production for your needs</h2>
            <p>Free & low price prods !</p>
          </div>

          <div className="footerDiv flex">
            <span className="text">
              You need to be logged for enter in the shop.
            </span>
            <Link to="/login">
              <button className="btn">Login</button>
            </Link>
          </div>
        </div>

        <div className="enterDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="Logo" />
            <h3>Welcome Back !</h3>
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
