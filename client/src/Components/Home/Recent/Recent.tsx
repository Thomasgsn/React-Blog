import { useEffect, useState } from "react";
import { BlogInfo } from "../../../utils/type";
import SelectedBlogs from "../../assets/SelectedBlogs/SelectedBlogs";

const Recent = () => {
  const [blogs, setBlogs] = useState<BlogInfo[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/home")
      .then((response) => response.json())
      .then((blogs) => {
        setBlogs(blogs);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, []);

  return (
    <>
      <SelectedBlogs {...{ blogs }} />
    </>
  );
};

export default Recent;
