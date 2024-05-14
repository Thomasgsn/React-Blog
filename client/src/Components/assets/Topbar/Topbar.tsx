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

interface userInfo {
  role: string;
}

import "./Topbar.css";

const Topbar = ({ userInfo }: { userInfo: userInfo }) => {
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
      </div>
      <div className="links flex">
        <a href="/home" className="link flex">
          <IconHome size={24} className="icon" />
        </a>

        <a href="/home" className="link flex">
          <IconUsers size={24} className="icon" />
        </a>

        <a href="/home" className="link flex">
          <IconPlus size={24} className="icon" />
        </a>

        <a href="/home" className="link flex">
          <IconEdit size={24} className="icon" />
        </a>

        <a href="/home" className="link flex">
          <IconMessage2 size={24} className="icon" />
        </a>
      </div>
      <div className="user flex">
        <span>Firstname Lastname</span>
        <div className="avatar flex">
          <img
            src="https://imgs.search.brave.com/1U0ZG7PgeXpeMovJfB5AE9lId1Fbv3VJtl3SLIg37yo/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE2/NDI0Mjc3NDk2NzAt/ZjIwZTJlNzZlZDhj/P3E9ODAmdz0xMDAw/JmF1dG89Zm9ybWF0/JmZpdD1jcm9wJml4/bGliPXJiLTQuMC4z/Jml4aWQ9TTN3eE1q/QTNmREI4TUh4elpX/RnlZMmg4TVRGOGZH/bHRaM3hsYm53d2ZI/d3dmSHg4TUE9PQ"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
