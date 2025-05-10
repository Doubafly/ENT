"use client";
import { useEffect, useState } from "react";
import RightSidebar from "@/components/RightSidebar";
import EmploieStudent from "@/components/EmploiDuTemps";
import StatistiqueEtudiant from "@/components/statistique/StatistiqueEtudiant";

export default function Home() {
  const [user, setUser] = useState(null);
  const [statData, setStatData] = useState([
    { link: "/icons/text-books.png", value: "0", nom: "Nombre Module" },
    { link: "/icons/friends.png", value: "0", nom: "Nombre Abscence" },
    { link: "/icons/teach.png", value: "0", nom: "Nbre Module Valider" },
    { link: "/icons/Training.png", value: "0", nom: "Nbre Module Non Valider" },
  ]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userResponse = await fetch("/api/auth/session");
        const userData = await userResponse.json();

        if (userData.user && userData.user.type === "Etudiant") {
          const etudiantId = userData.user.etudiant?.id;
          const matricule = userData.user.etudiant?.matricule;

          if (!etudiantId || !matricule) {
            console.error("ID ou matricule étudiant manquant.");
            return;
          }

          setUser(userData.user);
          fetchStats(matricule);
        } else {
          console.error("L'utilisateur connecté n'est pas un étudiant.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    }

    async function fetchStats(matricule: any) {
      try {
        const coursd = await fetch("/api/cours");
        const coursData = await coursd.json();
        const cours = coursData?.cours || [];

        const coursFiltres = cours.filter((c: { filiere_module: { filiere: { etudiants: any } } }) =>
          (c.filiere_module?.filiere?.etudiants || []).some(
            (e: { matricule: any }) => e.matricule === matricule
          )
        );

        const notesEtudiant = coursFiltres
          .map((c: { filiere_module: { filiere: { etudiants: any[] } } }) =>
            c.filiere_module?.filiere?.etudiants?.find((e) => e.matricule === matricule)?.notes || []
          )
          .flat();

        const nombreModules = coursFiltres.length;
        const nombreModulesValides = notesEtudiant.filter(
          (note: { commentaire_enseignant: string }) => note.commentaire_enseignant === "valide"
        ).length;
        const nombreModulesNonValides = notesEtudiant.filter(
          (note: { commentaire_enseignant: string }) => note.commentaire_enseignant !== "valide"
        ).length;

        setStatData([
          { link: "/icons/teach.png", value: nombreModules, nom: "Nombre Module" },
          { link: "/icons/friends.png", value: "0", nom: "Nombre Abscence" },
          { link: "/icons/teach.png", value: nombreModulesValides, nom: "Nbre Module Valider" },
          { link: "/icons/Training.png", value: nombreModulesNonValides, nom: "Nbre Module Non Valider" },
        ]);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      }
    }

    fetchUser();
  }, []);

  return (
    <section className="home">
      <div className="home-content">
        {/* <EmploieStudent menuStat={statData} /> */}
        <StatistiqueEtudiant stats={statData} />
      </div>
      <RightSidebar />
    </section>
  );
}
