import {
  IconArrowRight,
  IconLock,
  IconUser,
  IconMail,
  IconPhoto,
  IconFileInfo,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../User.css";
import axios from "axios";

interface NewUser {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

const Register = () => {
  const navigateTo = useNavigate();
  const [user, setUser] = useState<NewUser>({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    axios.get("http://localhost:8081/user").then((res) => {
      if (res.data.valid === true) {
        navigateTo("/home");
      } else {
        navigateTo("/login");
      }
    });
  }, [navigateTo]);

  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));

    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("Invalid email address");
      } else {
        setEmailError(null);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[0];

      if (!selectedFile.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        event.target.value = "";
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emailError) {
      alert("Check your email address");
      return;
    }

    const formData = new FormData();
    formData.append("user", JSON.stringify(user));

    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post("http://localhost:8081/register", formData);
      navigateTo("/home");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="registerPage flex">
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
            <span className="text">Already have an account ?</span>
            <Link to="/login">
              <button className="btn">Login</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <form className="form grid" onSubmit={handleSubmit}>
            <span className="showMessage">Register</span>

            <div className="inputDiv">
              <label htmlFor="firstname">Firstname</label>
              <div className="input flex">
                <IconFileInfo className="icon" />
                <input
                  required
                  type="text"
                  name="firstname"
                  onChange={handleChange}
                  placeholder="Enter Firstname"
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="lastname">Lastname</label>
              <div className="input flex">
                <IconFileInfo className="icon" />
                <input
                  required
                  type="text"
                  name="lastname"
                  onChange={handleChange}
                  placeholder="Enter Lastname"
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex">
                <IconUser className="icon" />
                <input
                  required
                  type="text"
                  name="username"
                  autoComplete="username"
                  onChange={handleChange}
                  placeholder="Enter Usernamer"
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="Mail">Mail</label>
              <div className="input flex">
                <IconMail className="icon" />
                <input
                  required
                  type="text"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  placeholder="Enter Mail"
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex">
                <IconLock className="icon" />
                <input
                  required
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>

              <div className="inputDiv">
                <label htmlFor="avatar">Avatar</label>
                <div className="input flex">
                  <IconPhoto className="icon" />
                  <input
                    required
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: "100px" }}
                    />
                  )}
                </div>

                <button type="submit" className="btn flex">
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
