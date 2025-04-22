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
        console.log("cours", cours);
        
        // const nombreEnseignants = new Set(cours.map((c: { enseignant: any; }) => c.enseignant)).size;
        const nombreEnseignants = new Set(cours.map(c => c.enseignant.id)).size;


        // Étape 1 : Extraire tous les étudiants de toutes les filières
        const allEtudiants = cours.flatMap(c => c.filiere_module?.filiere?.etudiants || []);

        // Étape 2 : Filtrer les matricules uniques
        const matriculesUniques = new Set(allEtudiants.map(e => e.matricule));

        // Étape 3 : Nombre d’étudiants uniques
        const nombreEtudiants = matriculesUniques.size;


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