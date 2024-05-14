import { useState } from "react";

import Follow from "./Follow/Follow";
import Recent from "./Recent/Recent";
import Topbar from "../assets/Topbar/Topbar";
// import Recommendation from "../assets/Recommendation/Recommendation";

import "./Home.css";

import { UserInfo } from "../../utils/type";

const Body = ({ userInfo }: { userInfo: UserInfo }) => {
  const [current, setCurrent] = useState<string>("recent");

  return (
    <div className="container">
      <Topbar {...{ userInfo }} />
      <div className="mainContent flex">
        <div className="flex">
          <div className="blogs grid">
            {current == "recent" ? <Recent /> : <Follow />}
          </div>
        </div>
        {/* <Recommendation /> */}
      </div>
    </div>
  );
};

export default Body;
