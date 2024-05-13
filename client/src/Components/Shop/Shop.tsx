import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Top from "./Top/Top";
import Bento from "./Bento/Bento";
import Sidebar from "../assets/Sidebar/Sidebar";
import Recommendation from "../assets/Recommendation/Recommendation";

import "./Shop.css";

import { UserInfo, Prods, Playlist } from "../../utils/type";


const Shop = ({ userInfo }: { userInfo: UserInfo }) => {
  const navigateTo = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const [prods, setProds] = useState<Prods[]>([]);
  const [nbProds, setnbProds] = useState<number>(0);
  const [nbPlaylist, setnbPlaylist] = useState<number>(0);

  useEffect(() => {
    fetch("http://localhost:8081/shop")
      .then((response) => response.json())
      .then((data) => {
        setPlaylist(data.playlist);
        setProds(data.playlistProd);
        setnbProds(data.nbProd[0].nb);
        setnbPlaylist(data.nbPlaylist[0].nb);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, []);

  return (
    <div className="homePage flex">
      <div className="container">
        <Sidebar {...{ userInfo }} />
        <div className="shopContent">
          <Top {...{ userInfo, navigateTo }} />
          <div className="bottom flex">
            <Bento {...{ navigateTo, playlist, prods, nbProds, nbPlaylist }} />
          </div>
          <Recommendation />
        </div>
      </div>
    </div>
  );
};

export default Shop;
