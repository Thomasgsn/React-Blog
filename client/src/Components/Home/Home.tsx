import { useState } from "react";
import { UserInfo } from "../../utils/type";

import Follow from "./Follow/Follow";
import Recent from "./Recent/Recent";
import Topbar from "../assets/Topbar/HomeTopbar/HomeTopbar";

import "./Home.css";

const Body = ({ userInfo }: { userInfo: UserInfo }) => {
  const [current, setCurrent] = useState<string>("recent");
  const [search, setSearch] = useState<string>("");

  return (
    <div className="container">
      <Topbar {...{ userInfo, search, setSearch }} />
      <div className="mainContent">
        <div className="switchSection flex">
          <p
            onClick={() => setCurrent("recent")}
            className={current === "recent" ? "active" : ""}
          >
            Recent
          </p>
          <p
            onClick={() => setCurrent("follow")}
            className={current === "follow" ? "active" : ""}
          >
            Follow
          </p>
        </div>
        <div className="flex">
          {current == "recent" ? (
            <Recent {...{ userInfo, search }} />
          ) : (
            <Follow {...{ userInfo, search }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;
