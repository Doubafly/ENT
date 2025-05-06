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

          const enseignantId = userData.user.enseignant?.id; // Récupérer l'ID de l'enseignant
  
          if (userData.user && userData.user.type === "Enseignant") {
  
            if (!enseignantId) {
              console.error("Aucun ID enseignant trouvé pour cet utilisateur.");
              return;
            }
          }
            

        const response = await fetch("/api/filieres");
        const data = await response.json();

        if (data.filieres) {
          
          
          const result = data.filieres.filter((item: { filiere_module: { cours: any[]; }[]; })=> {
            return item.filiere_module.some((module: { cours: any[]; }) => {
              return module.cours.some(c => c.enseignant.id === enseignantId);
            });
          });
          
          
          // Transformer les données API en structure attendue
          const formattedClasses = result.map((filiere: any) => {
            // Vérifier le niveau et formater le nom de la classe
            let niveauLabel = "";
            if (filiere.niveau.toLowerCase().includes("primaire")) {
              niveauLabel = `L1 ${filiere.nom}`;
            } else if (filiere.niveau.toLowerCase().includes("secondaire")) {
              niveauLabel = `L2 ${filiere.nom}`;
            }else if (filiere.niveau.toLowerCase().includes("licence")) {
              niveauLabel = `L3 ${filiere.nom}`;
            } else {
              niveauLabel = `${filiere.niveau} ${filiere.nom}`;
            }
          
            // Regrouper les modules par semestre
            const semestresMap = new Map();
          
            filiere.filiere_module.forEach((mod: any, Index: number) => {
              mod.cours.forEach((cours: any) => {
              
                const semestreId = `${filiere.id_filiere}-${cours.semestre}`;
                if (!semestresMap.has(semestreId)) {
                  semestresMap.set(semestreId, {
                    id: semestreId,
                    name: cours.semestre,
                    modules: [],
                  });
                }
                semestresMap.get(semestreId).modules.push({
                  id: mod.id_module,
                  name: mod.module.nom,
                  students: filiere.etudiants.map((etudiant: any) => ({
                    id: etudiant.id,
                    matricule: etudiant.matricule,
                    name: `${etudiant.utilisateur.prenom} ${etudiant.utilisateur.nom}`,
                    id_cours: cours.id_cours,
                    id_note: etudiant.notes[Index]?.id_note || 0,
                    note_class: etudiant.notes[Index]?.note_class || 0,
                    commentaire_etudiant: etudiant.notes[Index]?.commentaire_etudiant || "",
                    commentaire_enseignant: etudiant.notes[Index]?.commentaire_enseignant || "",
                    statut_reclamation: etudiant.notes[Index]?.statut_reclamation || "",
                    note_exam: etudiant.notes[Index]?.note_exam || 0,
                    coefficient: mod.coefficient, // Associer le coefficient au module
                  })),
                });
              });
            });
          
            return {
              id: filiere.id_filiere,
              name: niveauLabel, // Intégration du niveau dans le nom de la classe
              coefficients: filiere.filiere_module.map((mod: any) => mod.coefficient),
              sessions: Array.from(new Set(filiere.filiere_module.flatMap((mod: any) => mod.cours.flatMap((c: any) => c.sessions.annee_academique)))),
              semestres: Array.from(semestresMap.values()), // Convertir la Map en tableau
            };
          });

          
         // Reformater les données pour correspondre à la structure cible
const transformedClasses = formattedClasses.map((classe: any) => ({
  id: classe.id,
  name: classe.name,
  sessions: classe.sessions, // Inclure les années académiques
  semestres: classe.semestres.map((semestre: any) => ({
    id: semestre.id,
    name: semestre.name,
    modules: semestre.modules.map((module: any) => ({
      id: module.id,
      name: module.name,
      students: module.students.map((student: any) => ({
        id: student.id,
        matricule: student.matricule,
        name: student.name,
        notes: [
          {
            id_note: student.id_note,
            note_class: student.note_class,
            note_exam: student.note_exam,
            commentaire_etudiant:student.commentaire_etudiant,
            statut_reclamation: student.statut_reclamation
          },
        ],
        coefficient: student.coefficient,
      })),
    })),
  })),
}));

// Mettre à jour les classes avec la nouvelle structure
setClasses(transformedClasses);

          // Mettre à jour les classes avec la nouvelle structure
          setClasses(transformedClasses);

        }
      } catch (error) {
        console.error("Erreur lors de la récupération des filieres :", error);
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
