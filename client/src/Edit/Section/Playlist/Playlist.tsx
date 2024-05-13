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

interface TypeBeat {
  id: number;
  name: string;
}

const Reco = () => {
  const [edit, setEdit] = useState<boolean>(false);
  const [idEdit, setIdEdit] = useState<number>(0);
  const [typebeat, setTB] = useState<TypeBeat[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/alltypebeat?id=${idEdit}`
      );
      setTB(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }, [idEdit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8081/playlist/${id}`);
      setTB((prevState) => prevState.filter((typebeat) => typebeat.id !== id));
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
    setTB((prevTypebeat) => [...prevTypebeat].reverse());
    setRev(!rev);
  };

  return (
    <div className="flex tableInfo">
      <div>
        {edit ? (
          <Edit {...{ typebeat, idEdit, setIdEdit, setEdit }} />
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
              <caption>Number of type beat : {typebeat.length}</caption>
              <thead>
                <tr className="start">
                  <th className="click flex" scope="col" onClick={invertOrder}>
                    id{rev ? <IconChevronDown /> : <IconChevronUp />}
                  </th>
                  <th scope="col">Name</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {typebeat.map((t) => (
                  <tr key={t.id}>
                    <th scope="row">{t.id}</th>
                    <td>{t.name}</td>
                    <td>
                      <IconEdit
                        onClick={() => openEdit(t.id)}
                        className="icon"
                      />
                      <IconEraser
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this item ?"
                            )
                          ) {
                            handleDelete(t.id);
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
