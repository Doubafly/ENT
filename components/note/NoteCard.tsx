import { useState } from "react";
import NotesModal from "./NotesModal";
import { Note } from "@/type/note";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="border p-4 rounded shadow">
      <p className="font-medium">{note.cours.filiere_module.module.nom}</p>
      <p>Note classe : {note.note_class}</p>
      <p>Note examen : {note.note_exam}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-3 py-1 rounded">
          Voir
        </button>
        <button onClick={() => window.print()} className="bg-green-600 text-white px-3 py-1 rounded">
          Imprimer
        </button>
      </div>

      {showModal && <NotesModal note={note} onClose={() => setShowModal(false)} />}
    </div>
  );
}
