import {
  IconHome,
  IconEdit,
  IconUsers,
  IconTableHeart,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { UserInfo } from "../../../../utils/type";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import "../Topbar.css";

const HomeTopbar = ({
  userInfo,
  search,
  setSearch,
}: {
  userInfo: UserInfo;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) => {
  const [lowSize, setLowSize] = useState<boolean>(false);
  const [lowSearch, setLowSearch] = useState<boolean>(false);

  const linksRef = useRef<HTMLDivElement>(null);
  const littleSearchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const innerWidth = window.innerWidth;
      setLowSize(innerWidth < 840);
    };
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const links = linksRef.current;
    const littleSearchBar = littleSearchBarRef.current;

    if (links && littleSearchBar) {
      if (lowSize) {
        links.style.display = lowSearch ? "none" : "flex";
        littleSearchBar.style.display = lowSearch ? "flex" : "none";
      } else {
        links.style.display = "flex";
        littleSearchBar.style.display = "none";
        setLowSearch(false);
      }
    }
  }, [lowSearch, lowSize]);

  return (
    <div className="topbar">
      <div className="search flex">
        <a className="flex" href="/home">
        <img src="/media/logo.png" alt="logo" /></a>
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
        <IconSearch
          size={18}
          className="icon search"
          onClick={() => setLowSearch(!lowSearch)}
        />
      </div>
      <div ref={linksRef} className="links flex">
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

      <div
        className="searchBar flex"
        ref={littleSearchBarRef}
        style={{ display: "none", height: "2rem", marginTop: ".5rem" }}
      >
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

      <div className="user flex">
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

export default HomeTopbar;
