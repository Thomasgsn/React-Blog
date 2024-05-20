import { useEffect, useState } from "react";
import { UserInfo } from "../../utils/type";

import Topbar from "../assets/Topbar/Topbar/Topbar";

import "./Followers.css";

interface Follow {
  id: number;
  username: string;
  avatar: string;
}

const Followers = ({ userInfo }: { userInfo: UserInfo }) => {
  const [iFollow, setIFollow] = useState<Follow[]>([]);
  const [FollowMe, setFollowMe] = useState<Follow[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8081/followers?currentuser=${userInfo.id}`)
      .then((response) => response.json())
      .then((res) => {
        setIFollow(res.IF);
        setFollowMe(res.FM);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, [userInfo.id]);

  return (
    <div className="container">
      <Topbar {...{ userInfo }} />
      <div className="mainContent">
        <div className="flex follow">
          <div>
            <p className="title">Who I follow</p>
            <div>
              {iFollow.map((i, index) => (
                <div key={index} className="flex following">
                  <div className="flex">
                    <div className="avatar flex">
                      <a href={`/u/${i.id}`}>
                        <img
                          src={`/avatars/${i.avatar}`}
                          alt={`${i.username} avatar`}
                        />
                      </a>
                    </div>
                    <div>
                      <a className="name" href={`/u/${i.id}`}>
                        {i.username}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="title">Who follow me</p>
            <div>
              {FollowMe.map((i, index) => (
                <div key={index} className="flex follower">
                  <div className="flex">
                    <div className="avatar flex">
                      <a href={`/u/${i.id}`}>
                        <img
                          src={`/avatars/${i.avatar}`}
                          alt={`${i.username} avatar`}
                        />
                      </a>
                    </div>
                    <div>
                      <a className="name" href={`/u/${i.id}`}>
                        {i.username}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Followers;
