"use client";
import { useEffect, useState } from "react";
import RightSidebar from "@/components/RightSidebar";
import Statistique from "@/components/statistique/statistique";

export default function Home() {

  const [statData, setStatData] = useState([
    { link: "/icons/text-books.png", value: "0", nom: "Nombre Filiere" },
    { link: "/icons/friends.png", value: "0", nom: "Nombre etudiant" },
    { link: "/icons/Training.png", value: "0", nom: "Nombre enseignant" },
  ]);

  useEffect(() => {
    async function fetchStats() {
      try {


        const coursd = await fetch("/api/cours");
        const coursData = await coursd.json();
        console.log("coursData", coursData);
        const cours = coursData.cours;

        // Nombre d'enseignants (un par cours)
        const nombreEnseignants = cours.map((c: { enseignant: any; }) => c.enseignant).length;

        // Nombre d'étudiants (on récupère tous les tableaux d’étudiants dans les filières, puis les aplatit manuellement)
        const allEtudiantsArrays = cours.map((c: { filiere_module: { filiere: { etudiants: any; }; }; }) => c.filiere_module?.filiere?.etudiants || []);
        const nombreEtudiants = allEtudiantsArrays.reduce((total:any, etudiants:any) => total + etudiants.length, 0);

        // Nombre de filières (un par cours)
        const nombreFilieres = cours.map((c: { filiere_module: { filiere: any; }; }) => c.filiere_module?.filiere).length;

        // Affichage
        console.log("Nombre d'enseignants :", nombreEnseignants);
        console.log("Nombre d'étudiants :", nombreEtudiants);
        console.log("Nombre de filières :", nombreFilieres);

        // Mise à jour des statistiques
        setStatData([
          { link: "/icons/text-books.png", value: nombreFilieres, nom: "Nombre Filiere" },
          { link: "/icons/friends.png", value: nombreEtudiants, nom: "Nombre etudiant" },
          { link: "/icons/Training.png", value: nombreEnseignants, nom: "Nombre enseignant" },
        ]);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <section className="home">
      <div className="home-content">
        <Statistique menuStat={statData} />
      </div>
      <RightSidebar />
    </section>
  );
}