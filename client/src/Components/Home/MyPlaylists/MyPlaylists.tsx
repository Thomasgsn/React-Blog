import { useNavigate } from "react-router-dom";
import { IconArrowNarrowRight } from "@tabler/icons-react";

import "./MyPlaylists.css";

import { Playlist } from "../../../utils/type";

const MyPlaylists = ({playlist}: {playlist: Playlist[]}) => {

  const navigateTo = useNavigate();
  const navigateToPlaylists = () => {
    navigateTo("/playlists");
  };

  return (
    <div className="myPlaylistSection">
      <div className="heading flex">
        <h1>My Playlist</h1>
        <button onClick={navigateToPlaylists} className="btn flex">
          See All
          <IconArrowNarrowRight className="icon" />
        </button>
      </div>
      <div className="secContainer flex">
        {playlist.map((p: Playlist) => (
          <a key={p.id} href={"/playlist/" + p.name.toLowerCase()} className="singleItem">
            <img
              src={"/prods/" + p.cover}
              alt={p.name}
            />
            <h3>{p.name}</h3>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MyPlaylists;