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

interface Prod {
  id: number;
  name: string;
  tag: string;
  cover: string;
  prodFile: string;
  instrurapLink: string;
  BPM: number;
  key: string;
  price: number;
  releaseDate: string;
  idTB: number;
  TypeBeatName: string;
}

const Prod = () => {
  const [edit, setEdit] = useState<boolean>(false);
  const [idEdit, setIdEdit] = useState<number>(0);
  const [prod, setProd] = useState<Prod[]>([]);

  useEffect(() => {
    const fetchArtistReco = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/allprods?id=${idEdit}`
        );
        setProd(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchArtistReco();
  }, [idEdit]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8081/prod/${id}`);
      setProd((prevState) => prevState.filter((prod) => prod.id !== id));
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
    setProd((prevProd) => [...prevProd].reverse());
    setRev(!rev);
  };

  return (
    <div className="flex tableInfo">
      <div>
        {edit ? (
          <Edit {...{ prod, idEdit, setIdEdit, setEdit }} />
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
              <caption>Number of Prod : {prod.length}</caption>
              <thead>
                <tr className="start bordered">
                  <th className="click flex" scope="col" onClick={invertOrder}>
                    id{rev ? <IconChevronDown /> : <IconChevronUp />}
                  </th>
                  <th scope="col" style={{ width: "5vw" }}>
                    Name
                  </th>
                  <th scope="col">Tags</th>
                  <th scope="col">Cover</th>
                  <th scope="col">File</th>
                  <th scope="col">Link</th>
                  <th scope="col">BPM</th>
                  <th scope="col">Key</th>
                  <th scope="col">Price</th>
                  <th scope="col">Release Date</th>
                  <th scope="col">Type Beat</th>
                  <th scope="col">Edit</th>
                </tr>
              </thead>
              <tbody>
                {prod.map((p) => (
                  <tr key={p.id}>
                    <th scope="row">{p.id}</th>
                    <td>{p.name}</td>
                    <td className="tags flex">
                      {p.tag.split("; ").map((tag) => (
                        <p key={tag.replace(";", "")}>{tag.replace(";", "")}</p>
                      ))}
                    </td>
                    <td>
                      <img
                        src={`/prods/${p.cover}`}
                        alt={`${p.name} By. _oftyn`}
                        className="square"
                      />
                    </td>
                    <td className="audio">
                      <audio controls>
                        <source
                          type="audio/mpeg"
                          src={`/prods/${p.prodFile}`}
                        />
                      </audio>
                    </td>
                    <td>
                      <a
                        target="_blank"
                        href={`https://www.instrurap.fr/beats/track/${p.instrurapLink}`}
                      >
                        {p.instrurapLink}
                      </a>
                    </td>
                    <td>{p.BPM}</td>
                    <td>{p.key}</td>
                    <td>{p.price}</td>
                    <td>{p.releaseDate}</td>
                    <td>
                      {p.TypeBeatName}{" "}
                      <sub>
                        <b>{p.idTB}</b>
                      </sub>
                    </td>
                    <td>
                      <IconEdit
                        onClick={() => openEdit(p.id)}
                        className="icon"
                      />
                      <IconEraser
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this item ?"
                            )
                          ) {
                            handleDelete(p.id);
                          }
                        }}
                        className="icon"
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <th colSpan={11}>
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

export default Prod;
