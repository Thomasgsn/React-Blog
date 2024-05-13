import { UserInfo } from "../../utils/type";
import { useEffect, useState } from "react";
import { Playlist, Prods } from '../../utils/type'

import Top from "./Top/Top";
import Sidebar from "../assets/Sidebar/Sidebar";
import MyPlaylists from "./MyPlaylists/MyPlaylists";
import Recommendation from "../assets/Recommendation/Recommendation";

import "./Playlists.css";

const Playlists = ({ userInfo }: {userInfo: UserInfo}) => {

  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const [playlistProd, setPlaylistProd] = useState<Prods[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetch(`http://localhost:8081/playlists?searchBy=${search}`)
      .then((response) => response.json())
      .then((data) => {
        setPlaylist(data.playlist);
        setPlaylistProd(data.playlistProd);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [search]);  
  return (
    <div className="homePage flex">
      <div className="container">
        <Sidebar {...{userInfo}} />
        <div className="mainContent">
          <Top {...{ search, setSearch, userInfo }}/>
          <div className="bottom flex">
            <MyPlaylists {...{ playlist, playlistProd }} />
          </div>
      <Recommendation />
        </div>
      </div>
    </div>
  );
};

export default Playlists;
