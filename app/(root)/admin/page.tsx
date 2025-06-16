"use client";
import { useEffect, useState } from "react";
import RightSidebar from "@/components/RightSidebar";
import Statistique from "@/components/statistique/StatistiqueAdmin";

export default function Home() {

  const [statData, setStatData] = useState([
    { link: "/icons/text-books.png", value: "0", nom: "Nombre Filiere" },
    { link: "/icons/friends.png", value: "0", nom: "Nombre etudiant" },
    { link: "/icons/Training.png", value: "0", nom: "Nombre enseignant" },
    { link: "/icons/Training.png", value: "0", nom: "Nombre admin" },
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
        const nombreEnseignants = new Set(cours.map((c: { enseignant: { id: any; }; }) => c.enseignant.id)).size;


        // Étape 1 : Extraire tous les étudiants de toutes les filières
        const allEtudiants = cours.flatMap((c: { filiere_module: { filiere: { etudiants: any; }; }; }) => c.filiere_module?.filiere?.etudiants || []);

        // Étape 2 : Filtrer les matricules uniques
        const matriculesUniques = new Set(allEtudiants.map((e: { matricule: any; }) => e.matricule));
        // Étape 3 : Compter le nombre d'étudiants uniques
        const nombreEtudiants = matriculesUniques.size;

        // Extraire toutes les filières
        const allFilieres = cours.map((c: { filiere_module: { filiere: any; }; }) => c.filiere_module?.filiere);

        // Extraire les ID uniques
        const filiereIdsUniques = new Set(allFilieres.map((f: { id_filiere: any; }) => f.id_filiere));

        // Nombre de filières uniques
        const nombreFilieres = filiereIdsUniques.size;


        // Affichage
        console.log("Nombre d'enseignants :", nombreEnseignants);
        console.log("Nombre d'étudiants :", nombreEtudiants);
        console.log("Nombre de filières :", nombreFilieres);
        

        // Mise à jour des statistiques
        setStatData([
          { link: "/icons/text-books.png", value: nombreFilieres.toString(), nom: "Nombre Filiere" },
          { link: "/icons/friends.png", value: nombreEtudiants.toString(), nom: "Nombre etudiant" },
          { link: "/icons/Training.png", value: nombreEnseignants.toString(), nom: "Nombre enseignant" },
          { link: "/icons/Training.png", value: "0", nom: "Nombre admin" },
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