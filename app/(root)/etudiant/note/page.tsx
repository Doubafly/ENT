"use client";
import FiliereTable from "@/components/table/FiliereTable";
import NoteTable from "@/components/table/NoteTable";
import Semestre from "@/components/table/SemestreTableau";
import { useEffect, useState } from "react";
const semestreData = {
  Semestre1: [
    {
      Module: "PHP",
      NoteClasse: 12,
      NoteCompo: 11,
      NoteMatiere: 11.5,
      Validation: "Validée",
    },
    {
      Module: "JAVA",
      NoteClasse: 15,
      NoteCompo: 15,
      NoteMatiere: 15,
      Validation: "Validée",
    },
    {
      Module: "Swing",
      NoteClasse: 15,
      NoteCompo: 12,
      NoteMatiere: 13,
      Validation: "Validée",
    },
    {
      Module: "HTML/CSS",
      NoteClasse: 19,
      NoteCompo: 16,
      NoteMatiere: 17,
      Validation: "Validée",
    },
    {
      Module: "Angular",
      NoteClasse: 11,
      NoteCompo: 8,
      NoteMatiere: 9,
      Validation: "Non Validée",
    },
    {
      Module: "JavaScript",
      NoteClasse: 16,
      NoteCompo: 15,
      NoteMatiere: 16,
      Validation: "Validée",
    },
    {
      Module: "Spring Boot",
      NoteClasse: 13,
      NoteCompo: 17,
      NoteMatiere: 15,
      Validation: "Validée",
    },
    {
      Module: "CMS",
      NoteClasse: 19,
      NoteCompo: 19,
      NoteMatiere: 19,
      Validation: "Validée",
    },
    {
      Module: "React",
      NoteClasse: 14,
      NoteCompo: 13,
      NoteMatiere: 13.5,
      Validation: "Validée",
    },
  ],
  Semestre2: [
    {
      Module: "C#",
      NoteClasse: 14,
      NoteCompo: 10,
      NoteMatiere: 12,
      Validation: "Validée",
    },
    {
      Module: "Python",
      NoteClasse: 17,
      NoteCompo: 16,
      NoteMatiere: 16.5,
      Validation: "Validée",
    },
  ],
  Semestre3: [
    {
      Module: "SQL",
      NoteClasse: 13,
      NoteCompo: 11,
      NoteMatiere: 12,
      Validation: "Validée",
    },
    {
      Module: "NoSQL",
      NoteClasse: 18,
      NoteCompo: 15,
      NoteMatiere: 16,
      Validation: "Validée",
    },
  ],
  Semestre4: [
    {
      Module: "Docker",
      NoteClasse: 15,
      NoteCompo: 12,
      NoteMatiere: 13.5,
      Validation: "Validée",
    },
    {
      Module: "Kubernetes",
      NoteClasse: 19,
      NoteCompo: 18,
      NoteMatiere: 18.5,
      Validation: "Validée",
    },
  ],
};

export default function page() {
  const [selectedSemestre, setSelectedSemestre] = useState("");
  const [notesParSemestre, setNotesParSemestre] = useState<Record<string, Array<{
    NoteClasse: number;
    NoteCompo: number;
    NoteMatiere: number;
    Validation: string;
    annee_academique?: string;
    syllabus?: string;
    volume_horaire?: number;
    coefficient?: number;
    Module: string;
  }>>>({});

  useEffect(() => {
    async function fetchStats() {
      try {
          // Récupérer les informations de l'utilisateur connecté
          const userResponse = await fetch("/api/auth/session", {
            credentials: "include",
          });
          const userData = await userResponse.json();
          const etudiantId = userData.user.etudiant?.id; // Récupérer l'ID de l'étudiant
          
        const response = await fetch("/api/utilisateurs/etudiants");
        const data = await response.json();
        const etudiants = data.etudiants;
        const etudiant = etudiants.find(e => e.id === etudiantId);
          console.log(etudiant);
          
        const notesParSemestre = {};
        
        etudiant.notes.forEach(note => {
          const cours = note.cours || {};
          const semestre = cours.semestre;
          const filiereModule = cours.filiere_module || {};
        
          if (!notesParSemestre[semestre]) {
            notesParSemestre[semestre] = [];
          }
        
          notesParSemestre[semestre].push({
            NoteClasse: note.note_class,
            NoteCompo: note.note_exam,
            NoteMatiere:note.note_exam,
            Validation: note.commentaire,
            annee_academique: cours.sessions?.annee_academique,
            syllabus: filiereModule.syllabus,
            volume_horaire: filiereModule.volume_horaire,
            coefficient: filiereModule.coefficient || 1, // valeur par défaut si pas défini
            Module: filiereModule.module.nom || 'Module inconnu'
          });
        });
        setNotesParSemestre(notesParSemestre)
        console.log(notesParSemestre);
        
        
  
      } catch (error) {
        console.error("Erreur lors de la récupération des filieres :", error);
      }
    }
  
    fetchStats();
  }, []);
  return (
    <div className="ml-4">
      <h1 className="text-2xl font-bold mb-4 ml-2">Les Notes</h1>
      <div className="mt-8 ml-2 mb-4 flex">
        {/* <Semesters /> */}
        <Semestre
          semestreData={notesParSemestre}
          setSemestre={setSelectedSemestre}
        />
        {/* tableau */}
        <div className="w-3/4 pl-6">
          {selectedSemestre === "" ? (
            <span></span>
          ) : (
            <NoteTable
              semesterName={selectedSemestre}
              data={notesParSemestre[selectedSemestre]}
            />
          )}
        </div>
      </div>
      <button
        className=" float-right mr-12 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={print}
      >
        Imprimer{" "}
      </button>
    </div>
  );
}
