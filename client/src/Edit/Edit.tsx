import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Components/assets/Sidebar/Sidebar";
import { IconArrowLeft } from "@tabler/icons-react";

import EditPlaylist from "./Section/Playlist/Playlist";
import EditProd from "./Section/Prod/Prod";
import EditReco from "./Section/Reco/Reco";
import EditRecoArtist from "./Section/RecoArtist/RecoArtist";

import "./Edit.css";

const Edit = ({ userInfo }) => {
  const { section } = useParams();
  const navigateTo = useNavigate();

  userInfo ? userInfo.role == "admin" ? <></> : navigateTo("/home") : <></>;

  const ReturnIcon = () => {
    return (
      <div className="headEdit flex">
        <IconArrowLeft onClick={() => navigateTo("/edit")} className="icon" />
        <p className="goback">Go back</p>
      </div>
    );
  };

  const DisplayChanges = () => {
    switch (section) {
      case undefined:
        return (
          <ul className="edit">
            <li onClick={() => navigateTo(`/edit/prod`)}>prod</li>
            <li onClick={() => navigateTo(`/edit/playlist`)}>playlist</li>
            <li onClick={() => navigateTo(`/edit/reco`)}>
              song recommendation
            </li>
            <li onClick={() => navigateTo(`/edit/recoartist`)}>
              artist recommendation
            </li>
          </ul>
        );

      case "prod":
        return (
          <div className="editThing">
            <ReturnIcon />
            <EditProd />
          </div>
        );
      case "playlist":
        return (
          <div className="editThing">
            <ReturnIcon />
            <EditPlaylist />
          </div>
        );
      case "reco":
        return (
          <div className="editThing">
            <ReturnIcon />
            <EditReco />
          </div>
        );
      case "recoartist":
        return (
          <div className="editThing">
            <ReturnIcon />
            <EditRecoArtist />
          </div>
        );

      default:
        return (
          <ul>
            <li>ERROR</li>
          </ul>
        );
    }
  };

  return (
    <div className="homePage flex">
      <div className="container">
        <Sidebar {...{ userInfo }} />
        <div className="mainContent">
          <p className="title">Admin Edit</p>
          <div className="bottom flex">
            <DisplayChanges />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
