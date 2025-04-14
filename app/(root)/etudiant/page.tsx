"use client";
import { useEffect, useState } from "react";
import RightSidebar from "@/components/RightSidebar";
import Statistique from "@/components/statistique/statistique";

export default function Home() {
  const [user, setUser] = useState(null); // Stocker les informations de l'utilisateur connecté
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
        console.log("User Data:", userData);
  
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
  
        // On filtre les cours auxquels l'étudiant est inscrit
        const coursFiltres = cours.filter((c: { filiere_module: { filiere: { etudiants: any; }; }; }) =>
          (c.filiere_module?.filiere?.etudiants || []).some((e: { matricule: any; }) => e.matricule === matricule)
        );
  
        // On récupère ses notes uniquement
        const notesEtudiant = coursFiltres
          .map((c: { filiere_module: { filiere: { etudiants: any[]; }; }; }) =>
            c.filiere_module?.filiere?.etudiants?.find(e => e.matricule === matricule)?.notes || []
          )
          .flat();
  
        // Calculs
        const nombreModules = coursFiltres.length;
        const nombreModulesValides = notesEtudiant.filter((note: { commentaire: string; }) => note.commentaire === "valide").length;
        const nombreModulesNonValides = notesEtudiant.filter((note: { commentaire: string; }) => note.commentaire !== "valide").length;
  
        console.log("Cours filtrés :", coursFiltres);
        console.log("Notes de l'étudiant :", notesEtudiant);
        console.log("Modules valides :", nombreModulesValides);
        console.log("Modules non valides :", nombreModulesNonValides);
  
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
        <Statistique menuStat={statData} />
      </div>
      <RightSidebar />
    </section>
  );
}
