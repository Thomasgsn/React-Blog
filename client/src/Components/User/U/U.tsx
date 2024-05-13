import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconArrowRight,
  IconEdit,
  IconColorFilter,
  IconInfoSquareRounded,
  IconUser,
  IconUserEdit,
  IconLogout,
} from "@tabler/icons-react";

import Cookies from "js-cookie";

import Axios from "axios";

import Top from "./Top/Top";

import Sidebar from "../../assets/Sidebar/Sidebar";

import "./U.css";

const U = ({ userInfo }) => {
  const { id } = useParams();
  const navigateTo = useNavigate();

  if (isNaN(id)) {
    if (userInfo) {
      navigateTo("/u/" + userInfo.id);
    } else navigateTo("/login");
  }

  const [userVisit, setUserVisit] = useState();

  useEffect(() => {
    fetch(`http://localhost:8081/u/${id}`)
      .then((response) => response.json())
      .then((userVisit) => {
        setUserVisit(userVisit[0]);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [id]);

  const [displayEdit, setDisplayEdit] = useState(false);

  const [newUsername, setNewUsername] = useState(
    userInfo ? userInfo.username : ""
  );
  const [newDetail, setNewDetail] = useState(userInfo ? userInfo.detail : "");
  const [newColor, setNewColor] = useState(userInfo ? userInfo.color : "");

  const editUser = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    Axios.post("http://localhost:8081/editu", {
      Username: newUsername,
      Detail: newDetail,
      Color: newColor,
      Id: userInfo ? userInfo?.id : "",
    })
      .then(() => {
        navigateTo("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logout = () => {
    Cookies.remove("connectId", { path: "/", domain: "localhost" });
    navigateTo("/login");
  };

  return (
    <div className="homePage flex">
      <div className="container">
        <Sidebar {...{ userInfo }} />
        <div className="userContent">
          {userVisit != null ? (
            <>
              <Top {...{ userInfo, userVisit, id }} />
            </>
          ) : (
            <></>
          )}
          <div className="bottom flex">
            {userInfo && userVisit?.id == userInfo.id ? (
              <button
                className="btn edit"
                onClick={() => setDisplayEdit(!displayEdit)}
              >
                <IconEdit className="icon" />
              </button>
            ) : (
              <></>
            )}
            <div className="userSeeInfo flex">
              {userVisit != null ? (
                <div className="seeInfo">
                  {displayEdit ? (
                    <div className="actualEdit">
                      <div>
                        <div className="flex" style={{ gap: "1rem" }}>
                          <IconUserEdit
                            className="icn"
                            style={{ color: newColor }}
                          />
                          <p className="username">
                            {newUsername ? newUsername : userInfo.username}
                          </p>
                        </div>
                        <p className="detail">{newDetail}</p>
                      </div>
                      {userInfo && displayEdit === true ? (
                        <div className="editUser">
                          <form action="" className="form grid">
                            <div className="inputDiv">
                              <label htmlFor="username">Username</label>
                              <div className="input flex">
                                <IconUser className="iconUser" />
                                <input
                                  type="text"
                                  id="username"
                                  defaultValue={userInfo.username}
                                  autoComplete={userInfo.username}
                                  placeholder={userInfo.username}
                                  onChange={(event) => {
                                    setNewUsername(event.target.value);
                                  }}
                                />
                              </div>

                              <label htmlFor="Detail">Detail</label>
                              <div className="input flex">
                                <IconInfoSquareRounded className="iconUser" />
                                <textarea
                                  id="Detail"
                                  defaultValue={userInfo.detail}
                                  autoComplete={userInfo.detail}
                                  placeholder={userInfo.detail}
                                  onChange={(event) => {
                                    setNewDetail(event.target.value);
                                  }}
                                />
                              </div>

                              <div className="inputDiv">
                                <label htmlFor="password">Color</label>
                                <div className="input flex">
                                  <IconColorFilter className="iconUser" />
                                  <input
                                    type="color"
                                    id="color"
                                    defaultValue={userInfo.color}
                                    onChange={(event) => {
                                      setNewColor(event.target.value);
                                    }}
                                  />
                                </div>

                                <button
                                  type="submit"
                                  className="btn flex"
                                  onClick={editUser}
                                >
                                  <span>Update Account</span>
                                  <IconArrowRight className="icon" />
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <>
                      <IconUser
                        className="icn"
                        style={{
                          color: userVisit.color,
                          marginBottom: "1rem",
                        }}
                      />
                      <h3>Username</h3>
                      <p className="info">{userVisit?.username}</p>
                      <h3>Detail</h3>
                      <p className="info">{userVisit?.detail}</p>
                      <h3>Role</h3>
                      <p className="info">{userVisit?.role}</p>
                    </>
                  )}
                </div>
              ) : (
                <>user not found</>
              )}
              {displayEdit ? (
                <></>
              ) : (
                <button className="btn flex" onClick={logout}>
                  <span>Logout</span>
                  <IconLogout className="icon" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default U;
