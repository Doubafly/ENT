"use client";
import NoteRegistre from "@/components/note/NoteRegistre";
import EtudiantNoteTable from "@/components/table/EtudiantNoteTable";
import FiliereTable from "@/components/table/FiliereTable";
import NoteTable from "@/components/table/NoteTable";
import Semestre from "@/components/table/SemestreTableau";
import { useEffect, useState } from "react";
import { log } from "util";

export default function page() {
  interface Student {
    id: number;
    matricule: string;
    name: string;
    id_cours: number;
    session: string;
    id_note: number;
    note_class: number;
    note_exam: number;
    coefficient: number;
  }
  
  interface Module {
    id: number;
    name: string;
    students: Student[];
  }
  
  interface Semestre {
    id: string;
    name: string;
    session: string;
    modules: Module[];
  }
  
  interface Filiere {
    id: number;
    name: string;
    coefficients: number[];
    sessions: string[];
    semestres: Semestre[];
  }
  
  const [classes, setClasses] = useState<Filiere[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response2 = await fetch("/api/cours");
        const data1 = await response2.json();

        console.log(data1);
        

        // if(data2.data) {
        //   data2.data.forEach((session: any) => {
        //     console.log(session.annee_academique);
        //   });
        // }
        if (data1.cours) {
          const filieresMap = new Map();
        
          data1.cours.forEach((cours: any, index: number) => {
            const filiere = cours.filiere_module.filiere;
            const filiereId = filiere.id_filiere;
            const module = cours.filiere_module.module;
            const semestreId = `${filiereId}-${cours.semestre}`;
            const notes= cours.notes.map((note: any) => ({
              id_note: note.id_note,
              note_class: note.note_class,
              note_exam: note.note_exam,
              commentaire_etudiant: note.commentaire_etudiant,
              statut_reclamation: note.statut_reclamation,
              commentaire_enseignant: note.commentaire_enseignant,
              id_etudiant: note.etudiant.id,
            }))
        
            if (!filieresMap.has(filiereId)) {
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
        
              filieresMap.set(filiereId, {
                id: filiereId,
                name: niveauLabel,
                coefficients: [],
                sessions: cours.sessions.annee_academique,
                semestres: new Map(),
              });
            }
        
            const filiereData = filieresMap.get(filiereId);
            filiereData.coefficients.push(cours.filiere_module.coefficient);
        
            if (!filiereData.semestres.has(semestreId)) {
              filiereData.semestres.set(semestreId, {
                id: semestreId,
                name: cours.semestre,
                modules: [],
              });
            }
        
            const students = (cours.filiere_module.filiere.etudiants || []).map((etudiant: any) => ({
              id: etudiant.id,
              matricule: etudiant.matricule,
              name: `${etudiant.utilisateur.prenom} ${etudiant.utilisateur.nom}`,
              id_cours: cours.id_cours,
              session: cours.sessions.annee_academique,
              notes:notes.filter((note: any) => note.id_etudiant === etudiant.id),
              coefficient: cours.filiere_module.coefficient,
            }));
        
            filiereData.semestres.get(semestreId).modules.push({
              id: module.id_module,
              name: module.nom,
              students,
            });
          });
        
          // Finaliser et convertir les maps en tableau
          const formattedClasses = Array.from(filieresMap.values()).map((filiere) => ({
            ...filiere,
            semestres: Array.from(filiere.semestres.values()),
          }));
        
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
