"use client";
import NoteRegistre from "@/components/note/NoteRegistre";
import EtudiantNoteTable from "@/components/table/EtudiantNoteTable";
import FiliereTable from "@/components/table/FiliereTable";
import NoteTable from "@/components/table/NoteTable";
import Semestre from "@/components/table/SemestreTableau";
import { useEffect, useState } from "react";

export default function page() {
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    async function fetchStats() {
      try {
        // Récupérer les informations de l'utilisateur connecté
        const userResponse = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const userData = await userResponse.json();

        if (userData.user && userData.user.type === "Enseignant") {
          const enseignantId = userData.user.enseignant?.id; // Récupérer l'ID de l'enseignant

          if (!enseignantId) {
            console.error("Aucun ID enseignant trouvé pour cet utilisateur.");
            return;
          }

          // Récupérer les cours
          const coursRes = await fetch("/api/cours");
          const coursData = await coursRes.json();

          // Filtrer les cours enseignés par l'enseignant connecté
          const filteredCours = coursData.cours.filter(
            (cours: any) => cours.enseignant.id === enseignantId
          );
          // console.log(filteredCours);
          // ...existing code...

          // Transformer les données filtrées
          const formattedClasses = filteredCours.reduce(
            (acc: any[], cours: any) => {
              const filiere = cours.filiere_module.filiere;
              const module = cours.filiere_module.module;

              // Vérifier si la filière existe déjà dans acc
              const existingFiliere = acc.find(
                (item) => item.id === filiere.id_filiere
              );

              const semestreData = {
                id: `${filiere.id_filiere}-${cours.semestre}`, // ID unique pour le semestre
                name: cours.semestre, // Nom du semestre
                modules: [
                  {
                    id: cours.filiere_module.module.id_module, // ID du module
                    name: module.nom, // Nom du module
                    students: Array.isArray(filiere.etudiants)
                      ? filiere.etudiants.map((etudiant: any) => ({
                          id: etudiant.matricule, // Matricule de l'étudiant
                          name: `${etudiant.utilisateur.prenom} ${etudiant.utilisateur.nom}`, // Nom complet de l'étudiant
                          note_class: etudiant.notes?.note_class || 0, // Note de classe
                          note_exam: etudiant.notes?.note_exam || 0, // Note d'examen
                          coefficient: cours.filiere_module.coefficient, // Coefficient du module
                        }))
                      : [], // Vérifier si etudiants est un tableau avant de le parcourir
                  },
                ],
              };

              if (existingFiliere) {
                // Ajouter le semestre à la filière existante
                existingFiliere.semestres.push(semestreData);
              } else {
                // Ajouter une nouvelle filière
                acc.push({
                  id: filiere.id_filiere, // ID de la filière
                  name: `L${
                    filiere.niveau.toLowerCase().includes("primaire")
                      ? "1"
                      : "2"
                  } ${filiere.nom}`, // Nom formaté
                  coefficients: Array.isArray(filiere.filiere_module)
                    ? filiere.filiere_module.map((mod: any) => mod.coefficient)
                    : [], // Vérifier si filiere_module est un tableau avant de le parcourir
                  semestres: [semestreData], // Ajouter le premier semestre
                });
              }

              return acc;
            },
            []
          );

          // Mettre à jour l'état avec les données formatées
          console.log(formattedClasses);
          setClasses(formattedClasses);

          // ...existing code...
        } else {
          console.error("L'utilisateur connecté n'est pas un enseignant.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }

    fetchStats();
  }, []);
  return (
    <div>
      <div className="mt-8 ml-2 mb-4 flex flex-col">
        <NoteRegistre classes={classes} />
      </div>
    </div>
  );
}
