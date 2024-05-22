import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconHeart } from "@tabler/icons-react";
import { Carousel } from "react-responsive-carousel";
import { BlogInfo, BlogImage, UserInfo, Liked } from "../../../utils/type";

import axios from "axios";

import "./SelectedBlogs.css";

interface BlogDate {
  releaseDate: string;
}

const SelectedBlogs = ({
  userInfo,
  blogs,
  imagesBlogs,
}: {
  userInfo: UserInfo;
  blogs: BlogInfo[];
  imagesBlogs: BlogImage[];
}) => {
  const navigateTo = useNavigate();

  const [liked, setLiked] = useState<Liked[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8081/reqlike/${userInfo.id}`)
      .then((response) => response.json())
      .then((likes) => {
        setLiked(likes);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [userInfo.id]);

  const thisYear = new Date().getFullYear();
  const BlogDate = (b: BlogDate) => {
    const day = b.releaseDate.split("T")[0].split("-")[2];
    const mounth = parseInt(b.releaseDate.split("T")[0].split("-")[1]);
    const year = parseInt(b.releaseDate.split("T")[0].split("-")[0]);
    let minute;
    let hour;

    if (year == thisYear) {
      minute = b.releaseDate.split("T")[1].split(":")[1];
      hour = b.releaseDate.split("T")[1].split(":")[0];
    }

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

  const text = (text: string) => {
    return text.split("\n").map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
  };

  const like = async (e: number) => {
    try {
      await axios.post(`http://localhost:8081/like/${userInfo.id}/${e}`);
      const newLike = { idUser: userInfo.id, idBlog: e };
      setLiked((prevLikedItems) => {
        const isLiked = prevLikedItems.find(
          (like) =>
            like.idUser === newLike.idUser && like.idBlog === newLike.idBlog
        );
        if (isLiked) {
          return prevLikedItems.filter(
            (like) =>
              like.idUser !== newLike.idUser || like.idBlog !== newLike.idBlog
          );
        } else {
          return [...prevLikedItems, newLike];
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const isLiked = (blogId: number) => {
    return liked.some(
      (like) => like.idUser === userInfo.id && like.idBlog === blogId
    );
  };

  return (
    <div className="blogs grid">
      {blogs && blogs.length > 0 ? (
        blogs.map((b) => {
          const blogImages = imagesBlogs.filter(
            (image) => image.idBlog === b.id
          );
          return (
            <div key={b.id} className="blog">
              <div
                className="info flex"
                style={{
                  borderRadius:
                    blogImages.length > 0 ? "1rem 1rem 0 0" : "1rem",
                }}
              >
                <div className="flex author">
                  <div className="flex">
                    <div className="avatar flex">
                      <img
                        src={`/avatars/${b.avatar}`}
                        alt={`${b.username} avatar`}
                        onClick={() => navigateTo(`/u/${b.idUser}`)}
                      />
                    </div>
                    <div>
                      <p
                        className="name"
                        onClick={() => navigateTo(`/u/${b.idUser}`)}
                      >
                        {b.username}
                      </p>
                      <p className="date">
                        <BlogDate releaseDate={b.releaseDate} />
                      </p>
                    </div>
                  </div>
                  <a className="btn flex" href={`/category/${b.category}`}>
                    {b.category}
                  </a>
                </div>
                <p className="title">{b.title} -</p>
                <p className="text">{text(b.text)}</p>
                <div className="seeMore flex">
                  <div className="btn flex like" onClick={() => like(b.id)}>
                    <IconHeart
                      className={isLiked(b.id) ? "icn isLiked" : "icn"}
                    />
                  </div>
                  <a className="btn flex goBlog" href={`/blog/${b.id}`}>
                    See more
                  </a>
                </div>
              </div>

              {blogImages.length > 0 ? (
                <div className="img flex">
                  <Carousel
                    autoPlay
                    infiniteLoop
                    dynamicHeight
                    showThumbs={false}
                  >
                    {blogImages.map((img, index) => (
                      <div key={index}>
                        <img
                          className="blogImage"
                          src={`/blogs/${img.name}`}
                          alt={b.title}
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              ) : (
                <></>
              )}
            </div>
          );
        })
      ) : (
        <p>No blogs found</p>
      )}
    </div>
  );
};

export default SelectedBlogs;
