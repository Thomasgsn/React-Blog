import { useEffect, useState } from "react";
import { BlogInfo, BlogImage, UserInfo } from "../../../utils/type";

import Info from "../../assets/Info/Info";
import SelectedBlogs from "../../assets/SelectedBlogs/SelectedBlogs";

const Recent = ({
  search,
  userInfo,
}: {
  search: string;
  userInfo: UserInfo;
}) => {
  const [blogs, setBlogs] = useState<BlogInfo[]>([]);
  const [imagesBlogs, setImagesBlogs] = useState<BlogImage[]>([]);
  const [sortBy, setSortBy] = useState<string>("date");

  useEffect(() => {
    fetch(`http://localhost:8081/home?search=${search}&sortBy=${sortBy}`)
      .then((response) => response.json())
      .then((res) => {
        setBlogs(res.blogs);
        setImagesBlogs(res.blogsImages);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [search, sortBy]);

  return (
    <>
      <Info categoryName={undefined} {...{ blogs, sortBy, setSortBy }} />
      <SelectedBlogs {...{ userInfo, blogs, imagesBlogs }} />
    </>
  );
};

export default Recent;
