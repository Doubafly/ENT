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
        // Récupérer les informations de l'utilisateur connecté
        const userResponse = await fetch("/api/auth/session");
        const userData = await userResponse.json();
        console.log("User Data:", userData);
    
        // Vérifiez si l'utilisateur est un étudiant et récupérez son ID
        if (userData.user && userData.user.type === "Etudiant") {
          const etudiantId = userData.user.etudiant?.id; // Récupérer l'ID de l'étudiant
          const idFiliere = userData.user.etudiant?.id_filiere; // Récupérer l'ID de la filière
          if (!etudiantId || !idFiliere) {
            console.error("Aucun ID étudiant ou filière trouvé pour cet utilisateur.");
            return;
          }
    
          setUser(userData.user);
    
          // Appeler les statistiques une fois que l'ID de l'étudiant est récupéré
          fetchStats(etudiantId, idFiliere);
        } else {
          console.error("L'utilisateur connecté n'est pas un étudiant.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    }


    async function fetchStats(etudiantId, idFiliere) {
      try {
        // Appels aux API existantes
        const [modulesRes] = await Promise.all([
          fetch("/api/modules"), // API pour récupérer les modules
        ]);
    
        const [modulesData] = await Promise.all([
          modulesRes.json(),
        ]);
    
        // Logs pour vérifier la structure des données
        console.log("Modules Data:", modulesData);
    
        // Accéder aux tableaux dans les réponses
        const modules = modulesData?.modules || [];
    
        // Filtrer les modules en fonction de la filière de l'étudiant connecté
        const modulesCount = modules.filter((module) => {
          return module?.filiere_module?.some((filiereModule) => {
            return filiereModule?.id_filiere === idFiliere; // Vérifiez si l'étudiant est dans la même filière
          });
        }).length;
    
        // Mise à jour des statistiques
        setStatData([
          { link: "/icons/teach.png", value: modulesCount, nom: "Nombre Module" },
          { link: "/icons/friends.png", value: "0", nom: "Nombre Abscence" },
          { link: "/icons/teach.png", value: "0", nom: "Nbre Module Valider" },
          { link: "/icons/Training.png", value: "0", nom: "Nbre Module Non Valider" },
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
