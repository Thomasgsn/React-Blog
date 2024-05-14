import { useEffect, useState } from "react";

const Recent = () => {
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
    <>
    <div className="blog">
          <div className="img">
            <img src="https://imgs.search.brave.com/2b-Uo-puBDxcXx5DLraCYgOyptGt7vj1ecgCIQw8-Ms/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzQ1LzA1Lzky/LzM2MF9GXzM0NTA1/OTIzMl9DUGllVDhS/SVdPVWs0SnFCa2tX/a0lFVFlBa216MmI3/NS5qcGc" /></div>
          <div className="info flex">
            <p>b.id</p>
            <p>b.name</p>
            <p>b.username</p>
          </div>
        </div>
      {blog.map((b) => (
        <div className="blog">
          <div className="img">
            <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8MTkyMHgxMDgwfGVufDB8fDB8fHww" />
          </div>
          <div className="info flex">
            <p>{b.id}</p>
            <p>{b.name}</p>
            <p>{b.username}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Recent;
