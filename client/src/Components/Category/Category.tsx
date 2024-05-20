import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlogImage, BlogInfo, UserInfo } from "../../utils/type";

import Info from "../assets/Info/Info";
import Topbar from "../assets/Topbar/HomeTopbar/HomeTopbar";
import SelectedBlogs from "../assets/SelectedBlogs/SelectedBlogs";

import "./Category.css";

const Category = ({ userInfo }: { userInfo: UserInfo }) => {
  const { categoryName } = useParams<string>();
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [blogs, setBlogs] = useState<BlogInfo[]>([]);
  const [imagesBlogs, setImagesBlogs] = useState<BlogImage[]>([]);

  useEffect(() => {
    fetch(
      `http://localhost:8081/category/${categoryName}?search=${search}&sortBy=${sortBy}`
    )
      .then((response) => response.json())
      .then((res) => {
        setBlogs(res.blogs);
        setImagesBlogs(res.blogsImages);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [categoryName, search, sortBy]);

  return (
    <div className="container">
      <Topbar
        {...{
          userInfo,
          search,
          setSearch,
        }}
      />
      <div className="mainContent">
        <Info {...{ blogs, categoryName, sortBy, setSortBy }} />
        <div className="flex">
          <SelectedBlogs
            {...{
              userInfo,
              blogs,
              imagesBlogs,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Category;
