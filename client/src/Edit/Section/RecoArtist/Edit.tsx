import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowBarRight, IconArrowRight, IconX } from "@tabler/icons-react";
import axios from "axios";

interface Artist {
  id: number;
  artistName: string;
}

interface EditProps {
  artistReco: Artist[];
  idEdit: number;
  setIdEdit: (id: number) => void;
  setEdit: (edit: boolean) => void;
}

const Edit: React.FC<EditProps> = ({
  artistReco,
  idEdit,
  setIdEdit,
  setEdit,
}) => {
  const navigateTo = useNavigate();
  const [artist, setArtist] = useState<Artist>({ id: 0, artistName: "" });
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (artistReco.length === 1) {
      setArtist(artistReco[0]);
    }
  }, [artistReco]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[0];

      if (!selectedFile.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        event.target.value = "";
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setArtist((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("artist", JSON.stringify(artist));

    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post("http://localhost:8081/crudArtistReco", formData);
      navigateTo("/edit/recoartist");
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
      {artistReco.length === 1 ? (
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
                <th scope="row">{artistReco[0].id}</th>
                <td>{artistReco[0].artistName}</td>
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
                <th scope="row">{artist.id}</th>
                <td>{artist.artistName}</td>
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
                <th scope="col">Image</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{artist.id}</th>
                <td>{artist.artistName}</td>
                <td>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      className="square"
                      alt={artist.artistName}
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="headEditTable">
        <div className="flex">
          <IconX onClick={handleClose} className="icon closeForm" />
          <h1>Artist recommendation</h1>
        </div>
        <p className="info">
          if a field is marked with a *, this means that the field is mandatory
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <ul className="editTable">
          <li className="necessary">
            <label htmlFor="artistName">Artist name</label>
            <div className="input flex">
              <input
                required
                type="text"
                name="artistName"
                onChange={handleChange}
                value={artist.artistName}
                placeholder={
                  artistReco.length === 1
                    ? artistReco[0].artistName
                    : "Artist name"
                }
              />
            </div>
          </li>
          <li className="necessary">
            <label htmlFor="artistImg">Artist Image</label>
            <div className="input flex">
              <input
                type="file"
                name="artistImg"
                onChange={handleFileChange}
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
          <li>
            <button type="submit" className="btn flex submit">
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
