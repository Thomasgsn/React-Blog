import {
  IconHome,
  IconEdit,
  IconUsers,
  IconTableHeart,
  IconPlus,
} from "@tabler/icons-react";
import { UserInfo } from "../../../../utils/type";

import "../Topbar.css";

const Topbar = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <div className="topbar">
      <div className="search flex">
        <img src="/media/logo.png" alt="logo" />
      </div>
      <div className="links flex">
        <a href="/home" className="link flex">
          <IconHome
            size={24}
            className="icon"
            color={
              window.location.href.split("/")[3] === "home"
                ? "var(--primaryColor)"
                : "var(--blackColor)"
            }
          />
        </a>

        <a href="/followers" className="link flex">
          <IconUsers
            size={24}
            className="icon"
            color={
              window.location.href.split("/")[3] === "followers"
                ? "var(--primaryColor)"
                : "var(--blackColor)"
            }
          />
        </a>

        <a href="/add" className="link flex">
          <IconPlus
            size={24}
            className="icon"
            color={
              window.location.href.split("/")[3] === "add"
                ? "var(--primaryColor)"
                : "var(--blackColor)"
            }
          />
        </a>

        <a href="/edit" className="link flex">
          <IconEdit
            size={24}
            className="icon"
            color={
              window.location.href.split("/")[3] === "edit"
                ? "var(--primaryColor)"
                : "var(--blackColor)"
            }
          />
        </a>

        <a href="/like" className="link flex">
          <IconTableHeart
            size={24}
            className="icon"
            color={
              window.location.href.split("/")[3] === "like"
                ? "var(--primaryColor)"
                : "var(--blackColor)"
            }
          />
        </a>
      </div>
      <div className="user flex">
        {userInfo.role === "admin" && (
          <span style={{ color: "red", fontWeight: '700' }}>ADMIN</span>
        )}
        <span className="name">
          <a href={`/u/${userInfo.id}`}>
            {userInfo.firstname} {userInfo.lastname}
          </a>
        </span>
        <a href={`/u/${userInfo.id}`}>
          <div className="avatar flex">
            <img
              src={`/avatars/${userInfo.avatar}`}
              alt={`${userInfo.username} avatar`}
            />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Topbar;
