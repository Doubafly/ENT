import "./style.css";
export default function Imprimer() {
  return (
    <>
      <div className="contenue">
        <p className="i">
          <span className="ml-16"> REGION DE KOULIKORO</span>{" "}
          <span className="text-2xl">COMPLEXE SCOLAIRE KOUDIA LY </span>{" "}
          <span className="mr-8">REPUBLIQUE DU MALI</span>
        </p>
        <p className="i">
          <span>ACADEMIE D'ENSEIGNEMENT DE KATI</span>{" "}
          <span className="-ml-5">Tél: (+223) 72 22 19 92/ 63 60 87 84</span>{" "}
          <span> UN PEUPLE-UN BUT-UNE FOI</span>{" "}
        </p>
        <p className="i">
          {" "}
          <span className="ml-14">CAP DE KALABAN CORO</span>
        </p>
        <p className="text-center">Bulletin du deuxieme trimestre</p>
        <div className="i">
          {" "}
          <span>Nom : Ba</span> <span>Classe :2 Année</span>
        </div>
        <div className="i">
          {" "}
          <span>Prenom :Mamadou</span> <span>Effective :34</span>
        </div>
      </div>
    </>
  );
}
