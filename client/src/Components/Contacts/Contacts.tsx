import { UserInfo } from "../../utils/type";

import Top from "./Top/Top";
import MyContact from "./MyContact/MyContact";
import Sidebar from "../assets/Sidebar/Sidebar";

import "./Contacts.css";

const Contacts = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <div className="homePage flex">
      <div className="container">
        <Sidebar {...{ userInfo }} />
        <div className="mainContent">
          <Top {...{ userInfo }} />
          <div className="bottom flex">
            <MyContact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
