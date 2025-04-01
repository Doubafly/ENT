"use client";
import { useEffect, useState } from "react";
import RightSidebar from "@/components/RightSidebar";
import Statistique from "@/components/statistique/statistique";

export default function Home() {
  const [user, setUser] = useState(null); // Stocker les informations de l'utilisateur connecté
  const [statData, setStatData] = useState([
    { link: "/icons/text-books.png", value: "0", nom: "Nombre Filiere" },
    { link: "/icons/friends.png", value: "0", nom: "Nombre etudiant" },
    { link: "/icons/teach.png", value: "0", nom: "Nombre Module" },
  ]);

  useEffect(() => {
    async function fetchUser() {
      try {
        // Récupérer les informations de l'utilisateur connecté
        const userResponse = await fetch("/api/auth/session");
        const userData = await userResponse.json();
        console.log("User Data:", userData);

        // Vérifiez si l'utilisateur est un enseignant et récupérez son ID
        if (userData.user && userData.user.type === "Enseignant") {
          const enseignantId = userData.user.enseignant?.id; // Récupérer l'ID de l'enseignant
          if (!enseignantId) {
            console.error("Aucun ID enseignant trouvé pour cet utilisateur.");
            return;
          }

          setUser(userData.user);

          // Appeler les statistiques une fois que l'ID de l'enseignant est récupéré
          fetchStats(enseignantId);
        } else {
          console.error("L'utilisateur connecté n'est pas un enseignant.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    }

    async function fetchStats(enseignantId) {
      try {
        // Appels aux API existantes
        const [filieresRes, etudiantsRes, modulesRes] = await Promise.all([
          fetch("/api/filieres"),
          fetch("/api/utilisateurs/etudiants"),
          fetch("/api/modules"),
        ]);

        const [filieresData, etudiantsData, modulesData] = await Promise.all([
          filieresRes.json(),
          etudiantsRes.json(),
          modulesRes.json(),
        ]);

        // Accéder aux tableaux dans les réponses
        const filieres = filieresData?.filieres || [];
        const etudiants = etudiantsData?.etudiants || [];
        const modules = modulesData?.modules || [];

        // Filtrer les données en fonction de l'enseignant connecté
        const filieresCount = filieres.filter((filiere) => {
          return filiere.filiere_module.some((module) => {
            return etudiants.some((etudiant) => {
              return etudiant.notes.some((note) => note.cours.id_filiere_module === module.id_filiere_module &&
                note.cours.id_professeur === enseignantId);
            });
          });
        }).length;
        

        const etudiantsCount = etudiants.filter((etudiant) => {
          return etudiant.notes.some((note) => note.cours.id_professeur === enseignantId);
        }).length;
        
        const modulesCount = modules.filter((module) => {
          return module.filiere_module.some((filiereModule) => {
            return etudiants.some((etudiant) => {
              return etudiant.notes.some((note) => note.cours.id_filiere_module === filiereModule.id_filiere_module &&
                note.cours.id_professeur === enseignantId);
            });
          });
        }).length;
        
        // Mise à jour des statistiques
        setStatData([
          { link: "/icons/text-books.png", value: filieresCount, nom: "Nombre Filiere" },
          { link: "/icons/friends.png", value: etudiantsCount, nom: "Nombre etudiant" },
          { link: "/icons/teach.png", value: modulesCount, nom: "Nombre Module" },
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