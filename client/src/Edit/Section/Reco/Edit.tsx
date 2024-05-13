import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowBarRight, IconX, IconArrowRight } from "@tabler/icons-react";
import axios from "axios";

interface Artist {
  id: number;
  artistName: string;
}

interface Song {
  id: number;
  idArtist: string;
  artistName: string;
  songName: string;
  beatmaker: string;
  youtubeID: string;
  spotifyID: string;
}

interface EditProps {
  songReco: Song[];
  idEdit: number;
  setIdEdit: Dispatch<SetStateAction<number>>;
  setEdit: Dispatch<SetStateAction<boolean>>;
}

const Edit: React.FC<EditProps> = ({
  songReco,
  idEdit,
  setIdEdit,
  setEdit,
}) => {
  const navigateTo = useNavigate();

  const [artistSelect, setArtistSelect] = useState<Artist[]>([]);
  const [song, setSong] = useState<Song>({
    id: idEdit,
    idArtist: "",
    artistName: "",
    songName: "",
    beatmaker: "",
    youtubeID: "",
    spotifyID: "",
  });

  const [youtubeValid, setYoutubeValid] = useState<boolean>(false);
  const [spotifyValid, setSpotifyValid] = useState<boolean>(false);

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    if (songReco.length === 1) {
      setSong(songReco[0]);
      setYoutubeValid(true);
      setSpotifyValid(!!songReco[0].spotifyID);
    }
  }, [songReco]);

  const fetchArtists = async () => {
    try {
      const response = await axios.get("http://localhost:8081/allartistreco");
      setArtistSelect(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  const handleClose = () => {
    setEdit(false);
    setIdEdit(0);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "youtubeID" && value.includes("youtube.com")) {
      const videoId = value.split("v=")[1];
      setSong((prev) => ({ ...prev, youtubeID: videoId }));
      return;
    }
    if (name === "spotifyID" && value.includes("open.spotify.com")) {
      const trackId = value.split("track/")[1];
      setSong((prev) => ({ ...prev, spotifyID: trackId }));
      return;
    }

    setSong((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8081/crudSongReco", { song });
      navigateTo("/edit/reco");
    } catch (error) {
      console.error("Error :", error);
    }
  };

  return (
    <div className="tableEdit">
      {songReco.length == 1 ? (
        <div className="flex" style={{ justifyContent: "center" }}>
          <table>
            <thead>
              <tr className="start">
                <th scope="col">id</th>
                <th scope="col">
                  Artist <sub>idArtist</sub>
                </th>
                <th scope="col">Song Name</th>
                <th scope="col">Beatmaker</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{songReco[0].id}</th>
                <td>
                  {songReco[0].artistName}{" "}
                  <sub>
                    <b>{songReco[0].idArtist}</b>
                  </sub>
                </td>
                <td>{songReco[0].songName}</td>
                <td>{songReco[0].beatmaker}</td>
              </tr>
            </tbody>
          </table>
          <IconArrowBarRight />
          <table>
            <thead>
              <tr className="start">
                <th scope="col">id</th>
                <th scope="col">
                  Artist <sub>idArtist</sub>
                </th>
                <th scope="col">Song Name</th>
                <th scope="col">Beatmaker</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{songReco[0].id}</th>
                <td>
                  {song.idArtist}{" "}
                  <sub>
                    <b>{song.idArtist}</b>
                  </sub>
                </td>
                <td>{song.songName}</td>
                <td>{song.beatmaker}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex" style={{ justifyContent: "center" }}>
          <table>
            <thead>
              <tr className="start">
                <th scope="col">
                  Artist <sub>idArtist</sub>
                </th>
                <th scope="col">Song Name</th>
                <th scope="col">Beatmaker</th>
                <th scope="col">YouTube Link</th>
                <th scope="col">Spotify Link</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {song.idArtist}{" "}
                  <sub>
                    <b>{song.idArtist}</b>
                  </sub>
                </td>
                <td>{song.songName}</td>
                <td>{song.beatmaker}</td>
                <td>{song.youtubeID}</td>
                <td>{song.spotifyID}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div className="headEditTable">
        <div className="flex">
          <IconX onClick={handleClose} className="icon closeForm" />
          <h1>Song recommendation</h1>
        </div>
        <p className="info">
          if a field is marked with a *, this means that the field is mandatory
        </p>
      </div>
      <form className="wh-null" onSubmit={handleSubmit}>
        <ul className="editTable">
          <li className="necessary">
            <label>Artist</label>
            <div className="input flex">
              <select
                required
                name="idArtist"
                onChange={handleChange}
                defaultValue={songReco.length == 1 ? songReco[0].idArtist : 0}
              >
                <option disabled value="0">
                  Select an Artist
                </option>
                {artistSelect.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.artistName.toString()}
                  </option>
                ))}
              </select>
            </div>
            <p
              onClick={() => {
                navigateTo("/edit/recoartist");
              }}
              style={{ width: "4.25rem" }}
              className="info"
            >
              add an artist
            </p>
          </li>
          <li className="necessary">
            <label>Song Name</label>
            <div className="input flex">
              <input
                required
                type="text"
                name="songName"
                placeholder="Song Name"
                onChange={handleChange}
                defaultValue={songReco.length == 1 ? songReco[0].songName : ""}
              />
            </div>
          </li>
          <li className="necessary">
            <label>Beatmaker</label>
            <div className="input flex">
              <input
                required
                type="text"
                name="beatmaker"
                placeholder="Beatmaker"
                onChange={handleChange}
                defaultValue={songReco.length == 1 ? songReco[0].beatmaker : ""}
              />
            </div>
            <p
              onClick={() => {
                navigator.clipboard.writeText("&");
                alert("& is copied to clipboard");
              }}
              style={{ width: "10.5rem" }}
              className="info"
            >
              separate each beatmaker with &
            </p>
          </li>
          <li className="necessary">
            <label>YouTube Link</label>
            <div className="input flex">
              <input
                required
                type="text"
                name="youtubeID"
                disabled={youtubeValid}
                onChange={handleChange}
                placeholder="YouTube Link"
                defaultValue={
                  songReco.length == 1
                    ? `https://www.youtube.com/watch?v=${song.youtubeID}`
                    : ""
                }
              />
            </div>
            {song.youtubeID ? (
              <div className="infoLink">
                <div className="flex">
                  {youtubeValid ? (
                    <img
                      src="/edit/notValid.png"
                      alt="false"
                      onClick={() => setYoutubeValid(false)}
                    />
                  ) : (
                    <>
                      <p>It's this video ?</p>
                      <img
                        src="/edit/valid.png"
                        alt="true"
                        onClick={() => setYoutubeValid(true)}
                      />
                    </>
                  )}
                </div>
                <img
                  className={youtubeValid ? "valid ytbSpoti" : "ytbSpoti"}
                  src={`https://img.youtube.com/vi/${song.youtubeID}/mqdefault.jpg`}
                  alt="youtube video"
                />
              </div>
            ) : songReco.length == 1 ? (
              <div className="infoLink">
                <div className="flex">
                  {youtubeValid ? (
                    <img
                      src="/edit/notValid.png"
                      alt="false"
                      onClick={() => setYoutubeValid(false)}
                    />
                  ) : (
                    <>
                      <p>It's this video ?</p>
                      <img
                        src="/edit/valid.png"
                        alt="true"
                        onClick={() => {
                          setYoutubeValid(true);
                          if (song.youtubeID == "") {
                            setSong((prev) => ({
                              ...prev,
                              youtubeID: songReco[0].youtubeID,
                            }));
                          }
                        }}
                      />
                    </>
                  )}
                </div>
                <img
                  className={youtubeValid ? "valid ytbSpoti" : "ytbSpoti"}
                  src={`https://img.youtube.com/vi/${
                    song.youtubeID ? song.youtubeID : songReco[0].youtubeID
                  }/mqdefault.jpg`}
                  alt="youtube video"
                />
              </div>
            ) : (
              <></>
            )}
          </li>
          <li>
            <label>Spotify Link</label>
            <div className="input flex">
              <input
                type="text"
                name="spotifyID"
                disabled={spotifyValid}
                onChange={handleChange}
                placeholder="Spotify Link"
                defaultValue={
                  songReco.length == 1
                    ? `https://open.spotify.com/intl-fr/track/${song.spotifyID}`
                    : ""
                }
              />
            </div>

            {song.spotifyID ? (
              <div className="infoLink">
                <div className="flex">
                  {spotifyValid ? (
                    <img
                      src="/edit/notValid.png"
                      alt="false"
                      onClick={() => setSpotifyValid(false)}
                    />
                  ) : (
                    <>
                      <p>It's this song ?</p>
                      <img
                        src="/edit/valid.png"
                        alt="true"
                        onClick={() => setSpotifyValid(true)}
                      />
                    </>
                  )}
                </div>
                <iframe
                  className="iframe ytbSpoti"
                  style={{ borderRadius: "12px", height: "5.3rem" }}
                  src={`https://open.spotify.com/embed/track/${song.spotifyID}?utm_source=generator`}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </div>
            ) : songReco.length == 1 ? (
              <div className="infoLink">
                <div className="flex">
                  {spotifyValid ? (
                    <img
                      src="/edit/notValid.png"
                      alt="false"
                      onClick={() => setSpotifyValid(false)}
                    />
                  ) : (
                    <>
                      <p>It's this song ?</p>
                      <img
                        src="/edit/valid.png"
                        alt="true"
                        onClick={() => {
                          setSpotifyValid(true);
                          if (song.youtubeID == "") {
                            setSong((prev) => ({
                              ...prev,
                              spotifyID: songReco[0].spotifyID,
                            }));
                          }
                        }}
                      />
                    </>
                  )}
                </div>
                <iframe
                  className="iframe ytbSpoti"
                  style={{ borderRadius: "12px", height: "5.3rem" }}
                  src={`https://open.spotify.com/embed/track/${
                    song.spotifyID ? song.spotifyID : songReco[0].spotifyID
                  }?utm_source=generator`}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </div>
            ) : (
              <></>
            )}
          </li>
          <li>
            <button
              type="submit"
              onClick={() => handleSubmit}
              className="btn flex submit"
              disabled={
                youtubeValid ? (song.idArtist != "" ? false : true) : true
              }
            >
              <span>{idEdit ? <p>edit</p> : <p>add</p>}</span>
              <IconArrowRight className="icon" />
            </button>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default Edit;
