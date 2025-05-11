"use client";;
import { useEffect, useState } from "react";
import NotesFilter from "@/components/note/NotesFilter";
import SemestreNotesList from "@/components/note/SemestreNotesList";
import { Etudiant, Note } from "@/type/note"
export default function page() {
       
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const [notesFiltrees, setNotesFiltrees] = useState<Note[]>([]);

  const [anneesDisponibles, setAnneesDisponibles] = useState<string[]| unknown[]>([]);
  const [anneeSelectionnee, setAnneeSelectionnee] = useState<string|unknown>("")
    // function handleSelectSemestre(id: string) {
    //   // Parcourt les tableaux dans notesParSemestre

    //   setImprimeModal(true);
    //   const resultat = Object.entries(notesParSemestre)
    //     .flatMap(([semestre, items]) => 
    //       items.filter((item, index) => index.toString() === id)
    //     );
    //   if (resultat.length > 0) {
    //     setImprimeData(resultat);
    //   } else {
    //     console.log("Aucun élément trouvé pour l'ID :", id);
    //   }
    // }
      
    

// Récupération initiale
useEffect(() => {
  async function fetchEtudiantEtNotes() {
    try {
      const userResponse = await fetch("/api/auth/session", {
        credentials: "include",
      });
      const userData = await userResponse.json();
      const etudiantId = userData.user.etudiant?.id;

      const response = await fetch("/api/utilisateurs/etudiants");
      const data = await response.json();
      const etudiant = data.etudiants.find((e) => e.id === etudiantId);
      if (!etudiant) return;

      setEtudiant(etudiant);

      const notes = etudiant.notes || [];

      const annees = [
        ...new Set(notes.map((n: Note) => n.cours.sessions.annee_academique)),
      ];

      setAnneesDisponibles(annees);
      setAnneeSelectionnee(annees[0]); // Cela déclenchera un autre useEffect

    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }

  fetchEtudiantEtNotes();
}, []);

// Mise à jour des notes filtrées quand l’année sélectionnée change
useEffect(() => {
  if (!etudiant || !anneeSelectionnee) return;

  const notes = etudiant.notes || [];

  const notesFiltres = notes.filter(
    (note: Note) =>
      note.cours.sessions.annee_academique === anneeSelectionnee
  );

  setNotesFiltrees(notesFiltres);
}, [anneeSelectionnee, etudiant]);

  
   
    
 
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Mes Notes</h1>
        <NotesFilter
          annees={anneesDisponibles}
          selected={anneeSelectionnee}
          onChange={setAnneeSelectionnee}
        />
        <SemestreNotesList notes={notesFiltrees} />
      </div>
    );
}


