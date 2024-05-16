import { useEffect, useState } from "react";
import { BlogInfo, UserInfo } from "../../../utils/type";
import SelectedBlogs from "../../assets/SelectedBlogs/SelectedBlogs";

const Follow = ({ userInfo }: { userInfo: UserInfo }) => {
  const [blogs, setBlogs] = useState<BlogInfo[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8081/follow?currentuser=${userInfo.id}`)
      .then((response) => response.json())
      .then((blogs) => {
        setBlogs(blogs);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [userInfo.id]);

  return (
    <>
      <SelectedBlogs {...{ blogs }} />
    </>
  );
};

export default Follow;
