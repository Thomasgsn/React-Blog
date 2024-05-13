import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowBarRight, IconX, IconArrowRight } from "@tabler/icons-react";
import axios from "axios";

interface TypeBeat {
  id: number;
  name: string;
}

interface EditProps {
  typebeat: TypeBeat[];
  idEdit: number;
  setIdEdit: Dispatch<SetStateAction<number>>;
  setEdit: Dispatch<SetStateAction<boolean>>;
}

const Edit: React.FC<EditProps> = ({
  typebeat,
  idEdit,
  setIdEdit,
  setEdit,
}) => {
  const navigateTo = useNavigate();

  const [newTB, setNewTB] = useState<TypeBeat>({
    id: idEdit,
    name: "",
  });

  useEffect(() => {
    if (typebeat.length === 1) {
      setNewTB(typebeat[0]);
    }
  }, [typebeat]);

  const handleClose = () => {
    setEdit(false);
    setIdEdit(0);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTB((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8081/crudtypebeat", { newTB });
      navigateTo("/edit/playlist");
    } catch (error) {
      console.error("Error :", error);
    }
  };

  return (
    <div className="tableEdit">
      {typebeat.length == 1 ? (
        <div className="flex" style={{ justifyContent: "center" }}>
          <table>
            <thead>
              <tr className="start">
                <th scope="col">id</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{typebeat[0].id}</th>
                <td>{typebeat[0].name} </td>
              </tr>
            </tbody>
          </table>
          <IconArrowBarRight />
          <table>
            <thead>
              <tr className="start">
                <th scope="col">id</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{typebeat[0].id}</th>
                <td>{newTB.name} </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex" style={{ justifyContent: "center" }}>
          <table>
            <thead>
              <tr className="start">
                <th scope="col">id</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>{newTB.id} </th>
                <td>{newTB.name}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div className="headEditTable">
        <div className="flex">
          <IconX onClick={handleClose} className="icon closeForm" />
          <h1>Type Beat</h1>
        </div>
        <p className="info">
          if a field is marked with a *, this means that the field is mandatory
        </p>
      </div>
      <form className="wh-null" onSubmit={handleSubmit}>
        <ul className="editTable">
          <li className="necessary">
            <label>Name</label>
            <div className="input flex">
              <input
                required
                type="text"
                name="name"
                placeholder="Type Beat Name"
                onChange={handleChange}
                defaultValue={typebeat.length == 1 ? typebeat[0].name : ""}
              />
            </div>
          </li>

          <li>
            <button
              type="submit"
              onClick={() => handleSubmit}
              className="btn flex submit"
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
