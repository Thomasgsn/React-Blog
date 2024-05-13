import { IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "../../../utils/type";

import "./Top.css";

const Top = ({ userInfo }: { userInfo: UserInfo }) => {
  const navigateTo = useNavigate();

  return (
    <div className="topSection">
      <div className="headerSection flex">
        <div className="title">
          <h1>As a french producer, I want share my french inspiration</h1>
          <p>
            hey{" "}
            <span className="welcomeUser">
              {userInfo ? userInfo.username : <></>}
            </span>
            , did you know any new artists through me ?
          </p>
        </div>
        <div className="adminDiv flex">
          <a
            onClick={() => {
              userInfo ? navigateTo(`/u/${userInfo.id}`) : navigateTo("/login");
            }}
          >
            <IconUser className="icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Top;
