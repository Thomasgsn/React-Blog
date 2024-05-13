import { useState, useEffect } from "react";

import Top from "./Top/Top";
import MyPlaylists from "./MyPlaylists/MyPlaylists";
import Sidebar from "../assets/Sidebar/Sidebar";
import Recommendation from "../assets/Recommendation/Recommendation";

import "./Home.css";

import { UserInfo } from "../../utils/type";

const Body = ({ userInfo }: { userInfo: UserInfo }) => {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/home")
      .then((response) => response.json())
      .then((dataPlaylist) => {
        setPlaylist(dataPlaylist);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, []);

  return (
    <div className="homePage flex">
      <div className="container">
        <Sidebar {...{ userInfo }} />
        <div className="mainContent">
          <Top {...{ userInfo }} />
          <div className="bottom flex">
            <MyPlaylists {...{ playlist }} />
          </div>
          <Recommendation />
        </div>
      </div>
    </div>
  );
};

export default Body;
