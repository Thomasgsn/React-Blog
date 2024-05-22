import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconEraser,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { BlogImage, BlogInfo, UserInfo } from "../../utils/type";

import axios from "axios";
import EditBlog from "./EditBlog/EditBlog";
import Topbar from "../assets/Topbar/Topbar/Topbar";

import "./Edit.css";

const Edit = ({ userInfo }: { userInfo: UserInfo }) => {
  const [myBlogs, setMyBlogs] = useState<BlogInfo[]>([]);
  const [myBlogsImg, setMyBlogsImg] = useState<BlogImage[]>([]);

  const [edit, setEdit] = useState<boolean>(false);
  const [idEdit, setIdEdit] = useState<number>(0);

  useEffect(() => {
    fetch(
      `${
        idEdit == 0
          ? `http://localhost:8081/edit/${userInfo.id}`
          : `http://localhost:8081/editblog?blog=${idEdit}`
      }`
    )
      .then((response) => response.json())
      .then((result) => {
        setMyBlogs(result.myblogs);
        setMyBlogsImg(result.myblogsImages);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [idEdit, userInfo.id]);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure to delete this Blog ?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8081/blog/${id}`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openEdit = (id: number) => {
    setEdit(true);
    setIdEdit(id);
  };

  const [rev, setRev] = useState(false);
  const invertOrder = () => {
    setMyBlogs((prev) => [...prev].reverse());
    setRev(!rev);
  };

  const Content = () => {
    if (!edit) {
      if (myBlogs.length > 0) {
        return (
          <div className="tableInfo">
            <table className="hovered">
              <caption>Number of Blog : {myBlogs.length}</caption>
              <thead>
                <tr className="start">
                  <th className="click flex" scope="col" onClick={invertOrder}>
                    id{rev ? <IconChevronDown /> : <IconChevronUp />}
                  </th>
                  <th scope="col">Title</th>
                  <th scope="col">Text</th>
                  <th scope="col">Tags</th>
                  <th scope="col">Category</th>
                  <th scope="col">Images</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {myBlogs.map((b) => (
                  <tr key={b.id}>
                    <th scope="row">{b.id}</th>
                    <td>{b.title}</td>
                    <td>{b.text}</td>
                    <td className="tags">
                      {b.tag.split("; ").map((tag) => (
                        <p key={tag.replace(";", "")}>{tag.replace(";", "")}</p>
                      ))}
                    </td>
                    <td>{b.category}</td>
                    <td>
                      {myBlogsImg && (
                        <Carousel>
                          {myBlogsImg
                            .filter((bi) => b.id === bi.idBlog)
                            .map((bi) => (
                              <div key={bi.id}>
                                <img
                                  src={`/blogs/${bi.name}`}
                                  alt="Image of blog"
                                />
                              </div>
                            ))}
                        </Carousel>
                      )}
                    </td>
                    <td>
                      <IconEdit
                        onClick={() => openEdit(b.id)}
                        className="icon"
                      />
                      <IconEraser
                        onClick={() => handleDelete(b.id)}
                        className="icon"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else {
        return (
          <div className="noBlog">
            <p>No Blog</p>
          </div>
        );
      }
    } else {
      return <EditBlog {...{ myBlogs, myBlogsImg, idEdit, setIdEdit, setEdit }} />;
    }
  };

  return (
    <div className="container">
      <Topbar {...{ userInfo }} />
      <div className="mainContent">
        <p className="title">Edit Blog</p>
        <div className="bottom flex">
          <Content />
        </div>
      </div>
    </div>
  );
};

export default Edit;
