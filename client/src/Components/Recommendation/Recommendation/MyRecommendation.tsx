import { useNavigate } from "react-router-dom";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { SongReco} from "../../../utils/type";

import "./MyRecommendation.css";

const MyRecommendation = ({ reco, recoName }: { reco: SongReco[], recoName: string }) => {
  const navigateTo = useNavigate();

  if (!reco) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recoSection">
      <div className="heading flex">
        <h1>Recommendation for {recoName}</h1>
      </div>
      <button onClick={() => navigateTo('/recommendations')} className="flex btn backbtn">
        <IconArrowNarrowLeft className="icon" />
        <p>go back</p>
      </button>
      <div className="secContainer flex">
        {reco.map((r) => (
          <div className="singleItem" key={r.id}>
            <img
              src={`https://img.youtube.com/vi/${r.ytLink}/maxresdefault.jpg`}
              alt={recoName}
            />
            <h3>
              {r.song}
              <span>
                <a
                  href={"https://www.youtube.com/watch?v=" + r.ytLink}
                  target="_blank"
                >
                  <svg
                    height="20px"
                    width="20px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 461.001 461.001"
                  >
                    <g>
                      <path
                        style={{ fill: "#F61C0D" }}
                        d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728
                          c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137
                          C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607
                          c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"
                      />
                    </g>
                  </svg>
                </a>
                {r.spotifyLink && r.spotifyLink != "" ? (
                  <a
                    href={
                      "https://open.spotify.com/intl-fr/track/" + r.spotifyLink
                    }
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      width="20px"
                      version="1.1"
                      viewBox="0 0 168 168"
                    >
                      <path
                        fill="#1ED760"
                        d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z"
                      />
                    </svg>
                  </a>
                ) : (
                  <></>
                )}
              </span>
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRecommendation;
