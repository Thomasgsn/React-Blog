import { useState } from "react";
import { UserInfo } from "../../utils/type";

import Follow from "./Follow/Follow";
import Recent from "./Recent/Recent";
import Topbar from "../assets/Topbar/Topbar";

import "./Home.css";

const Body = ({ userInfo }: { userInfo: UserInfo }) => {
  const [current, setCurrent] = useState<string>("recent");

  return (
    <div className="container">
      <Topbar {...{ userInfo }} />
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
          <div className="blogs grid">
            {current == "recent" ? <Recent /> : <Follow {...{ userInfo }} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
