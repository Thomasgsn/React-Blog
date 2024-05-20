import {
  IconArrowRight,
  IconEdit,
  IconInfoSquareRounded,
  IconUser,
  IconLogout,
  IconUserPlus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserInfo, UserVisit } from "../../../utils/type";

import axios from "axios";
import Cookies from "js-cookie";
import Topbar from "../../assets/Topbar/Topbar/Topbar";

import "./U.css";

const U = ({ userInfo }: { userInfo: UserInfo }) => {
  const id = Number(useParams().id);
  const navigateTo = useNavigate();

  if (isNaN(id)) {
    if (userInfo) {
      navigateTo("/u/" + userInfo.id);
    } else navigateTo("/login");
  }

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

  const [displayEdit, setDisplayEdit] = useState<boolean>(false);

  const [newUsername, setNewUsername] = useState<string>(
    userInfo ? userInfo.username : ""
  );
  const [newDetail, setNewDetail] = useState(userInfo ? userInfo.detail : "");

  const editUser = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    axios.post("http://localhost:8081/editu", {
      Username: newUsername,
      Detail: newDetail,
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

  const follow = async (e: number) => {
    console.log(e)
    try {
      await axios.post(`http://localhost:8081/follow/${userInfo.id}/${e}`);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <Topbar {...{ userInfo }} />
      <div className="mainContent">
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
                    <h3>Username</h3>
                    <p className="info">{userVisit.username}</p>
                    <h3>Detail</h3>
                    <p className="info">{userVisit.detail}</p>
                    <h3>Role</h3>
                    <p className="info">{userVisit.role}</p>
                  </>
                )}
              </div>
            ) : (
              <>user not found</>
            )}
            {displayEdit ? (
              <></>
            ) : userVisit.id == userInfo.id ? (
              <button className="btn flex" onClick={logout}>
                <span>Logout</span>
                <IconLogout className="icon" />
              </button>
            ) : (
              <button className="btn flex" onClick={() => follow(userVisit.id)}>
                <span>Follow {userVisit.username}</span>
                <IconUserPlus className="icon" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default U;
