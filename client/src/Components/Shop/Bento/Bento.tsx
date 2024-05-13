import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconArrowRight,
  IconCaretRight,
  IconRefresh,
} from "@tabler/icons-react";
import { Prods, Playlist } from "../../../utils/type";
import Loader from "../../../utils/Loader";

import "./Bento.css";

const Bento = ({
  playlist,
  prods,
  nbProds,
  nbPlaylist,
}: {
  playlist: Playlist[];
  prods: Prods[];
  nbProds: number | undefined;
  nbPlaylist: number | undefined;
}) => {
  const navigateTo = useNavigate();

  const [indexPlaylist1, setIndexPlaylist1] = useState<number>(0);
  const [indexPlaylist2, setIndexPlaylist2] = useState<number>(0);

  const [indexProd1, setIndexProd1] = useState<number>(0);
  const [indexProd2, setIndexProd2] = useState<number>(0);
  const [indexProd3, setIndexProd3] = useState<number>(0);
  const [indexProd4, setIndexProd4] = useState<number>(0);

  const [indexProd5, setIndexProd5] = useState<number>(0);
  const [indexProd6, setIndexProd6] = useState<number>(0);
  const [indexProd7, setIndexProd7] = useState<number>(0);
  const [indexProd8, setIndexProd8] = useState<number>(0);

  useEffect(() => {
    const indexesPlaylist = Array.from(Array(playlist.length).keys());

    indexesPlaylist.sort(() => Math.random() - 0.5);
    const initialPlaylistIndexes = indexesPlaylist.slice(0, 2);

    setIndexPlaylist1(initialPlaylistIndexes[0]);
    setIndexPlaylist2(initialPlaylistIndexes[1]);

    const indexesProd = Array.from(Array(prods.length).keys());

    indexesPlaylist.sort(() => Math.random() - 0.5);
    const initialProdIndexes = indexesProd.slice(0, 8);

    setIndexProd1(initialProdIndexes[0]);
    setIndexProd2(initialProdIndexes[1]);
    setIndexProd3(initialProdIndexes[2]);
    setIndexProd4(initialProdIndexes[3]);
    setIndexProd5(initialProdIndexes[4]);
    setIndexProd6(initialProdIndexes[5]);
    setIndexProd7(initialProdIndexes[6]);
    setIndexProd8(initialProdIndexes[7]);
  }, [playlist.length, prods.length]);

  const [rotate, setRotate] = useState<number>(0);

  const reloadIndex = () => {
    rotate === 360 ? setRotate(0) : setRotate(360);

    let newIndexPlaylist1,
      newIndexPlaylist2,
      newIndexProd1,
      newIndexProd2,
      newIndexProd3,
      newIndexProd4,
      newIndexProd5,
      newIndexProd6,
      newIndexProd7,
      newIndexProd8;

    do {
      newIndexPlaylist1 = Math.floor(Math.random() * playlist.length);
      newIndexPlaylist2 = Math.floor(Math.random() * playlist.length);
    } while (newIndexPlaylist1 === newIndexPlaylist2);

    do {
      newIndexProd1 = Math.floor(Math.random() * prods.length);
      newIndexProd2 = Math.floor(Math.random() * prods.length);
      newIndexProd3 = Math.floor(Math.random() * prods.length);
      newIndexProd4 = Math.floor(Math.random() * prods.length);
      newIndexProd5 = Math.floor(Math.random() * prods.length);
      newIndexProd6 = Math.floor(Math.random() * prods.length);
      newIndexProd7 = Math.floor(Math.random() * prods.length);
      newIndexProd8 = Math.floor(Math.random() * prods.length);
    } while (
      newIndexProd1 === newIndexProd2 ||
      newIndexProd1 === newIndexProd3 ||
      newIndexProd1 === newIndexProd4 ||
      newIndexProd1 === newIndexProd5 ||
      newIndexProd1 === newIndexProd6 ||
      newIndexProd1 === newIndexProd7 ||
      newIndexProd1 === newIndexProd8 ||
      newIndexProd2 === newIndexProd3 ||
      newIndexProd2 === newIndexProd4 ||
      newIndexProd2 === newIndexProd5 ||
      newIndexProd2 === newIndexProd6 ||
      newIndexProd2 === newIndexProd7 ||
      newIndexProd2 === newIndexProd8 ||
      newIndexProd3 === newIndexProd4 ||
      newIndexProd3 === newIndexProd5 ||
      newIndexProd3 === newIndexProd6 ||
      newIndexProd3 === newIndexProd7 ||
      newIndexProd3 === newIndexProd8 ||
      newIndexProd4 === newIndexProd5 ||
      newIndexProd4 === newIndexProd6 ||
      newIndexProd4 === newIndexProd7 ||
      newIndexProd4 === newIndexProd8 ||
      newIndexProd5 === newIndexProd6 ||
      newIndexProd5 === newIndexProd7 ||
      newIndexProd5 === newIndexProd8 ||
      newIndexProd6 === newIndexProd7 ||
      newIndexProd6 === newIndexProd8 ||
      newIndexProd7 === newIndexProd8
    );

    setIndexPlaylist1(newIndexPlaylist1);
    setIndexPlaylist2(newIndexPlaylist2);
    setIndexProd1(newIndexProd1);
    setIndexProd2(newIndexProd2);
    setIndexProd3(newIndexProd3);
    setIndexProd4(newIndexProd4);
    setIndexProd5(newIndexProd5);
    setIndexProd6(newIndexProd6);
    setIndexProd7(newIndexProd7);
    setIndexProd8(newIndexProd8);
  };

  return (
    <div className="myPlaylistsSection">
      <IconRefresh
        className="icon"
        onClick={reloadIndex}
        style={{ transform: `rotate(${rotate}deg)`, transition: ".75s ease" }}
      />
      <div className="bentoGrid flex">
        <div className="col flex">
          <div className="content duu full between">
            <div className="flex full">
              <div className="item full cursor">
                {playlist[indexPlaylist1] ? (
                  <div
                    className="playlist"
                    onClick={() =>
                      navigateTo(
                        "/playlist/" +
                          playlist[indexPlaylist1].name.toLowerCase()
                      )
                    }
                  >
                    <div className="itemPlaylistName">
                      {playlist[indexPlaylist1].name}
                    </div>
                    <img
                      src={"/prods/" + playlist[indexPlaylist1].cover}
                      alt={playlist[indexPlaylist1].name}
                    />
                  </div>
                ) : (
                  <Loader />
                )}
              </div>
              <div className="item full cursor">
                {playlist[indexPlaylist2] ? (
                  <div
                    className="playlist"
                    onClick={() =>
                      navigateTo(
                        "/playlist/" +
                          playlist[indexPlaylist2].name.toLowerCase()
                      )
                    }
                  >
                    <div className="itemPlaylistName">
                      {playlist[indexPlaylist2].name}
                    </div>
                    <img
                      src={"/prods/" + playlist[indexPlaylist2].cover}
                      alt={playlist[indexPlaylist2].name}
                    />
                  </div>
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
          <div className="uqq full">
            <div className="item full">
              <div className="prod">
                <table>
                  <tr>
                    <td>
                      {prods[indexProd1] ? (
                        <a href={`prod/${prods[indexProd1].id}`}>
                          <img
                            className="cursor top prod1"
                            src={`prods/${prods[indexProd1].cover}`}
                            alt={`${prods[indexProd1].name} By. _oftyn`}
                          />
                        </a>
                      ) : (
                        <Loader />
                      )}
                    </td>
                    <td>
                      {prods[indexProd2] ? (
                        <a href={`prod/${prods[indexProd2].id}`}>
                          <img
                            className="cursor top prod2"
                            src={`prods/${prods[indexProd2].cover}`}
                            alt={`${prods[indexProd2].name} By. _oftyn`}
                          />
                        </a>
                      ) : (
                        <Loader />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {prods[indexProd3] ? (
                        <a href={`prod/${prods[indexProd3].id}`}>
                          <img
                            className="cursor prod3"
                            src={`prods/${prods[indexProd3].cover}`}
                            alt={`${prods[indexProd3].name} By. _oftyn`}
                          />
                        </a>
                      ) : (
                        <Loader />
                      )}
                    </td>
                    <td>
                      {prods[indexProd4] ? (
                        <a href={`prod/${prods[indexProd4].id}`}>
                          <img
                            className="cursor prod4"
                            src={`prods/${prods[indexProd4].cover}`}
                            alt={`${prods[indexProd4].name} By. _oftyn`}
                          />
                        </a>
                      ) : (
                        <Loader />
                      )}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col flex">
          <div className="line flex">
            <div className="item full">
              <div className="prods">
                <div className="flex title">
                  All Prod
                  <button
                    onClick={() => navigateTo("/prods")}
                    className="btn flex"
                  >
                    See All
                    <IconArrowRight className="icon" />
                  </button>
                </div>
                {prods.map((p) => (
                  <div
                    onClick={() => navigateTo(`/prod/${p.id}`)}
                    className="prod cursor"
                  >
                    <div className="flex imgName">
                      <img
                        src={`prods/${p.cover}`}
                        alt={`${p.name} By. _oftyn`}
                      />
                      <h4>{p.name}</h4>
                      <IconCaretRight className="icon" />
                    </div>
                    <div className="tags flex">
                      {p.tag.split("; ").map((tag) => (
                        <p key={tag.replace(";", "")}>{tag.replace(";", "")}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col flex">
          <div className="content uqq full">
            <div className="item full">
              <div className="prod">
                <table>
                  <tr>
                    <td>
                      {prods[indexProd5] ? (
                        <a href={`prod/${prods[indexProd5].id}`}>
                          <img
                            className="cursor top prod1"
                            src={`prods/${prods[indexProd5].cover}`}
                            alt={`${prods[indexProd5].name} By. _oftyn`}
                          />
                        </a>
                      ) : (
                        <Loader />
                      )}
                    </td>
                    <td>
                      {prods[indexProd6] ? (
                        <a href={`prod/${prods[indexProd6].id}`}>
                          <img
                            className="cursor top prod2"
                            src={`prods/${prods[indexProd6].cover}`}
                            alt={`${prods[indexProd6].name} By. _oftyn`}
                          />
                        </a>
                      ) : (
                        <Loader />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {prods[indexProd7] ? (
                        <a href={`prod/${prods[indexProd7].id}`}>
                          <img
                            className="cursor prod3"
                            src={`prods/${prods[indexProd7].cover}`}
                            alt={`${prods[indexProd7].name} By. _oftyn`}
                          />
                        </a>
                      ) : (
                        <Loader />
                      )}
                    </td>
                    <td>
                      {prods[indexProd8] ? (
                        <a href={`prod/${prods[indexProd8].id}`}>
                          <img
                            className="cursor prod4"
                            src={`prods/${prods[indexProd8].cover}`}
                            alt={`${prods[indexProd8].name} By. _oftyn`}
                          />
                        </a>
                      ) : (
                        <Loader />
                      )}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div className="duu full between">
            <div className="flex full">
              <div
                className="item full cursor"
                style={{ backgroundColor: "hsl(214, 20%, 69%" }}
              >
                <div className="plus" onClick={() => navigateTo("/playlists")}>
                  <div></div>
                  <p>+ {nbPlaylist}</p>
                  <p className="name">PLAYLIST</p>
                </div>
              </div>
              <div
                className="item full cursor"
                style={{ backgroundColor: "hsl(214, 20%, 69%" }}
              >
                <div className="plus" onClick={() => navigateTo("/prods")}>
                  <div></div>
                  <p>+ {nbProds}</p>
                  <p className="name">PRODS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bento;
