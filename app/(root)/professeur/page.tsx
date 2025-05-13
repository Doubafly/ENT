"use client";
import { useEffect, useState } from "react";
import RightSidebar from "@/components/RightSidebar";
import Statistique from "@/components/statistique/StatistiqueEnseignant";

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
        const userResponse = await fetch("/api/auth/session", {
          credentials: "include",
        });

        const userData = await userResponse.json();
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
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error
        );
      }
    }

    async function fetchStats(enseignantId: BigInteger) {
      try {
        // Appel à l'API des cours
        const coursRes = await fetch("/api/cours");
        const coursData = await coursRes.json();

        // Vérification des données
        const cours = coursData?.cours || [];

        // Filtrer les cours pour ceux enseignés par l'enseignant connecté
        const coursEnseignant = cours.filter(
          (cours: any) => cours.enseignant.id === enseignantId
        );

        // Calcul du nombre de filières
        const filieresSet = new Set(
          coursEnseignant.map((cours: any) => cours.filiere_module.filiere.nom)
        );
        const filieresCount = filieresSet.size;

        // Calcul du nombre d'étudiants
        const etudiantsSet = new Set(
          coursEnseignant.flatMap((cours: any) =>
            cours.filiere_module.filiere.etudiants.map(
              (etudiant: any) => etudiant.matricule
            )
          )
        );
        const etudiantsCount = etudiantsSet.size;

        // Calcul du nombre de modules
        const modulesSet = new Set(
          coursEnseignant.map((cours: any) => cours.filiere_module.module.nom)
        );
        const modulesCount = modulesSet.size;

        // Mise à jour des statistiques
        setStatData([
          {
            link: "/icons/text-books.png",
            value: filieresCount.toString(),
            nom: "Nombre Filiere",
          },
          {
            link: "/icons/friends.png",
            value: etudiantsCount.toString(),
            nom: "Nombre etudiant",
          },
          {
            link: "/icons/teach.png",
            value: modulesCount.toString(),
            nom: "Nombre Module",
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
        <Statistique menuStat={statData} />
      </div>
      <RightSidebar />
    </section>
  );
}
