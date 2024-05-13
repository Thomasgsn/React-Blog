import "./MyRecommendation.css";

const MyRecommendation = ({ artistReco }) => {
  let nbT = 0;
  return (
    <div className="recoSection">
      <div className="heading flex">
        <h1>My Recommendations </h1>
        <p>
          {artistReco.length} artists /{" "}
          {artistReco.map((n: any) => {
            nbT += n.nb_r;
          })}
          {nbT} recommendations
        </p>
      </div>
      <div className="secContainer flex">
        {artistReco.map((a: any) => (
          <a key={a.id} href={"/r/" + a.id} className="singleItem">
            <img src={"/recommendations/" + a.img } alt={a.name} />
            <h3>{a.name}</h3>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MyRecommendation;
