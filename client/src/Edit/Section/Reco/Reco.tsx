import { useEffect, useState, useCallback } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconEraser,
  IconPlus,
  IconTablePlus,
} from "@tabler/icons-react";
import Edit from "./Edit";
import axios from "axios";

interface Song {
  id: number;
  artistName: string;
  idArtist: number;
  songName: string;
  beatmaker: string;
  youtubeID: string;
  spotifyID: string;
}

const Reco = () => {
  const [edit, setEdit] = useState<boolean>(false);
  const [idEdit, setIdEdit] = useState<number>(0);
  const [songReco, setSongReco] = useState<Song[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/allreco?id=${idEdit}`
      );
      setSongReco(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }, [idEdit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8081/reco/${id}`);
      setSongReco((prevState) => prevState.filter((song) => song.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (id: number) => {
    setEdit(true);
    setIdEdit(id);
  };

  const [rev, setRev] = useState(false);
  const invertOrder = () => {
    setSongReco((prevSongReco) => [...prevSongReco].reverse());
    setRev(!rev);
  };

  return (
    <div className="flex tableInfo">
      <div>
        {edit ? (
          <Edit {...{ songReco, idEdit, setIdEdit, setEdit }} />
        ) : (
          <>
            <button
              onClick={() => {
                setEdit(true);
                setIdEdit(0);
              }}
              className="add flex btn"
            >
              ADD
              <IconPlus className="icon" />
            </button>
            <table className="hovered">
              <caption>
                Number of song recommendation : {songReco.length}
              </caption>
              <thead>
                <tr className="start">
                  <th className="click flex" scope="col" onClick={invertOrder}>
                    id{rev ? <IconChevronDown /> : <IconChevronUp />}
                  </th>
                  <th scope="col">
                    Artist <sub>idArtist</sub>
                  </th>
                  <th scope="col">Song Name</th>
                  <th scope="col">Beatmaker</th>
                  <th scope="col">YouTube Link</th>
                  <th scope="col">Spotify Link</th>
                  <th scope="col">Edit</th>
                </tr>
              </thead>
              <tbody>
                {songReco.map((r) => (
                  <tr key={r.id}>
                    <th scope="row">{r.id}</th>
                    <td>
                      {r.artistName}{" "}
                      <sub>
                        <b>{r.idArtist}</b>
                      </sub>
                    </td>
                    <td>{r.songName}</td>
                    <td>{r.beatmaker}</td>
                    <td>
                      <a
                        href={`https://www.youtube.com/watch?v=${r.youtubeID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          style={{ width: "13vw" }}
                          src={`https://img.youtube.com/vi/${r.youtubeID}/mqdefault.jpg`}
                          alt="YouTube Thumbnail"
                          width={1920}
                          height={1080}
                        />
                      </a>
                    </td>
                    <td>
                      {r.spotifyID === "" ? (
                        <>No spotify link</>
                      ) : (
                        <iframe
                          style={{ borderRadius: "12px", height: "5.3rem" }}
                          src={`https://open.spotify.com/embed/track/${r.spotifyID}?utm_source=generator`}
                          width="100%"
                          height="152"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                        ></iframe>
                      )}
                    </td>
                    <td>
                      <IconEdit
                        onClick={() => openEdit(r.id)}
                        className="icon"
                      />
                      <IconEraser
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this item ?"
                            )
                          ) {
                            handleDelete(r.id);
                          }
                        }}
                        className="icon"
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <th colSpan={8}>
                    <IconTablePlus
                      onClick={() => {
                        setEdit(true);
                        setIdEdit(0);
                      }}
                      className="icon"
                    />
                  </th>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Reco;
