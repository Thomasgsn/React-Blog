import { UserInfo } from "./utils/type";
import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import OnEnter from "./Components/User/OnEnter/OnEnter";
import Login from "./Components/User/Login/Login";
import Register from "./Components/User/Register/Register";

import Home from "./Components/Home/Home";
import Followers from "./Components/Followers/Followers";
import Add from "./Components/Add/Add";
import Edit from "./Components/Edit/Edit";
import Like from "./Components/Like/Like";

import Blog from "./Components/Blog/Blog";
import Category from "./Components/Category/Category";
import U from "./Components/User/U/U";

import axios from "axios";

import "./App.css";

function App() {
  const [id, setId] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: 0,
    firstname: "",
    lastname: "",
    username: "",
    avatar: "",
    detail: "",
    email: "",
    role: "",
  });

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8081/user")
      .then((res) => {
        if (res.data.valid) {
          setId(res.data.id);
        }
      })
      .catch((err) => console.log(err));

    if (id) {
      axios
        .get(`http://localhost:8081/api/user/${id}`)
        .then((response) => {
          setUserInfo(response.data.result[0]);
        })
        .catch((error) => {
          console.error(
            "Une erreur s'est produite lors de la récupération des informations utilisateur:",
            error
          );
        });
    }
  }, [id]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <OnEnter />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home {...{ userInfo }} />,
    },
    {
      path: "/followers",
      element: <Followers {...{ userInfo }} />,
    },
    {
      path: "/add",
      element: <Add {...{ userInfo }} />,
    },
    {
      path: "/edit",
      element: <Edit {...{ userInfo }} />,
    },

    {
      path: "/like",
      element: <Like {...{ userInfo }} />,
    },
    {
      path: "/blog/:id",
      element: <Blog {...{ userInfo }} />,
    },
    {
      path: "/category/:categoryName",
      element: <Category {...{ userInfo }} />,
    },
    {
      path: "/u/:id",
      element: <U {...{ userInfo }} />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
