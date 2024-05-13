import {
  IconAdjustmentsHorizontal,
  IconArrowBack,
  IconArrowLeft,
  IconCalendarEvent,
  IconCreditCardPay,
  IconFileInvoice,
  IconKey,
  IconShoppingBag,
  IconTrash,
} from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Prods, UserInfo } from "../../../utils/type";

import axios from "axios";
import Loader from "../../../utils/Loader";
import Recommendation from "../../assets/Recommendation/Recommendation";

import "./MyProd.css";

interface Comments {
  id: number;
  text: string;
  idUser: number;
  idProd: number;
  username: string;
}

const MyProd = ({
  userInfo,
  prod,
  comment,
  setComment,
}: {
  userInfo: UserInfo;
  prod: Prods;
  comment: Comments[];
  setComment: Dispatch<SetStateAction<Comments[]>>;
}) => {
  const navigateTo = useNavigate();
  const [allowBack, setAllowBack] = useState<boolean>(false);
  const [writeComment, setWritting] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<Comments>({
    id: 0,
    text: "",
    idUser: 0,
    idProd: 0,
    username: "",
  });

  useEffect(() => {
    prod.id && setNewComment((prev) => ({ ...prev, idProd: prod.id }));
    userInfo.id && setNewComment((prev) => ({ ...prev, idUser: userInfo.id }));
  }, [prod.id, userInfo.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8081/newcomment", newComment);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8081/comment/${id}`);
      setComment((prevState) =>
        prevState.filter((comment) => comment.id !== id)
      );
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (!prod) {
    setTimeout(() => {
      setAllowBack(true);
    }, 3000);

    const Return = () => {
      if (!allowBack) return <></>;
      return (
        <button onClick={() => navigateTo("/prods")} className="btn flex">
          Go back
          <IconArrowBack className="icon" />
        </button>
      );
    };

    return (
      <>
        <Loader />
        <Return />
      </>
    );
  }

  return (
    <div className="myPlaylistSection">
      <button onClick={() => navigateTo("/prods")} className="btn flex goBack">
        <IconArrowLeft className="icn" />
        Go back
      </button>
      <div className="heading flex">
        <div className="flex prod">
          <div className="prodInfo grid">
            <div className="infoDiv">
              <h3 className="divTitle">{prod.name} Detail</h3>
              <ul className="menuList grid">
                <li className="listItem">
                  <div className="menuLink flex">
                    <div className="flex typeInfo">
                      <IconFileInvoice className="icon" />
                      <p>Style</p>
                    </div>
                    <span>{prod.typebeat}</span>
                  </div>
                </li>

                <li className="listItem">
                  <div className="menuLink flex">
                    <div className="flex typeInfo">
                      <IconKey className="icon" />
                      <p>Key</p>
                    </div>
                    <span>{prod.key}</span>
                  </div>
                </li>

                <li className="listItem">
                  <div className="menuLink flex">
                    <div className="flex typeInfo">
                      <IconAdjustmentsHorizontal className="icon" />
                      <p>BPM</p>
                    </div>
                    <span>{prod.BPM}</span>
                  </div>
                </li>

                <li className="listItem">
                  <div className="menuLink flex">
                    <div className="flex typeInfo">
                      <IconCreditCardPay className="icon" />
                      <p>Price</p>
                    </div>
                    <span>
                      {prod.price > 0 ? <>{prod.price} €</> : <>[FREE]</>}
                    </span>
                  </div>
                </li>

                <li className="listItem">
                  <div className="menuLink flex">
                    <div className="flex typeInfo">
                      <IconCalendarEvent className="icon" />
                      <p>Release</p>
                    </div>
                    <span>{prod.releaseDate.slice(0, 10)}</span>
                  </div>
                </li>

                <li className="listItem">
                  <div className="menuLink flex">
                    <div className="flex typeInfo">
                      <IconShoppingBag className="icon" />
                      <p>Buy it</p>
                    </div>
                    <span>
                      <a
                        target="_blank"
                        href={`https://www.instrurap.fr/beats/track/${prod.instrurapLink}`}
                      >
                        here
                      </a>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <img
            src={`/prods/${prod.cover}`}
            alt={`${prod.name} By. _oftyn`}
            className="prodCover"
          />
          <div className="prodComment grid">
            <div className="commentDiv">
              <h3 className="divTitle">{prod.name} Comments</h3>
              <div
                onClick={() => !writeComment && setWritting(true)}
                className="addComment flex"
              >
                {!writeComment ? (
                  <p className="add">Add a comment</p>
                ) : (
                  <form className="flex" onSubmit={handleSubmit} method="POST">
                    <p className="cancel" onClick={() => setWritting(false)}>
                      Cancel
                    </p>
                    <input
                      type="text"
                      name="text"
                      maxLength={150}
                      autoFocus
                      onChange={handleChange}
                    />
                    <button className="send btn" type="submit">
                      Send
                    </button>
                  </form>
                )}
              </div>

              <ul className="menuList grid">
                {comment.map((c) => (
                  <li key={c.id} className="listItem">
                    <a href={`/u/${c.idUser}`}>{c.username}</a>
                    <br />
                    {(c.idUser === userInfo.id || userInfo.role == "admin") && (
                      <button className="btn del">
                        <IconTrash
                          className="icon"
                          size={18}
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this item ?"
                              )
                            ) {
                              handleDelete(c.id);
                            }
                          }}
                        />
                      </button>
                    )}
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Recommendation />
    </div>
  );
};

export default MyProd;
