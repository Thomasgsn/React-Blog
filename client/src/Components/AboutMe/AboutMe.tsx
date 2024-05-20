import Top from "./Top/Top";

import Sidebar from "../assets/Topbar/HomeTopbar/HomeTopbar";

import "./AboutMe.css";

const AboutMe = ({ userInfo }) => {
  return (
    <div className="homePage flex">
      <div className="container">
        <Sidebar {...{ userInfo }} />
        <div className="mainContent">
          <Top {...{ userInfo }} />
          <div className="bottom flex"></div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
