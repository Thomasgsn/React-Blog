import { IconArrowBack, IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BlogInfo, UserInfo } from "../../../utils/type";

import axios from "axios";
import Loader from "../../../utils/Loader";

import "./ThisBlog.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface Comments {
  id: number;
  text: string;
  idUser: number;
  idBlog: number;
  username: string;
}

interface BlogDate {
  releaseDate: string;
}

const ThisBlog = ({
  userInfo,
  blog,
  comment,
  setComment,
}: {
  userInfo: UserInfo;
  blog: BlogInfo;
  comment: Comments[];
  setComment: Dispatch<SetStateAction<Comments[]>>;
}) => {
  const navigateTo = useNavigate();
  const [allowBack, setAllowBack] = useState<boolean>(false);
  const [writeComment, setWritting] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<Comments>({
    id: 0,
    text: "",
    idUser: userInfo.id,
    idBlog: blog ? blog.id : 0,
    username: userInfo.username,
  });

  useEffect(() => {
    setNewComment((prev) => ({ ...prev, idUser: userInfo.id }));
    setNewComment((prev) => ({ ...prev, idBlog: blog.id }));
  }, [blog.id, userInfo.id]);

  setTimeout(() => {
    setAllowBack(true);
  }, 3000);

  const Return = () => {
    return (
      allowBack && (
        <button onClick={() => navigateTo("/home")} className="btn flex">
          Go back
          <IconArrowBack className="icon" />
        </button>
      )
    );
  };

  if (!blog) {
    return (
      <div className="flex" style={{ flexDirection: "column" }}>
        <Loader />
        <Return />
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8081/newcomment", newComment);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8081/comment/${id}`);
      setComment((prev) => prev.filter((comment) => comment.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const text = (text: string) => {
    return text.split("\n").map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
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

  return blog.releaseDate ? (
    <div className="thisBlog">
      <button onClick={() => navigateTo("/home")} className="goBack btn flex">
        <IconArrowLeft className="icn" />
        Go back
      </button>
      <div className="flex blog">
        <div className="blogContent">
          <div className="flex head">
            <h1>{blog.title} -</h1>
            <div>
              <div className="flex author">
                <div className="flex">
                  <div className="dateName">
                    <p
                      className="name"
                      onClick={() => navigateTo(`/u/${blog.idUser}`)}
                    >
                      {blog.username}
                    </p>
                    <p className="date">
                      <BlogDate releaseDate={blog.releaseDate} />
                    </p>
                  </div>
                  <div className="avatar flex">
                    <img
                      src={`/avatars/${blog.avatar}`}
                      alt={`${blog.username} avatar`}
                      onClick={() => navigateTo(`/u/${blog.idUser}`)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p>{text(blog.text)}</p>
          <Carousel autoPlay dynamicHeight infiniteLoop>
            {blog.image.map((img, index) => (
              <div key={index}>
                <img src={`/blogs/${img.name}`} alt={blog.title} />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="blogComment">
          <div className="commentDiv">
            <h3 className="divTitle">{blog.title} - Comments :</h3>
            <ul className="menuList grid">
              {comment.map((c) => (
                <li key={c.id} className="listItem">
                  <a href={`/u/${c.idUser}`}>{c.username}</a>
                  <br />
                  {(c.idUser === userInfo.id || userInfo.role == "admin") && (
                    <button className="btn del">
                      <IconTrash
                        className="icon"
                        size={18}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this item ?"
                            )
                          ) {
                            handleDelete(c.id);
                          }
                        }}
                      />
                    </button>
                  )}
                  <span>{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div
            onClick={() => !writeComment && setWritting(true)}
            className="addComment flex"
          >
            {!writeComment ? (
              <p className="add">Add a comment</p>
            ) : (
              <form className="flex" onSubmit={handleSubmit} method="POST">
                <p className="cancel" onClick={() => setWritting(false)}>
                  Cancel
                </p>
                <input
                  type="text"
                  name="text"
                  maxLength={150}
                  autoFocus
                  onChange={handleChange}
                />
                <button className="send btn" type="submit">
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex" style={{ flexDirection: "column" }}>
      <Loader />
      <Return />
    </div>
  );
};

export default ThisBlog;
