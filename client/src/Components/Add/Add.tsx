import { useEffect, useState } from "react";
import { IconSend } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { BlogInfo, Category, UserInfo } from "../../utils/type";
import axios from "axios";
import "./Add.css";
import Topbar from "../assets/Topbar/Topbar/Topbar";

interface BlogDate {
  releaseDate: string;
}

const Add = ({ userInfo }: { userInfo: UserInfo }) => {
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

  useEffect(() => {
    setNewBlog((prev) => ({ ...prev, idUser: userInfo.id }));
  }, [userInfo.id]);

  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file3, setFile3] = useState<File | null>(null);
  const [file4, setFile4] = useState<File | null>(null);
  const [file5, setFile5] = useState<File | null>(null);

  const [imagePreview1, setPreview1] = useState<string | undefined>(undefined);
  const [imagePreview2, setPreview2] = useState<string | undefined>(undefined);
  const [imagePreview3, setPreview3] = useState<string | undefined>(undefined);
  const [imagePreview4, setPreview4] = useState<string | undefined>(undefined);
  const [imagePreview5, setPreview5] = useState<string | undefined>(undefined);

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

  useEffect(() => {
    const fetchCategs = async () => {
      try {
        const response = await axios.get("http://localhost:8081/reqcateg");
        setCategs(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchCategs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newBlog.idCategory === 0) {
      alert("Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("newBlog", JSON.stringify(newBlog));
    formData.append("date", dateNow.toISOString());

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
      await axios.post("http://localhost:8081/addblog", formData);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const thisYear = new Date().getFullYear();

  const BlogDate = (b: BlogDate) => {
    const minute = b.releaseDate.split("T")[1].split(":")[1];
    const hour = b.releaseDate.split("T")[1].split(":")[0];

    const day = b.releaseDate.split("T")[0].split("-")[2];
    const month = parseInt(b.releaseDate.split("T")[0].split("-")[1]);
    const year = parseInt(b.releaseDate.split("T")[0].split("-")[0]);

    const monthName = [
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

    const date = `${day} ${monthName[month - 1]} ${
      year === thisYear ? `at ${hour}:${minute}` : year
    }`;

    return date;
  };

  const dateNow = new Date();
  dateNow.setHours(dateNow.getHours() + 2);
  newBlog.releaseDate = dateNow.toISOString();

  return (
    <div className="container">
      <Topbar {...{ userInfo }} />
      <div className="mainContent">
        <p className="title">Add Blog</p>
        <div className="bottom flex">
          <div className="editBlog">
            <form
              className="exemple"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
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
                        placeholder="Title of this blog"
                      />
                    </div>
                    <div>
                      <span>Category : </span>
                      <select
                        required
                        name="idCategory"
                        onChange={handleChange}
                      >
                        <option disabled selected value="0">
                          Select a category
                        </option>
                        {category.map((c) => (
                          <option key={c.id} value={c.id}>
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
                              {userInfo.username}
                            </p>
                            <p className="date">
                              {BlogDate({ releaseDate: dateNow.toISOString() })}
                            </p>
                          </div>
                          <div className="avatar flex">
                            <img
                              src={`/avatars/${userInfo.avatar}`}
                              alt={`${userInfo.username} avatar`}
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
                    placeholder="Content of this blog"
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
                      name="tag"
                      type="text"
                      className="tag"
                      onChange={handleChange}
                      placeholder="Some tag (separate with a ;)"
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
                        {file1 ? "Change" : "Choose"} the first Image
                      </label>
                      <input
                        id="file1"
                        type="file"
                        className="input-file"
                        onChange={(e) =>
                          handleImageChange(e, setFile1, setPreview1)
                        }
                      />
                      <label
                        htmlFor="file2"
                        className={file1 ? "" : "disabled"}
                      >
                        {file2 ? "Change" : "Choose"} the second Image
                      </label>
                      <input
                        id="file2"
                        type="file"
                        disabled={!file1}
                        className="input-file"
                        onChange={(e) =>
                          handleImageChange(e, setFile2, setPreview2)
                        }
                      />
                      <label
                        htmlFor="file3"
                        className={file2 ? "" : "disabled"}
                      >
                        {file3 ? "Change" : "Choose"} the third Image
                      </label>
                      <input
                        id="file3"
                        type="file"
                        disabled={!file2}
                        className="input-file"
                        onChange={(e) =>
                          handleImageChange(e, setFile3, setPreview3)
                        }
                      />
                      <label
                        htmlFor="file4"
                        className={file3 ? "" : "disabled"}
                      >
                        {file4 ? "Change" : "Choose"} the fourth Image
                      </label>
                      <input
                        id="file4"
                        type="file"
                        disabled={!file3}
                        className="input-file"
                        onChange={(e) =>
                          handleImageChange(e, setFile4, setPreview4)
                        }
                      />
                      <label
                        htmlFor="file5"
                        className={file4 ? "" : "disabled"}
                      >
                        {file5 ? "Change" : "Choose"} the fifth Image
                      </label>
                      <input
                        id="file5"
                        type="file"
                        disabled={!file4}
                        className="input-file"
                        onChange={(e) =>
                          handleImageChange(e, setFile5, setPreview5)
                        }
                      />
                    </div>
                    <div className="imagePreview flex">
                      <div>
                        {file1 && (
                          <img src={imagePreview1} alt="previewImage1" />
                        )}
                      </div>
                      <div>
                        {file2 && (
                          <img src={imagePreview2} alt="previewImage2" />
                        )}
                      </div>
                      <div>
                        {file3 && (
                          <img src={imagePreview3} alt="previewImage3" />
                        )}
                      </div>
                      <div>
                        {file4 && (
                          <img src={imagePreview4} alt="previewImage4" />
                        )}
                      </div>
                      <div>
                        {file5 && (
                          <img src={imagePreview5} alt="previewImage5" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn send flex">
                Add
                <IconSend size={50} className="icon" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
