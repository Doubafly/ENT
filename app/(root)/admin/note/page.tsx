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
        const response = await fetch("/api/filieres");
        const data = await response.json();
        console.log(data);

        if (data.filieres) {
          // Transformer les données API en structure attendue
          const formattedClasses = data.filieres.map((filiere: any) => {
            // Vérifier le niveau et formater le nom de la classe
            let niveauLabel = "";
            if (filiere.niveau.toLowerCase().includes("primaire")) {
              niveauLabel = `L1 ${filiere.nom}`;
            } else if (filiere.niveau.toLowerCase().includes("secondaire")) {
              niveauLabel = `L2 ${filiere.nom}`;
            } else {
              niveauLabel = `Autre ${filiere.nom}`;
            }
            return {
              id: filiere.id_filiere,
              name: niveauLabel, // Intégration du niveau dans le nom de la classe
              coefficients: filiere.filiere_module.map(
                (mod: any) => mod.coefficient
              ), // Récupérer tous les coefficients des modules
              semestres: filiere.filiere_module.flatMap(
                (mod: any, Index: number) =>
                  mod.cours.map((cours: any) => ({
                    id: `${filiere.id_filiere}-${cours.semestre}`, // ID unique basé sur la filière et le semestre
                    name: cours.semestre, // Correction : Prendre le semestre ici
                    modules: [
                      {
                        id: mod.id_module,
                        name: mod.module.nom,
                        students: filiere.etudiants.map((etudiant: any) => ({
                          id: etudiant.matricule,
                          name: `${etudiant.utilisateur.prenom} ${etudiant.utilisateur.nom}`,
                          note_class: etudiant.notes[Index]?.note_class || 0,
                          note_exam: etudiant.notes[Index]?.note_exam || 0,
                          coefficient: mod.coefficient, // Associer le coefficient au module
                        })),
                      },
                    ],
                  }))
              ),
            };
          });
          setClasses(formattedClasses);
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
