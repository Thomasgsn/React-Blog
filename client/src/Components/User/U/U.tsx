import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogImage, BlogInfo, UserInfo, UserVisit } from "../../../utils/type";

import axios from "axios";
import Cookies from "js-cookie";
import Info from "../../assets/Info/Info";
import HomeTopbar from "../../assets/Topbar/HomeTopbar/HomeTopbar";

import "./U.css";
import SelectedBlogs from "../../assets/SelectedBlogs/SelectedBlogs";

interface Follows {
  idFollower: number;
  idFollowed: number;
}

const U = ({ userInfo }: { userInfo: UserInfo }) => {
  const id = Number(useParams().id);
  const navigateTo = useNavigate();

  const [userVisit, setUserVisit] = useState<UserVisit>({
    id: 0,
    firstname: "",
    lastname: "",
    username: "",
    avatar: "",
    detail: "",
    email: "",
    role: "",
  });
  const [nbBlog, setNbBlog] = useState<number>(0);
  useEffect(() => {
    fetch(`http://localhost:8081/u/${id}`)
      .then((response) => response.json())
      .then((results) => {
        setUserVisit(results.userVisit);
        setNbBlog(results.nbBlogVisit);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [id]);

  const [blogs, setBlogs] = useState<BlogInfo[]>([]);
  const [imagesBlogs, setImagesBlogs] = useState<BlogImage[]>([]);
  const [sortBy, setSortBy] = useState<string>("date");
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    fetch(
      `http://localhost:8081/reqblog/${userVisit.id}?search=${search}&sortBy=${sortBy}`
    )
      .then((response) => response.json())
      .then((res) => {
        setBlogs(res.blogs);
        setImagesBlogs(res.blogsImages);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [search, sortBy, userVisit.id]);

  if (isNaN(id)) {
    if (userInfo) {
      navigateTo("/u/" + userInfo.id);
    } else navigateTo("/login");
  }

  const [follows, setFollows] = useState<Follows[]>([]);
  const [iFollow, setIFollow] = useState<number>(0);
  const [followers, setFollowers] = useState<number>(0);
  useEffect(() => {
    fetch(`http://localhost:8081/reqfollow/${userVisit.id}`)
      .then((response) => response.json())
      .then((res) => {
        setFollows(res.follow);
        setIFollow(res.IF);
        setFollowers(res.FM);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [userVisit.id]);

  const [displayEdit, setDisplayEdit] = useState<boolean>(false);

  const [newUser, setNewUser] = useState<UserVisit>({
    id: 0,
    firstname: "",
    lastname: "",
    username: "",
    avatar: "",
    detail: "",
    email: "",
    role: "",
  });
  useEffect(() => {
    setNewUser(userInfo);
  }, [userInfo]);

  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));

    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("Invalid email address");
      } else {
        setEmailError(null);
      }
    }
  };
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
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

    if (newUser.username != userInfo.username) {
      const confirmEdit = window.confirm("Will changing your username log you out, are you sure?");
      if (!confirmEdit) {
        return;
      }
      Cookies.remove("connectId", { path: "/", domain: "localhost" });
      navigateTo("/login");
    }

    const formData = new FormData();
    formData.append("newUser", JSON.stringify(newUser));

    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post("http://localhost:8081/updateuser", formData);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const logout = () => {
    Cookies.remove("connectId", { path: "/", domain: "localhost" });
    navigateTo("/login");
  };
  const follow = async (e: number) => {
    console.log(e);
    try {
      await axios.post(`http://localhost:8081/follow/${userInfo.id}/${e}`);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const isFollowed = () => {
    return follows.some(
      (follow) =>
        follow.idFollower === userInfo.id && follow.idFollowed === userVisit.id
    );
  };
  const text = (text: string) => {
    return text.split("\n").map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
  };

  return (
    <div className="container">
      <Info categoryName={undefined} {...{ blogs, sortBy, setSortBy }} />
      <HomeTopbar {...{ userInfo, search, setSearch }} />
      <div className="mainContent">
        <div className="bottom u">
          {userVisit != undefined ? (
            <>
              <div className=" userSeeInfo flex">
                {userVisit != null ? (
                  <div>
                    {displayEdit ? (
                      <div className="seeInfo">
                        <form className="flex top" onSubmit={handleSubmit}>
                          <div className="avatar flex">
                            <img
                              src={
                                imagePreview
                                  ? imagePreview
                                  : `/avatars/${userInfo.avatar}`
                              }
                              alt="Preview"
                              style={{ maxWidth: "100px" }}
                            />
                          </div>
                          <input
                            type="file"
                            name="file"
                            className="file"
                            onChange={handleFileChange}
                          />
                          <div className="flex userInfo">
                            <div className="flex">
                              <input
                                type="text"
                                maxLength={23}
                                name="username"
                                onChange={handleChange}
                                placeholder={newUser.username}
                                defaultValue={newUser.username}
                              />
                              <div className="btns flex">
                                <button type="submit" className="btn edit">
                                  Update profil
                                </button>
                                <button
                                  onClick={() => setDisplayEdit(!displayEdit)}
                                  className="btn edit"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                        <div className="detail">
                          <div className="flex">
                            <input
                              type="text"
                              name="firstname"
                              onChange={handleChange}
                              placeholder={newUser.firstname}
                              defaultValue={newUser.firstname}
                            />
                            <input
                              type="text"
                              name="lastname"
                              onChange={handleChange}
                              placeholder={newUser.lastname}
                              defaultValue={newUser.lastname}
                            />
                            -
                            <input
                              type="email"
                              name="email"
                              onChange={handleChange}
                              placeholder={newUser.email}
                              defaultValue={newUser.email}
                            />
                          </div>
                          <textarea
                            type="text"
                            name="detail"
                            onChange={handleChange}
                            placeholder={newUser.detail}
                            defaultValue={newUser.detail}
                            style={{ width: "80%", height: "10rem" }}
                          ></textarea>
                        </div>
                      </div>
                    ) : (
                      <div className="seeInfo">
                        <div className="flex top">
                          <div className="avatar flex">
                            <img
                              src={`/avatars/${userVisit.avatar}`}
                              alt={`${userVisit.username} avatar`}
                            />
                          </div>
                          <div className="flex userInfo">
                            <div>
                              <div className="flex">
                                <h3>{userVisit.username}</h3>
                                <div className="btns flex">
                                  {userVisit?.id == userInfo.id ? (
                                    <>
                                      <button
                                        className="btn edit"
                                        onClick={() =>
                                          setDisplayEdit(!displayEdit)
                                        }
                                      >
                                        Edit profil
                                      </button>
                                      <button
                                        className="btn edit"
                                        onClick={logout}
                                      >
                                        Logout
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        className="btn edit"
                                        onClick={() => follow(userVisit.id)}
                                        style={{
                                          background: isFollowed()
                                            ? "var(--primarySecondColor)"
                                            : "auto",
                                        }}
                                      >
                                        {isFollowed() ? (
                                          <span>Unfollow</span>
                                        ) : (
                                          <span>Follow</span>
                                        )}
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex nbFollow">
                                <p>
                                  <b>{nbBlog}</b> blogs
                                </p>
                                <a href="/followers">
                                  <b>{followers}</b> followers
                                </a>
                                <a href="/followers">
                                  <b>{iFollow}</b> following
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="detail">
                          <div className="flex">
                            <p className="name">{userVisit.firstname}</p>
                            <p className="name">{userVisit.lastname}</p>-
                            <p>{userVisit.email}</p>
                          </div>
                          {userVisit.detail && <p>{text(userVisit.detail)}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>user not found</>
                )}
              </div>
              <div className="userSeeBlog flex">
                <SelectedBlogs {...{ userInfo, blogs, imagesBlogs }} />
              </div>
            </>
          ) : (
            <>user not found</>
          )}
        </div>
      </div>
    </div>
  );
};

export default U;
