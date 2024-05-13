import {
  IconUser,
  IconSearch,
  IconArrowDown,
  IconSeparator,
  IconArrowUp,
  IconX,
} from "@tabler/icons-react";
import { UserInfo } from "../../../utils/type";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

import "./Top.css";

const Top = ({
  search,
  setSearch,
  filter,
  setFilter,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  userInfo,
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  minPrice: number;
  setMinPrice: Dispatch<SetStateAction<number>>;
  maxPrice: number;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  userInfo: UserInfo;
}) => {
  const navigateTo = useNavigate();
  return (
    <div className="topSection">
      <div className="headerSection flex">
        <div className="find flex">
          <label>Find by :</label>
          <div className="flex" style={{ flexDirection: "column" }}>
            <button onClick={() => navigateTo("/playlists")} className="btn">
              Type Beat
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
      <div className="secSection flex">
        <div className="orders flex">
          <label>Order by:</label>
          <div className="flex orderItem">
            {filter === "date" || filter === "dateinv" ? (
              <button
                className="btn flex"
                style={{
                  backgroundColor: "var(--primarySecondColor)",
                  color: "var(--primaryColor)",
                }}
                onClick={() => {
                  filter === "date" ? setFilter("dateinv") : setFilter("date");
                }}
              >
                Date{" "}
                {filter === "date" ? (
                  <IconArrowUp className="icon" />
                ) : (
                  <IconArrowDown className="icon" />
                )}
              </button>
            ) : (
              <button className="btn flex" onClick={() => setFilter("date")}>
                Date <IconSeparator className="icon" />
              </button>
            )}

            {filter === "price" || filter === "priceinv" ? (
              <button
                className="btn flex"
                style={{
                  backgroundColor: "var(--primarySecondColor)",
                  color: "var(--primaryColor)",
                }}
                onClick={() => {
                  filter === "price"
                    ? setFilter("priceinv")
                    : setFilter("price");
                }}
              >
                Price{" "}
                {filter === "price" ? (
                  <IconArrowDown className="icon" />
                ) : (
                  <IconArrowUp className="icon" />
                )}
              </button>
            ) : (
              <button className="btn flex" onClick={() => setFilter("price")}>
                Price <IconSeparator className="icon" />
              </button>
            )}

            {filter === "type" || filter === "typeinv" ? (
              <button
                className="btn flex"
                style={{
                  backgroundColor: "var(--primarySecondColor)",
                  color: "var(--primaryColor)",
                }}
                onClick={() => {
                  filter === "type" ? setFilter("typeinv") : setFilter("type");
                }}
              >
                Type Beat{" "}
                {filter === "type" ? (
                  <IconArrowDown className="icon" />
                ) : (
                  <IconArrowUp className="icon" />
                )}
              </button>
            ) : (
              <button className="btn flex" onClick={() => setFilter("type")}>
                Type Beat <IconSeparator className="icon" />
              </button>
            )}
          </div>
        </div>
        <div className="price flex">
          <div className="contain flex">
            <div className="priceBar">
              <p className="libelle">Min Price</p>
              <input
                type="range"
                className="priceRange"
                value={minPrice}
                min="0"
                max={maxPrice}
                onChange={(event) => {
                  setMinPrice(event.target.value);
                }}
              />
              <p className="libelle">{minPrice} €</p>
            </div>
            <div className="priceBar">
              <p className="libelle">Max Price</p>
              <input
                type="range"
                className="priceRange"
                value={maxPrice}
                min={minPrice}
                max="100"
                onChange={(event) => {
                  setMaxPrice(event.target.value);
                }}
              />
              <p className="libelle">{maxPrice} €</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top;
