import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconArrowRight, IconLock, IconUser } from "@tabler/icons-react";

import axios from "axios";

import "../User.css";

interface User {
  username_email: string | null;
  password: string;
}

const Login = () => {
  const navigateTo = useNavigate();
  const [user, setUser] = useState<User>({
    username_email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8081/login", user);
      navigateTo("/home");
    } catch (error) {
      alert(`Error in id or password`);
      console.error("Error:", error);
    }
  };

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
    <div className="loginPage flex">
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
            <span className="text">Doesn't have an account ?</span>
            <Link to="/register">
              <button className="btn">Register</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <form className="form grid" onSubmit={handleSubmit}>
            <span className="message">no message</span>
            <div className="inputDiv">
              <div>
                <label htmlFor="username or email">Username or Email</label>
                <div className="input flex">
                  <IconUser className="icon" />
                  <input
                    type="text"
                    name="username_email"
                    autoComplete="username"
                    placeholder="Enter Username or Email"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <div className="input flex">
                  <IconLock className="icon" />
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter password"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button type="submit" className="btn flex">
                <span>Login</span>
                <IconArrowRight className="icon" />
              </button>
            </div>
            <span className="forgotPassword">
              Forgot your password ? <a href="">click Here</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
