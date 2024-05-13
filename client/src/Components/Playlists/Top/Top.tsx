import { IconUser, IconSearch, IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

import "./Top.css";
import { Dispatch, SetStateAction } from "react";
import { UserInfo } from "../../../utils/type";

const Top = ({
  search,
  setSearch,
  userInfo,
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  userInfo: UserInfo;
}) => {
  const navigateTo = useNavigate();
  return (
    <div className="topSection">
      <div className="headerSection flex">
        <div className="find flex">
          <label>Find by :</label>
          <div className="flex" style={{ flexDirection: "column" }}>
            <button onClick={() => navigateTo("/prods")} className="btn">
              All prods
            </button>
          </div>
        </div>

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
            <IconSearch className="icon" />
          ) : (
            <IconX className="icon" onClick={() => setSearch("")} />
          )}
        </div>

        <div className="userCenter flex">
          <a
            onClick={() => {
              userInfo ? navigateTo(`/u/${userInfo.id}`) : navigateTo("/login");
            }}
          >
            <IconUser className="icon" />
          </a>
        </div>
      </div>
      <div className="secSection flex"></div>
    </div>
  );
};

export default Top;
