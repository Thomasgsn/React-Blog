import { UserInfo } from "../../../utils/type";
import { IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

import StatsProd from "../../assets/StatsProds/StatsProd";

import "./Top.css";

const Top = ({ userInfo }: { userInfo: UserInfo }) => {
  const navigateTo = useNavigate();

  return (
    <div className="topSection">
      <div className="headerSection flex">
        <div className="title">
          <h1>
            I'm <i>_oftyn</i>, beatmker and producer.
          </h1>
          <p>
            Hello{" "}
            <span className="welcomeUser">
              {userInfo ? userInfo.username : <></>}
            </span>{" "}
            !
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
      <div
        className="flex"
        style={{ justifyContent: "flex-start", gap: "3rem" }}
      >
        <StatsProd />
        <img
          src="/src/Components/assets/media/oftyn.png"
          alt="oftyn"
          style={{ height: "auto", width: "10vw" }}
        />
        <div>
          <h4 style={{ marginBottom: "1rem" }}>My info :</h4>
          <ul>
            <li>French</li>
            <li>20 yo</li>
            <li>4-years Producer</li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Top;
