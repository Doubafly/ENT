"use client";
import NoteRegistre from "@/components/note/NoteRegistre";
import EtudiantNoteTable from "@/components/table/EtudiantNoteTable";
import FiliereTable from "@/components/table/FiliereTable";
import NoteTable from "@/components/table/NoteTable";
import Semestre from "@/components/table/SemestreTableau";
import { useState } from "react";

const classes = [
  {
    id: 1,
    name: "L1 Informatique",
    semestres: [
      {
        id: 1,
        name: "Semestre 1",
        modules: [
          {
            id: 101,
            name: "Programmation",
            students: [
              { id: 1, name: "Banca Bissi Ba", note_class: 15, note_exam: 0 },
              { id: 2, name: "Kadidiatou Ba", note_class: 16, note_exam: 0 },
              { id: 3, name: "Sekou Ba", note_class: 9, note_exam: 0 },
            ],
          },
          {
            id: 102,
            name: "Algèbre",
            students: [
              { id: 1, name: "Banca Bissi Ba", note_class: 14, note_exam: 0 },
              { id: 2, name: "Kadidiatou Ba", note_class: 12, note_exam: 0 },
              { id: 3, name: "Sekou Ba", note_class: 10, note_exam: 0 },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "Semestre 2",
        modules: [
          // Ajoutez les modules du semestre 2 ici
        ],
      },
    ],
  },
  {
    id: 2,
    name: "L2 Informatique",
    semestres: [
      {
        id: 1,
        name: "Semestre 1",
        modules: [
          {
            id: 201,
            name: "Base de Données",
            students: [
              { id: 7, name: "Mamadou Ba", note_class: 19, note_exam: 0 },
              { id: 8, name: "Dayfourou Ba", note_class: 16, note_exam: 0 },
              { id: 9, name: "Aly Ba", note_class: 16, note_exam: 0 },
            ],
          },
          {
            id: 202,
            name: "Systèmes d'exploitation",
            students: [
              { id: 7, name: "Mamadou Ba", note_class: 18, note_exam: 0 },
              { id: 8, name: "Dayfourou Ba", note_class: 17, note_exam: 0 },
              { id: 9, name: "Aly Ba", note_class: 16, note_exam: 0 },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "Semestre 2",
        modules: [
          // Ajoutez les modules du semestre 2 ici
        ],
      },
    ],
  },
];
export default function page() {
  const [selectedSemestre, setSelectedSemestre] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  return (
    <div>
      <div className="mt-8 ml-2 mb-4 flex flex-col">
        <NoteRegistre classes={classes} />
      </div>
    </div>
  );
}
