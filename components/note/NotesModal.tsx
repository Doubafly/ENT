import { Note } from "@/type/note";

interface Props {
  note: Note;
  onClose: () => void;
}

export default function NotesModal({ note, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">
          Détail du module : {note.cours.filiere_module.module.nom}
        </h2>
        <p><strong>Description :</strong> {note.cours.filiere_module.module.description}</p>
        <p><strong>Note de classe :</strong> {note.note_class}</p>
        <p><strong>Note d'examen :</strong> {note.note_exam}</p>
        <button onClick={onClose} className="mt-4 bg-gray-500 text-white px-3 py-1 rounded">
          Fermer
        </button>
      </div>
    </div>
  );
}
