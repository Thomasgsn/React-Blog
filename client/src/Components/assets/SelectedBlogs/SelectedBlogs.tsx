import { useNavigate } from "react-router-dom";
import { BlogInfo } from "../../../utils/type";

interface BlogDate {
  releaseDate: string;
}

const SelectedBlogs = ({
  blogs,
}: {
  blogs: BlogInfo[];
}) => {
  const navigateTo = useNavigate();

  const thisYear = new Date().getFullYear();

  const BlogDate = (b: BlogDate) => {
    const minute = parseInt(b.releaseDate.split("T")[1].split(":")[1]);
    const hour = b.releaseDate.split("T")[1].split(":")[0];

    const day = b.releaseDate.split("T")[0].split("-")[2];
    const mounth = parseInt(b.releaseDate.split("T")[0].split("-")[1]);
    const year = parseInt(b.releaseDate.split("T")[0].split("-")[0]);

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

  return (
    <>
      {blogs.map((b) => (
        <div className="blog">
          <div className="info flex">
            <div className="flex author">
              <div className="avatar flex">
                <img
                  src={`avatars/${b.avatar}`}
                  alt={`${b.username} avatar`}
                  onClick={() => navigateTo(`/u/${b.idUser}`)}
                />
              </div>
              <div>
                <p
                  className="cursor"
                  onClick={() => navigateTo(`/u/${b.idUser}`)}
                >
                  {b.username}
                </p>
                <p className="date">
                  <BlogDate releaseDate={b.releaseDate} />
                </p>
              </div>
            </div>
            <p className="title">{b.title} -</p>
            <p className="text">{b.text}</p>
          </div>
          <div className="img">
            <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8MTkyMHgxMDgwfGVufDB8fDB8fHww" />
          </div>
          <div className="seeMore flex">
            <a className="btn flex" href={`/blog/${b.id}`}>
              See more
            </a>
          </div>
        </div>
      ))}
    </>
  );
};

export default SelectedBlogs;
