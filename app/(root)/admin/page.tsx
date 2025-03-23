"use client";
import { useEffect, useState } from "react";
import RightSidebar from "@/components/RightSidebar";
import Statistique from "@/components/statistique/statistique";

export default function Home() {
  const user = {
    role: "Admin",
    firstName: "Mamadou",
    lastName: "Ba",
    email: "ba6353158@gmail.com",
  };

  const [statData, setStatData] = useState([
    { link: "/icons/text-books.png", value: "0", nom: "Nombre Filiere" },
    { link: "/icons/friends.png", value: "0", nom: "Nombre etudiant" },
    { link: "/icons/Training.png", value: "0", nom: "Nombre enseignant" },
  ]);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Appels aux API existantes
        const [filieresRes, etudiantsRes, enseignantsRes] = await Promise.all([
          fetch("/api/filieres"),
          fetch("/api/utilisateurs/etudiants"),
          fetch("/api/utilisateurs/enseignants"),
        ]);

        const [filieresData, etudiantsData, enseignantsData] = await Promise.all([
          filieresRes.json(),
          etudiantsRes.json(),
          enseignantsRes.json(),
        ]);

        // Mise à jour des statistiques
        setStatData([
          { link: "/icons/text-books.png", value: filieresData.filieres.length, nom: "Nombre Filiere" },
          { link: "/icons/friends.png", value: etudiantsData.etudiants.length, nom: "Nombre etudiant" },
          { link: "/icons/Training.png", value: enseignantsData.utilisateurs.length, nom: "Nombre enseignant" },
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