import {
  IconBrandInstagram,
  IconBrandSoundcloud,
  IconBrandYoutube,
  IconMail,
  IconMusic,
} from "@tabler/icons-react";

import Recommendation from "../../assets/Recommendation/Recommendation";

import "./MyContact.css";

const MyContact = () => {
  const contacts = [
    { name: "Mail", link: "mailto:oftynprod@gmail.com", img: <IconMail /> },
    {
      name: "Instagram",
      link: "https://www.instagram.com/_oftynn/",
      img: <IconBrandInstagram />,
    },
    {
      name: "YouTube",
      link: "https://www.youtube.com/channel/UCWhwbLWPuKqEo3xmXOv9Bzg/featured",
      img: <IconBrandYoutube />,
    },
    {
      name: "SoundCloud",
      link: "https://soundcloud.com/oftyn-beats",
      img: <IconBrandSoundcloud />,
    },
    {
      name: "Instrurap",
      link: "https://www.instrurap.fr/p/_Oftyn",
      img: <IconMusic />,
    },
  ];

  return (
    <div className="myContactSection">
      <div className="heading flex">
        <h1>My Contacts</h1>
      </div>
      <div className="secContainer flex">
        <div className="flex" style={{ flexDirection: "column" }}>
          {contacts.map((c) => (
            <a target="_blank" href={c.link} className="flex contact">
              {c.img}
              <h4>{c.name}</h4>
            </a>
          ))}
        </div>
      </div>
      <Recommendation />
    </div>
  );
};

export default MyContact;
