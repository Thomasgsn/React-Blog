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
          <h1>
            Welcome to the <i>_oftyn shop</i>.
          </h1>
          <p>
            Hello{" "}
            <span className="welcomeUser">
              {userInfo ? userInfo.username : <></>}
            </span>
            , you want one of my prods ?
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
      go directly to this link to buy my prods
      <br />
      <a href="https://www.instrurap.fr/p/_Oftyn">link</a>
    </div>
  );
};

export default Top;
