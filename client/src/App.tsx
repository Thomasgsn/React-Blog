import { UserInfo } from "./utils/type";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./Components/User/Login/Login";
import Register from "./Components/User/Register/Register";
import OnEnter from "./Components/User/OnEnter/OnEnter";
import Home from "./Components/Home/Home";
import Shop from "./Components/Shop/Shop";
import Prods from "./Components/Prods/Prods";
import Prod from "./Components/Prod/Prod";
import Playlists from "./Components/Playlists/Playlists";
import Playlist from "./Components/Playlist/Playlist";
import Recommendations from "./Components/Recommendations/Recommendations";
import Recommendation from "./Components/Recommendation/Recommendation";
import AboutMe from "./Components/AboutMe/AboutMe";
import U from "./Components/User/U/U";

import axios from "axios";
import Edit from "./Edit/Edit";
import Payment from "./Components/Payment/Payment";
import Contacts from "./Components/Contacts/Contacts";

import "./App.css";

function App() {
  const [id, setId] = useState<number>(0);

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
  }, []);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: 0,
    username: "",
    role: "",
  });

  useEffect(() => {
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
      path: "/shop",
      element: <Shop {...{ userInfo }} />,
    },
    {
      path: "/prods",
      element: <Prods {...{ userInfo }} />,
    },
    {
      path: "/prod/:id",
      element: <Prod {...{ userInfo }} />,
    },
    {
      path: "/playlists",
      element: <Playlists {...{ userInfo }} />,
    },
    {
      path: "/playlist/:playlistName",
      element: <Playlist {...{ userInfo }} />,
    },
    {
      path: "/recommendations",
      element: <Recommendations {...{ userInfo }} />,
    },
    {
      path: "/r/:id",
      element: <Recommendation {...{ userInfo }} />,
    },
    {
      path: "/aboutme",
      element: <AboutMe {...{ userInfo }} />,
    },
    {
      path: "/u/:id",
      element: <U {...{ userInfo }} />,
    },
    {
      path: "/edit",
      element: <Edit {...{ userInfo }} />,
    },
    {
      path: "/edit/:section",
      element: <Edit {...{ userInfo }} />,
    },
    {
      path: "/contacts",
      element: <Contacts {...{ userInfo }} />,
    },
    {
      path: "/payment",
      element: <Payment {...{ userInfo }} />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
