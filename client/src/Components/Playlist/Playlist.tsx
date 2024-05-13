import { useEffect, useState } from "react";
import { UserInfo, Prods } from "../../utils/type";
import { useParams } from "react-router-dom";

import Top from "./Top/Top";
import Sidebar from "../assets/Sidebar/Sidebar";
import SelectedProds from "../assets/SelectedProds/SelectedProds";
import Recommendation from "../assets/Recommendation/Recommendation";

import "./Playlist.css";


const Playlist = ({ userInfo }: { userInfo: UserInfo }) => {
  const { playlistName } = useParams<string>();

  const [prods, setProds] = useState<Prods[]>([]);
  const [filter, setFilter] = useState<string>("date");
  const [search, setSearch] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100);

  useEffect(() => {
    fetch(`http://localhost:8081/playlist/${playlistName}?filterBy=${filter}&searchBy=${search}&priceRange=${minPrice}-${maxPrice}`)
      .then((response) => response.json())
      .then((playlistProd) => {
        setProds(playlistProd);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [filter, maxPrice, minPrice, playlistName, search]);


  return (
    <div className="homePage flex">
      <div className="container">
        <Sidebar {...{userInfo}} />
        <div className="mainContent">
          <Top {...{
              search,
              setSearch,
              filter,
              setFilter,
              minPrice,
              maxPrice,
              setMinPrice,
              setMaxPrice,
              userInfo,
            }} />
          <div className="bottom flex">
            <SelectedProds {...{ playlistName, prods }} />
          </div>
          <Recommendation />
        </div>
      </div>
    </div>
  );
};

export default Playlist;
