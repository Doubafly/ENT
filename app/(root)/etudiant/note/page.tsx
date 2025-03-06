"use client";
import FiliereTable from "@/components/table/FiliereTable";
import NoteTable from "@/components/table/NoteTable";
import Semestre from "@/components/table/SemestreTableau";
import { useState } from "react";
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
  return (
    <div className="ml-4">
      <h1 className="text-2xl font-bold mb-4 ml-2">Les Notes</h1>
      <div className="mt-8 ml-2 mb-4 flex">
        {/* <Semesters /> */}
        <Semestre
          semestreData={semestreData}
          setSemestre={setSelectedSemestre}
        />
        {/* tableau */}
        <div className="w-3/4 pl-6">
          {selectedSemestre === "" ? (
            <span></span>
          ) : (
            <NoteTable
              semesterName={selectedSemestre}
              data={semestreData[selectedSemestre]}
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
