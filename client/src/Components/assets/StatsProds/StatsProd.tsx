import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { IconArrowNarrowRight } from "@tabler/icons-react";

import "./StatsProd.css";

interface ProdTotal {
  nbProd: number;
}
interface ProdMounth {
  nbProdMounth: number;
}

const StatsProd = () => {
  const navigateTo = useNavigate();

  const navigateToShop = () => {
    navigateTo("/shop");
  };

  const [prodTotal, setProdTotal] = useState<ProdTotal[]>([]);
  const [prodMounth, setProdMounth] = useState<ProdMounth[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/statsprod")
      .then((response) => response.json())
      .then((data) => {
        setProdMounth(data.prodMonth);
        setProdTotal(data.prodTotal);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données :", error)
      );
  }, []);

  return (
    <div className="leftCard flex">
      <div className="main flex">
        <div className="textDiv">
          <h1>My Prods</h1>
          <div className="flex">
            <span>
              This Mounth <br />{" "}
              <small>
                {prodMounth.map((p) => (
                  <span key={p.nbProdMounth}>{p.nbProdMounth}</span>
                ))}{" "}
                Prods done
              </small>
            </span>
            <span>
              All Time <br />{" "}
              <small>
                {prodTotal.map((p) => (
                  <span key={p.nbProd}>{p.nbProd}</span>
                ))}{" "}
                Prods done
              </small>
            </span>
          </div>

          <span onClick={navigateToShop} className="flex link">
            Go to my Shop
            <IconArrowNarrowRight className="icon" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsProd;
