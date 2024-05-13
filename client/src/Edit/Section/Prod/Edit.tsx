import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowBarDown, IconX, IconArrowRight } from "@tabler/icons-react";
import axios from "axios";

interface TypeBeat {
  id: number;
  name: string;
}

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

interface EditProps {
  prod: Prod[];
  idEdit: number;
  setIdEdit: Dispatch<SetStateAction<number>>;
  setEdit: Dispatch<SetStateAction<boolean>>;
}

const Edit: React.FC<EditProps> = ({ prod, idEdit, setIdEdit, setEdit }) => {
  const navigateTo = useNavigate();

  const [typeBeat, setTypeBeat] = useState<TypeBeat[]>([]);
  const [newProd, setNewProd] = useState<Prod>({
    id: idEdit,
    name: "",
    tag: "",
    cover: "",
    prodFile: "",
    instrurapLink: "",
    BPM: 0,
    key: "",
    price: 0,
    releaseDate: "",
    idTB: 0,
    TypeBeatName: "",
  });
  const Gamme = [
    "C",
    "Cm",
    "C#",
    "C#m",
    "D",
    "Dm",
    "D#",
    "D#m",
    "E",
    "Em",
    "F",
    "Fm",
    "F#",
    "F#m",
    "G",
    "Gm",
    "G#",
    "G#m",
    "A",
    "Am",
    "A#",
    "A#m",
    "B",
    "Bm",
  ];

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypeBeat = async () => {
      try {
        const response = await axios.get("http://localhost:8081/alltypebeat");
        setTypeBeat(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchTypeBeat();
  }, []);

  useEffect(() => {
    if (prod.length === 1) {
      setNewProd(prod[0]);
    }
  }, [prod]);

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[0];

      if (!selectedFile.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        event.target.value = "";
        return;
      }

      setCoverFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[0];

      if (!selectedFile.type.startsWith("audio/")) {
        alert("Only audio files are allowed.");
        event.target.value = "";
        return;
      }

      setAudioFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "instrurapLink" && value.includes("instrurap.fr")) {
      const videoId = value.split("track/")[1];
      setNewProd((prev) => ({ ...prev, instrurapLink: videoId }));
      return;
    }

    setNewProd((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("newProd", JSON.stringify(newProd));

    if (coverFile) {
      formData.append("cover", coverFile);
    }

    if (audioFile) {
      formData.append("audio", audioFile);
    }

    try {
      await axios.post("http://localhost:8081/crudprodtest", formData);
      navigateTo("/edit/prod");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    setEdit(false);
    setIdEdit(0);
  };

  return (
    <div className="tableEdit">
      {prod.length == 1 ? (
        <div
          className="flex"
          style={{ justifyContent: "center", flexDirection: "column" }}
        >
          <table>
            <thead>
              <tr className="start">
                <th scope="col">id</th>
                <th scope="col">Name</th>
                <th scope="col">Tags</th>
                <th scope="col">Cover</th>
                <th scope="col">Audio File</th>
                <th scope="col">Link</th>
                <th scope="col">BPM</th>
                <th scope="col">Key</th>
                <th scope="col">Price</th>
                <th scope="col">Release Date</th>
                <th scope="col">
                  Type Beat <sub>id Type Beat</sub>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{prod[0].id}</th>
                <td>{prod[0].name}</td>
                <td className="tags">
                  {prod[0].tag.split("; ").map((tag) => (
                    <p key={tag.replace(";", "")}>{tag.replace(";", "")} </p>
                  ))}
                </td>
                <td>
                  <img
                    src={`/prods/${prod[0].cover}`}
                    alt={`${prod[0].name} By. _oftyn`}
                    className="square"
                  />
                </td>
                <td className="audio">
                  <audio controls>
                    <source
                      type="audio/mpeg"
                      src={`/prods/${prod[0].prodFile}`}
                    />
                  </audio>
                </td>
                <td>{prod[0].instrurapLink}</td>
                <td>{prod[0].BPM}</td>
                <td>{prod[0].key}</td>
                <td>{prod[0].price}</td>
                <td>{prod[0].releaseDate}</td>
                <td>
                  {prod[0].TypeBeatName}{" "}
                  <sub>
                    <b>{prod[0].idTB}</b>
                  </sub>
                </td>
              </tr>
            </tbody>
          </table>
          <IconArrowBarDown />
          <table>
            <thead>
              <tr className="start">
                <th scope="col">id</th>
                <th scope="col">Name</th>
                <th scope="col">Tags</th>
                <th scope="col">Cover</th>
                <th scope="col">Audio File</th>
                <th scope="col">Link</th>
                <th scope="col">BPM</th>
                <th scope="col">Key</th>
                <th scope="col">Price</th>
                <th scope="col">Release Date</th>
                <th scope="col">
                  Type Beat <sub>id Type Beat</sub>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{newProd.id}</th>
                <td>{newProd.name} </td>
                <td className="tags">
                  {newProd.tag.split("; ").map((tag) => (
                    <p key={tag.replace(";", "")}>
                      {tag.replace(";", "")}{" "}
                      <IconX
                        size={10}
                        className="icon"
                        onClick={() =>
                          setNewProd((prev) => ({
                            ...prev,
                            tag: newProd.tag.replace(tag, ""),
                          }))
                        }
                      />
                    </p>
                  ))}
                </td>
                <td>
                  <img
                    src={
                      imagePreview ? imagePreview : `/prods/${newProd.cover}`
                    }
                    alt={`${newProd.name} By. _oftyn`}
                    className="square"
                  />
                </td>
                <td className="audio">
                  <audio controls>
                    <source
                      type="audio/mpeg"
                      src={
                        audioPreview
                          ? audioPreview
                          : `/prods/${newProd.prodFile}`
                      }
                    />
                  </audio>
                </td>
                <td>{newProd.instrurapLink}</td>
                <td>{newProd.BPM}</td>
                <td>{newProd.key}</td>
                <td>{newProd.price}</td>
                <td>{newProd.releaseDate}</td>
                <td>
                  {newProd.TypeBeatName}{" "}
                  <sub>
                    <b>{newProd.idTB}</b>
                  </sub>
                </td>
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
                <th scope="col">Tags</th>
                <th scope="col">Cover</th>
                <th scope="col">Audio File</th>
                <th scope="col">Link</th>
                <th scope="col">BPM</th>
                <th scope="col">Key</th>
                <th scope="col">Price</th>
                <th scope="col">Release Date</th>
                <th scope="col">
                  Type Beat<sub>id Type Beat</sub>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{newProd.id}</th>
                <td>{newProd.name} </td>
                <td className="tags">
                  {newProd.tag.split("; ").map((tag) => (
                    <p key={tag.replace(";", "")}>
                      {tag.replace(";", "")}{" "}
                      <IconX
                        size={10}
                        className="icon"
                        onClick={() =>
                          setNewProd((prev) => ({
                            ...prev,
                            tag: newProd.tag.replace(tag, ""),
                          }))
                        }
                      />
                    </p>
                  ))}
                </td>
                <td>
                  <img
                    src={
                      imagePreview
                        ? imagePreview
                        : "https://placehold.co/800?text=No+Cover&font=roboto"
                    }
                    className="square"
                    alt={`${newProd.name} By. _oftyn`}
                  />
                </td>
                <td className="audio">
                  <audio controls>
                    <source type="audio/mpeg" src={audioPreview} />
                  </audio>
                </td>
                <td>{newProd.instrurapLink}</td>
                <td>{newProd.BPM}</td>
                <td>{newProd.key}</td>
                <td>{newProd.price}</td>
                <td>{newProd.releaseDate}</td>
                <td>
                  {newProd.TypeBeatName}
                  <sub>{newProd.idTB}</sub>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div className="headEditTable">
        <div className="flex">
          <IconX onClick={handleClose} className="icon closeForm" />
          <h1>Prod</h1>
        </div>
        <p className="info">
          if a field is marked with a *, this means that the field is mandatory
        </p>
      </div>
      <form
        className="wh-null"
        onSubmit={handleSubmit}
        method="POST"
        encType="multipart/form-data"
      >
        <ul className="editTable">
          <li className="necessary">
            <label>Name</label>
            <div className="input flex">
              <input
                required={idEdit == 0}
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                defaultValue={prod.length == 1 ? prod[0].name : ""}
              />
            </div>
          </li>
          <li className="necessary">
            <label>Tags</label>
            <div className="input flex">
              <input
                required={idEdit == 0}
                type="text"
                name="tag"
                placeholder="Tags"
                onChange={handleChange}
                defaultValue={prod.length == 1 ? prod[0].tag : ""}
              />
            </div>
          </li>
          <li className={idEdit != 0 ? "necessary" : ""}>
            <label>Cover</label>
            <div className="input flex">
              <input
                type="file"
                name="cover"
                onChange={handleCoverChange}
                required={idEdit == 0}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100px" }}
                />
              )}
            </div>
          </li>
          <li className={idEdit != 0 ? "necessary" : ""}>
            <label>Audio File</label>
            <div className="input flex">
              <input
                type="file"
                name="audio"
                onChange={handleAudioChange}
                required={idEdit == 0}
              />
            </div>
          </li>
          <li className="necessary">
            <label>Link</label>
            <div className="input flex">
              <input
                required={idEdit == 0}
                type="text"
                name="instrurapLink"
                placeholder="instrurapLink"
                onChange={handleChange}
                defaultValue={prod.length == 1 ? prod[0].instrurapLink : ""}
              />
            </div>
          </li>
          <li className="necessary">
            <label>BPM</label>
            <div className="input flex">
              <input
                required={idEdit == 0}
                step="1"
                name="BPM"
                type="number"
                min="70"
                max="240"
                onChange={handleChange}
                placeholder="Set a price"
                defaultValue={prod.length == 1 ? prod[0].BPM : ""}
              />
            </div>
          </li>
          <li className="necessary">
            <label>Key</label>
            <div className="input flex">
              <select
                required={idEdit == 0}
                name="key"
                onChange={handleChange}
                defaultValue={prod.length == 1 ? prod[0].key : 0}
              >
                <option disabled value="0">
                  Select a key
                </option>
                {Gamme.map((g) => {
                  return (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  );
                })}
              </select>
            </div>
          </li>
          <li className="necessary">
            <label>Price</label>
            <div className="input flex">
              <input
                required={idEdit == 0}
                step="0.01"
                name="price"
                type="number"
                min="0"
                max="1000"
                onChange={handleChange}
                placeholder="Set a price"
                defaultValue={prod.length == 1 ? prod[0].price : ""}
              />
            </div>
            {newProd.price == 0 ? (
              <p style={{ width: "6rem" }} className="info">
                [FREE] will appear
              </p>
            ) : (
              <></>
            )}
          </li>
          <li className="necessary">
            <label>Date</label>
            <div className="input flex">
              <input
                required={idEdit == 0}
                type="date"
                name="releaseDate"
                placeholder="Realease Date"
                onChange={handleChange}
                defaultValue={prod.length == 1 ? prod[0].releaseDate : ""}
              />
            </div>
          </li>
          <li className="necessary">
            <label>Type Beat</label>
            <div className="input flex">
              <select
                required={idEdit == 0}
                name="idTB"
                onChange={handleChange}
                defaultValue={prod.length == 1 ? prod[0].name : 0}
              >
                <option disabled value="0">
                  Select a Type Beat
                </option>
                {typeBeat.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
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
