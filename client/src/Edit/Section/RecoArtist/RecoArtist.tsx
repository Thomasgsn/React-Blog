import { useEffect, useState } from "react";
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

interface Artist {
  id: number;
  artistName: string;
  img: string;
}

const RecoArtist = () => {
  const [edit, setEdit] = useState<boolean>(false);
  const [idEdit, setIdEdit] = useState<number>(0);
  const [artistReco, setArtistReco] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchArtistReco = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/allartistreco?id=${idEdit}`
        );
        setArtistReco(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchArtistReco();
  }, [idEdit]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8081/artistreco/${id}`);
      setArtistReco(artistReco.filter((artist) => artist.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const [rev, setRev] = useState(false);
  const invertOrder = () => {
    setArtistReco((prevArtistReco) => [...prevArtistReco].reverse());
    setRev(!rev);
  };

  return (
    <div className="flex tableInfo">
      <div>
        {edit ? (
          <Edit {...{ artistReco, idEdit, setIdEdit, setEdit }} />
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
                Number of artist recommendation : {artistReco.length}
              </caption>
              <thead>
                <tr className="start">
                  <th className="click flex" scope="col" onClick={invertOrder}>
                    id{rev ? <IconChevronDown /> : <IconChevronUp />}
                  </th>
                  <th scope="col">Artist</th>
                  <th scope="col">Image</th>
                  <th scope="col">Update</th>
                </tr>
              </thead>
              <tbody>
                {artistReco.map((r, i) => (
                  <tr key={i}>
                    <th scope="row">{r.id}</th>
                    <td>{r.artistName}</td>
                    <td>
                      <img
                        className="square"
                        src={`/recommendations/${r.img}`}
                        alt={r.artistName}
                      />
                    </td>
                    <td>
                      <IconEdit
                        onClick={() => {
                          setEdit(true);
                          setIdEdit(r.id);
                        }}
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
                  <th colSpan={4}>
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

export default RecoArtist;
