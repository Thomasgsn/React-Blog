import { IconUser } from "@tabler/icons-react";

import "./Top.css";
import { useNavigate } from "react-router-dom";

const Top = ({ userInfo, userVisit, id }) => {
  const navigateTo = useNavigate();
  return (
    <div className="topSection">
      <div className="headerSection flex">
        <div className="title">
          {userInfo ? (
            <>
              {userVisit?.id == userInfo.id ? (
                <h1>
                  Welcome to your <i>User center</i>.
                </h1>
              ) : (
                <h1>
                  Welcome to <i>{userVisit?.username} center</i>.
                </h1>
              )}
            </>
          ) : (
            <></>
          )}
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
