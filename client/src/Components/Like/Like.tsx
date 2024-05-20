import { useEffect, useState } from "react";
import { BlogImage, BlogInfo, UserInfo } from "../../utils/type";

import Info from "../assets/Info/Info";
import Topbar from "../assets/Topbar/HomeTopbar/HomeTopbar";
import SelectedBlogs from "../assets/SelectedBlogs/SelectedBlogs";

import "./Like.css";

const Like = ({ userInfo }: { userInfo: UserInfo }) => {
  const [blogs, setBlogs] = useState<BlogInfo[]>([]);
  const [imagesBlogs, setImagesBlogs] = useState<BlogImage[]>([]);
  const [sortBy, setSortBy] = useState<string>("date");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetch(
      `http://localhost:8081/like?currentuser=${userInfo.id}&search=${search}&sortBy=${sortBy}`
    )
      .then((response) => response.json())
      .then((res) => {
        setBlogs(res.blogs);
        setImagesBlogs(res.blogsImages);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [search, sortBy, userInfo.id]);

  return (
    <div className="container">
      <Topbar {...{ userInfo, search, setSearch }} />
      <div className="mainContent">
        <div className="flex">
          <Info categoryName={undefined} {...{ blogs, sortBy, setSortBy }} />
          <SelectedBlogs {...{ userInfo, blogs, imagesBlogs }} />
        </div>
      </div>
    </div>
  );
};

export default Like;
