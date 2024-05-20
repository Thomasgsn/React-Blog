import { BlogInfo } from "../../../utils/type";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconSeparator,
  IconX,
} from "@tabler/icons-react";

import "./Info.css";

const Info = ({
  blogs,
  categoryName,
  sortBy,
  setSortBy,
}: {
  blogs: BlogInfo[];
  categoryName: string | undefined;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
}) => {
  const [categs, setCategs] = useState([
    {
      id: 0,
      name: "",
    },
  ]);

  useEffect(() => {
    fetch(`http://localhost:8081/reqcateg`)
      .then((response) => response.json())
      .then((categs) => {
        setCategs(categs);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, []);

  const [lowSizeSET, setLowSizeSet] = useState<boolean>(false);
  const [lowSettings, setLowSettings] = useState<boolean>(false);

  const leftBarInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const innerWidth = window.innerWidth;
      setLowSizeSet(innerWidth < 1500);
    };
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const leftBarInfo = leftBarInfoRef.current;

    if (leftBarInfo) {
      if (lowSizeSET) {
        leftBarInfo.style.display = lowSettings ? "block" : "none";
      } else {
        leftBarInfo.style.display = "block";
        setLowSettings(false);
      }
    }
  }, [lowSettings, lowSizeSET]);

  return (
    <>
      <div className="showBarInfo" onClick={() => setLowSettings(!lowSettings)}>
        {lowSettings ? (
          <IconX className="icon" />
        ) : (
          <IconArrowRight className="icon" />
        )}
      </div>
      <div className="leftBarInfo" ref={leftBarInfoRef}>
        <div>
          <h1>Data :</h1>
          {blogs && (
            <p>
              <u>Blogs :</u> {blogs.length}
            </p>
          )}
        </div>
        <div>
          <h1>Find :</h1>
          <p>Sort By :</p>
          <div className="sortBy flex">
            {sortBy === "date" || sortBy === "dateinv" ? (
              <button
                className="btn flex"
                style={{
                  backgroundColor: "var(--primaryColor)",
                  color: "var(--whiteColor)",
                }}
                onClick={() => {
                  sortBy === "date" ? setSortBy("dateinv") : setSortBy("date");
                }}
              >
                Date
                {sortBy === "date" ? (
                  <IconArrowDown className="icon" />
                ) : (
                  <IconArrowUp className="icon" />
                )}
              </button>
            ) : (
              <button className="btn flex" onClick={() => setSortBy("date")}>
                Date <IconSeparator className="icon" />
              </button>
            )}

            {!categoryName &&
              (sortBy === "categ" || sortBy === "categinv" ? (
                <button
                  className="btn flex"
                  style={{
                    backgroundColor: "var(--primaryColor)",
                    color: "var(--whiteColor)",
                  }}
                  onClick={() => {
                    sortBy === "categ"
                      ? setSortBy("categinv")
                      : setSortBy("categ");
                  }}
                >
                  Category
                  {sortBy === "categ" ? (
                    <IconArrowDown className="icon" />
                  ) : (
                    <IconArrowUp className="icon" />
                  )}
                </button>
              ) : (
                <button
                  className="btn flex categ"
                  onClick={() => setSortBy("categ")}
                >
                  Category <IconSeparator className="icon" />
                </button>
              ))}
          </div>
          {window.location.href.split("/")[3] !== "like" && (
            <>
              <p>Category :</p>
              <div className="categoryBy">
                {!categoryName ? (
                  <>
                    {categs.map((c) => (
                      <a
                        key={c.id}
                        href={`/category/${c.name}`}
                        className="btn flex"
                      >
                        {c.name}
                      </a>
                    ))}
                  </>
                ) : (
                  <>
                    {categoryName && (
                      <p
                        className="btn flex actualCategory"
                        style={{
                          backgroundColor: "var(--primaryColor)",
                          color: "var(--whiteColor)",
                        }}
                      >
                        {categoryName}
                      </p>
                    )}
                    <a href={`/home`} className="btn flex">
                      See All
                    </a>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Info;
