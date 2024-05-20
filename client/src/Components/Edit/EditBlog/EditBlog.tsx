import { useNavigate } from "react-router-dom";
import { BlogInfo, Category } from "../../../utils/type";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IconSend, IconX } from "@tabler/icons-react";

import axios from "axios";
import { Carousel } from "react-responsive-carousel";

interface BlogDate {
  releaseDate: string;
}

interface EditProps {
  myBlogs: BlogInfo[];
  idEdit: number;
  setIdEdit: Dispatch<SetStateAction<number>>;
  setEdit: Dispatch<SetStateAction<boolean>>;
}

const Edit: React.FC<EditProps> = ({ myBlogs, idEdit, setIdEdit, setEdit }) => {
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

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    // if (coverFile) {
    //   formData.append("cover", coverFile);
    // }

    try {
      await axios.post(`http://localhost:8081/updateblog/${idEdit}`, formData);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    setEdit(false);
    setIdEdit(0);
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
            {/* <Carousel autoPlay dynamicHeight infiniteLoop>
            {newBlog.image.map((img, index) => (
              <div key={index}>
                <img src={`/blogs/${img.name}`} alt={newBlog.title} />
              </div>
            ))}
          </Carousel> */}
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
