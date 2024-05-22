import { useNavigate } from "react-router-dom";
import { IconSend, IconX } from "@tabler/icons-react";
import { BlogImage, BlogInfo, Category } from "../../../utils/type";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import axios from "axios";

interface BlogDate {
  releaseDate: string;
}

interface EditProps {
  myBlogs: BlogInfo[];
  myBlogsImg: BlogImage[];
  idEdit: number;
  setIdEdit: Dispatch<SetStateAction<number>>;
  setEdit: Dispatch<SetStateAction<boolean>>;
}

const Edit: React.FC<EditProps> = ({
  myBlogs,
  myBlogsImg,
  idEdit,
  setIdEdit,
  setEdit,
}) => {
  const navigateTo = useNavigate();

  const [category, setCategs] = useState<Category[]>([]);
  const [newBlog, setNewBlog] = useState<BlogInfo>({
    id: 0,
    title: "",
    text: "",
    idUser: 0,
    tag: "",
    releaseDate: "",
    idCategory: 0,
    username: "",
    avatar: "",
    category: "",
    image: [],
  });

  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file3, setFile3] = useState<File | null>(null);
  const [file4, setFile4] = useState<File | null>(null);
  const [file5, setFile5] = useState<File | null>(null);

  const [imagePreview1, setPreview1] = useState<string | undefined>(
    myBlogsImg[0] ? `/blogs/${myBlogsImg[0].name}` : undefined
  );
  const [imagePreview2, setPreview2] = useState<string | undefined>(
    myBlogsImg[1] ? `/blogs/${myBlogsImg[1].name}` : undefined
  );
  const [imagePreview3, setPreview3] = useState<string | undefined>(
    myBlogsImg[2] ? `/blogs/${myBlogsImg[2].name}` : undefined
  );
  const [imagePreview4, setPreview4] = useState<string | undefined>(
    myBlogsImg[3] ? `/blogs/${myBlogsImg[3].name}` : undefined
  );
  const [imagePreview5, setPreview5] = useState<string | undefined>(
    myBlogsImg[4] ? `/blogs/${myBlogsImg[4].name}` : undefined
  );

  useEffect(() => {
    const fetchTypeBeat = async () => {
      try {
        const response = await axios.get("http://localhost:8081/reqcateg");
        setCategs(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchTypeBeat();
  }, []);

  useEffect(() => {
    if (myBlogs.length === 1) {
      setNewBlog(myBlogs[0]);
    }
  }, [myBlogs]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | undefined>>
  ) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[0];

      if (!selectedFile.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        event.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);

      setFile(selectedFile);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("newBlog", JSON.stringify(newBlog));

    if (file1) {
      formData.append("image", file1);
      if (file2) {
        formData.append("image", file2);
        if (file3) {
          formData.append("image", file3);
          if (file4) {
            formData.append("image", file4);
            if (file5) {
              formData.append("image", file5);
            }
          }
        }
      }
    }

    try {
      await axios.post(`http://localhost:8081/updateblog/${idEdit}`, formData);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    const confirmClose = window.confirm(
      "Are you sure to delete modification ?"
    );
    if (confirmClose) {
      setEdit(false);
      setIdEdit(0);
    }
  };

  const thisYear = new Date().getFullYear();

  const BlogDate = (b: BlogDate) => {
    const minute = b.releaseDate.split("T")[1].split(":")[1];
    const hour = b.releaseDate.split("T")[1].split(":")[0];

    const day = b.releaseDate.split("T")[0].split("-")[2];
    const mounth = parseInt(b.releaseDate.split("T")[0].split("-")[1]);
    const year = parseInt(b.releaseDate.split("T")[0].split("-")[0]);

    const mounthName = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = `${day} ${mounthName[mounth - 1]} ${
      year == thisYear ? `at ${hour} : ${minute}` : year
    }`;

    return date;
  };

  return (
    <div className="editBlog">
      <button className="btn" onClick={() => console.log(myBlogsImg)}>
        text
      </button>
      <button className="btn close" onClick={handleClose}>
        <IconX size={50} />
      </button>
      <form className="exemple" onSubmit={handleSubmit}>
        <div className="thisBlog">
          <div className="blogContent">
            <div className="flex head">
              <div>
                <span>Title : </span>
                <input
                  required
                  type="text"
                  name="title"
                  maxLength={23}
                  onChange={handleChange}
                  placeholder={newBlog.title}
                  defaultValue={newBlog.title}
                ></input>
              </div>
              <div>
                <span>Category : </span>
                <select name="idCategory" required onChange={handleChange}>
                  {category.map((c) => (
                    <option value={c.id} selected={c.id == newBlog.idCategory}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex author">
                  <div className="flex">
                    <div className="dateName">
                      <p
                        className="name"
                        onClick={() => navigateTo(`/u/${newBlog.idUser}`)}
                      >
                        {newBlog.username}
                      </p>
                      {newBlog.releaseDate && (
                        <p className="date">
                          <BlogDate releaseDate={newBlog.releaseDate} />
                        </p>
                      )}
                    </div>
                    <div className="avatar flex">
                      <img
                        src={`/avatars/${newBlog.avatar}`}
                        alt={`${newBlog.username} avatar`}
                        onClick={() => navigateTo(`/u/${newBlog.idUser}`)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span>Text :</span>
            <textarea
              required
              name="text"
              onChange={handleChange}
              placeholder={newBlog.text}
              defaultValue={newBlog.text}
              style={{
                width: "100%",
                height: "300px",
                padding: "10px",
                borderRadius: "10px",
              }}
            />
            <label>Tags :</label>
            <div className="input">
              <input
                required
                name="tag"
                type="text"
                className="tag"
                onChange={handleChange}
                placeholder={newBlog.tag}
                defaultValue={newBlog.tag}
              />
            </div>
            <p
              className="info"
              onClick={() => {
                navigator.clipboard.writeText(";");
                alert("; is copied to clipboard");
              }}
              style={{ width: "10.5rem" }}
            >
              separate each beatmaker with ;
            </p>
            <div className="image">
              <div className="flex">
                <label htmlFor="file1">
                  {imagePreview1 ? "Change" : "Choose"} the first Image
                </label>
                <input
                  id="file1"
                  type="file"
                  className="input-file"
                  onChange={(e) => handleImageChange(e, setFile1, setPreview1)}
                />
                <label htmlFor="file2" className={imagePreview1 ? "" : "disabled"}>
                  {imagePreview2 ? "Change" : "Choose"} the second Image
                </label>
                <input
                  id="file2"
                  type="file"
                  disabled={!imagePreview1}
                  className="input-file"
                  onChange={(e) => handleImageChange(e, setFile2, setPreview2)}
                />
                <label htmlFor="file3" className={imagePreview2 ? "" : "disabled"}>
                  {imagePreview3 ? "Change" : "Choose"} the third Image
                </label>
                <input
                  id="file3"
                  type="file"
                  disabled={!imagePreview2}
                  className="input-file"
                  onChange={(e) => handleImageChange(e, setFile3, setPreview3)}
                />
                <label htmlFor="file4" className={imagePreview3 ? "" : "disabled"}>
                  {imagePreview4 ? "Change" : "Choose"} the fourth Image
                </label>
                <input
                  id="file4"
                  type="file"
                  disabled={!imagePreview3}
                  className="input-file"
                  onChange={(e) => handleImageChange(e, setFile4, setPreview4)}
                />
                <label htmlFor="file5" className={imagePreview4 ? "" : "disabled"}>
                  {imagePreview5 ? "Change" : "Choose"} the fifth Image
                </label>
                <input
                  id="file5"
                  type="file"
                  disabled={!imagePreview4}
                  className="input-file"
                  onChange={(e) => handleImageChange(e, setFile5, setPreview5)}
                />
              </div>
              <div className="imagePreview flex">
                <div>
                  {imagePreview1 && (
                    <img src={imagePreview1} alt="previewImage1" />
                  )}
                </div>
                <div>
                  {imagePreview2 && (
                    <img src={imagePreview2} alt="previewImage2" />
                  )}
                </div>
                <div>
                  {imagePreview3 && (
                    <img src={imagePreview3} alt="previewImage3" />
                  )}
                </div>
                <div>
                  {imagePreview4 && (
                    <img src={imagePreview4} alt="previewImage4" />
                  )}
                </div>
                <div>
                  {imagePreview5 && (
                    <img src={imagePreview5} alt="previewImage5" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn send flex">
          Update
          <IconSend size={50} className="icon" />
        </button>
      </form>
    </div>
  );
};

export default Edit;
