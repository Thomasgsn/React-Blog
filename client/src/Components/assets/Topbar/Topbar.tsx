import {
  IconHome,
  IconEdit,
  IconUsers,
  IconMessage2,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { UserInfo } from "../../../utils/type";

import "./Topbar.css";

const Topbar = ({ userInfo }: { userInfo: UserInfo }) => {
  const [search, setSearch] = useState<string>("");
  return (
    <div className="topbar flex">
      <div className="search flex">
        <img src="media/logo.png" alt="logo" />
        <div className="searchBar flex">
          <input
            onChange={(event) => {
              const filteredValue = event.target.value.replace(/["']/g, "");
              setSearch(filteredValue);
            }}
            value={search}
            type="text"
            placeholder="Search"
          />
          {!search || search == "" ? (
            <IconSearch size={18} className="icon" />
          ) : (
            <IconX size={18} className="icon" onClick={() => setSearch("")} />
          )}
        </div>
      <IconSearch size={18} className="icon search" />
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

        <a href="/home" className="link flex">
          <IconUsers
            size={24}
            className="icon"
            color={
              window.location.href.split("/")[3] === "follow"
                ? "var(--primaryColor)"
                : "var(--blackColor)"
            }
          />
        </a>

        <a href="/home" className="link flex">
          <IconPlus
            size={24}
            className="icon"
            color={
              window.location.href.split("/")[3] === "add_post"
                ? "var(--primaryColor)"
                : "var(--blackColor)"
            }
          />
        </a>

        <a href="/home" className="link flex">
          <IconEdit
            size={24}
            className="icon"
            color={
              window.location.href.split("/")[3] === "edit_post"
                ? "var(--primaryColor)"
                : "var(--blackColor)"
            }
          />
        </a>

        <a href="/home" className="link flex">
          <IconMessage2
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
        <span className="name">
          <a href={`/u/${userInfo.id}`}>
            {userInfo.firstname} {userInfo.lastname}
          </a>
        </span>
        <a href={`/u/${userInfo.id}`}>
          <div className="avatar flex">
            <img
              src={`avatars/${userInfo.avatar}`}
              alt={`${userInfo.username} avatar`}
            />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Topbar;
