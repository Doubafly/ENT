"use client";
import { useEffect, useState } from "react";
import RightSidebar from "@/components/RightSidebar";
import EmploieStudent from "@/components/emploisDuTemps/EmploisEtudiant";
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
          fetchStats(matricule, userData.user.id_utilisateur);
        } else {
          console.error("L'utilisateur connecté n'est pas un étudiant.");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error
        );
      }
    }

    async function fetchStats(matricule: any, id_utilisateur: number) {
      try {
        const coursd = await fetch("/api/cours");
        const coursData = await coursd.json();
        const cours = coursData?.cours || [];

        const coursFiltres = cours.filter(
          (c: { filiere_module: { filiere: { etudiants: any } } }) =>
            (c.filiere_module?.filiere?.etudiants || []).some(
              (e: { matricule: any }) => e.matricule === matricule
            )
        );
        console.log(coursFiltres);

        // const notesEtudiant = coursFiltres
        //   .map(
        //     (c: { filiere_module: { filiere: { etudiants: any[] } } }) =>
        //       c.filiere_module?.filiere?.etudiants?.find(
        //         (e) => e.matricule === matricule
        //       )?.notes || []
        //   )
        //   .flat();

        const notesEtudiant = coursFiltres
          .map((c: { notes: { etudiant: { matricule: any } }[] }) =>
            c.notes?.find(
              (n: { etudiant: { matricule: any } }) =>
                n.etudiant.matricule === matricule
            )
          )
          .flat();
        console.log(notesEtudiant);

        const nombreModules = coursFiltres.length;

        const nombreModulesValides = notesEtudiant.filter(
          (note: { note_class: number | null; note_exam: number | null }) =>
            ((note?.note_class || 0) + (note?.note_exam || 0)) / 2 >= 10
        ).length;
        const nombreModulesNonValides = notesEtudiant.filter(
          (note: { note_exam: any; note_class: any }) =>
            ((note?.note_class || 0) + (note?.note_exam || 0)) / 2 < 10
        ).length;
        const nombreAbsences = coursFiltres.reduce(
          (acc: any, cours: { Absences: any[] }) => {
            if (!cours.Absences) return acc;
            // On compte seulement les absences de l'étudiant connecté
            const absencesEtudiant = cours.Absences.filter(
              (a) => a.utilisateur?.id_utilisateur === id_utilisateur
            );
            return acc + absencesEtudiant.length;
          },
          0
        );

        setStatData([
          {
            link: "/icons/teach.png",
            value: nombreModules,
            nom: "Nombre Module",
          },
          {
            link: "/icons/friends.png",
            value: nombreAbsences,
            nom: "Nombre Abscence",
          },
          {
            link: "/icons/teach.png",
            value: nombreModulesValides,
            nom: "Nbre Module Valider",
          },
          {
            link: "/icons/Training.png",
            value: nombreModulesNonValides,
            nom: "Nbre Module Non Valider",
          },
        ]);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des statistiques :",
          error
        );
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
