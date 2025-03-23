"use client";
import { useEffect, useState } from "react";
import EmploieStudent from "@/components/EmploieStudent";
import RightSidebar from "@/components/RightSidebar";
import Statistique from "@/components/statistique/statistique";

export default function Home() {
  const [user, setUser] = useState(null); // Stocker les informations de l'utilisateur
  const [statData, setStatData] = useState([
    { link: "/icons/text-books.png", value: "0", nom: "Nombre Module" },
    { link: "/icons/friends.png", value: "0", nom: "Nombre Abscence" },
    { link: "/icons/teach.png", value: "0", nom: "Nombre Module Valider" },
    { link: "/icons/Training.png", value: "0", nom: "Nombre Session" },
  ]);

  useEffect(() => {
    async function fetchUser() {
      try {
        // Simuler une récupération d'utilisateur connecté (par exemple, via une API ou un token)
        const userResponse = await fetch("/api/auth/me"); // Exemple d'API pour récupérer l'utilisateur connecté
        const userData = await userResponse.json();
        setUser(userData);

        // Appeler les statistiques une fois que l'utilisateur est récupéré
        fetchStats(userData.id);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    }

    async function fetchStats(userId) {
      try {
        // Appels aux API existantes
        const [etudiantRes, modulesRes, sessionsRes] = await Promise.all([
          fetch(`/api/utilisateurs/etudiants?id=${userId}`), // API pour récupérer les données de l'étudiant
          fetch("/api/modules"), // API pour récupérer les modules
          fetch("/api/sessions"), // API pour récupérer les sessions
        ]);

        const [etudiantData, modulesData, sessionsData] = await Promise.all([
          etudiantRes.json(),
          modulesRes.json(),
          sessionsRes.json(),
        ]);

        // Calcul des statistiques
        const modulesCount = etudiantData.etudiant.filiere.filiere_module.length;

        const absencesCount = etudiantData.etudiant.notes.filter(
          (note) => note.absence === true // Exemple : si vous avez un champ `absence` dans les notes
        ).length;

        const modulesValidesCount = etudiantData.etudiant.notes.filter(
          (note) => note.note_exam >= 10 // Exemple : modules validés si la note d'examen est >= 10
        ).length;

        const sessionsCount = sessionsData.sessions.length;

        // Mise à jour des statistiques
        setStatData([
          { link: "/icons/text-books.png", value: modulesCount, nom: "Nombre Module" },
          { link: "/icons/friends.png", value: absencesCount, nom: "Nombre Abscence" },
          { link: "/icons/teach.png", value: modulesValidesCount, nom: "Nombre Module Valider" },
          { link: "/icons/Training.png", value: sessionsCount, nom: "Nombre Session" },
        ]);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      <section className="home flex">
        <div className="home-content">
          <Statistique menuStat={statData} />
        </div>
        <RightSidebar />
      </section>
    </>
  );
}