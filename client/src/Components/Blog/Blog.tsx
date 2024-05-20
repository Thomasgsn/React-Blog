import { UserInfo, BlogInfo } from "../../utils/type";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ThisBlog from "./ThisBlog/ThisBlog";
import Topbar from "../assets/Topbar/Topbar/Topbar";

interface Comments {
  id: number;
  text: string;
  idUser: number;
  idBlog: number;
  username: string;
}

const Blog = ({ userInfo }: { userInfo: UserInfo }) => {
  const navigateTo = useNavigate();

  const id = Number(useParams().id);

  const [blog, setBlog] = useState<BlogInfo>({
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
  const [comment, setComment] = useState<Comments[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8081/blog/${id}`)
      .then((response) => response.json())
      .then((result) => {
        setBlog(result.blogDetail[0]);
        setBlog((prev) => ({ ...prev, image: result.blogImage }));
        setComment(result.blogComment);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [id]);

  if (isNaN(id)) {
    return (
      <div className="container">
        <Topbar {...{ userInfo }} />
        <div className="mainContent">
          <div className="bottom flex">We cannot access to this blog...</div>
          <button className="btn" onClick={() => navigateTo("/home")}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Topbar {...{ userInfo }} />
      <div className="mainContent blog">
        <div className="bottom flex">
          <ThisBlog {...{ userInfo, blog, comment, setComment }} />
        </div>
      </div>
    </div>
  );
};

export default Blog;
