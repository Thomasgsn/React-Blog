import { useEffect, useState } from "react";

const Follow = () => {
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/home")
      .then((response) => response.json())
      .then((blogs) => {
        setBlog(blogs);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, []);

  return (
    <div className="myPlaylistSection">
      <p>Follow</p>
    </div>
  );
};
export default Follow;
