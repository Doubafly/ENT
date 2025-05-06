import { FaPrint } from "react-icons/fa";
import NoteCard from "./NoteCard";
import { Note } from "@/type/note";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { date } from "zod";

interface SemestreNotesListProps {
  notes: Note[];
}

export default function SemestreNotesList({ notes }: SemestreNotesListProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [commentaire_etudiant, setcommentaire_etudiant] = useState<string>("");
  const [ShowModal, setShowModal] = useState<boolean>(false);
  const [filterNote, setfilterNote] = useState<Note[]>();
  const [reclamationEnvoyee, setReclamationEnvoyee] = useState<boolean>(false);

  const groupes = notes.reduce((acc, note) => {
    const semestre = note.cours.semestre;
    if (!acc[semestre]) acc[semestre] = [];
    acc[semestre].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  function handleClassChange(id: any) {
    const filtre = groupes[id];
    setfilterNote(filtre);
  }

  const handleSubmitReclamation = async (note: Note, ) => {
    const id = note.id_note;
    
    const payload = {
      commentaire_etudiant: commentaire_etudiant,
      date_reclamation: Date(),
      statut_reclamation: "EnAttente"
    };
    if (id) {
      const res = await fetch(`/api/reclamation/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(`Erreur update pour : ${error.message}`);
      }
    }

    setReclamationEnvoyee(true);
    setTimeout(() => {
      setSelectedModuleId(null);
      setReclamationEnvoyee(false);
    }, 2000);
  };

  return (
    <div>
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white w-full">
          <tr>
            <th className="p-3 text-left">Semestre</th>
            <th className="p-3 text-left">Nombre de module</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupes).map(([semestre, notes]) => (
            <tr key={semestre} className="border-b hover:bg-gray-50 transition duration-150">
              <td className="p-3">{semestre}</td>
              <td className="p-3">{notes.length}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => {
                    handleClassChange(semestre);
                    setShowModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 transition duration-200"
                  title="Voir les détails"
                >
                  <Image src="/icons/eye.png" alt="Détails" width={20} height={20} />
                </button>
                <button
                  className="text-blue-500 hover:text-blue-700 transition duration-200"
                  title="IMPRIMER"
                >
                  <FaPrint />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modale de détails */}
      {ShowModal && filterNote && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-5xl shadow-xl overflow-y-auto max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-500">Détails Semestre</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Procédure de réclamation
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Si vous constatez une erreur dans une note, cliquez sur la ligne concernée pour
                      ouvrir le formulaire de réclamation. Veuillez décrire précisément le problème
                      rencontré (maximum 200 caractères).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="mt-4 space-y-4">
                  <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-blue-500 text-white w-full">
                      <tr>
                        <th className="p-3 text-left">Matière</th>
                        <th className="p-3 text-left">Note Classe</th>
                        <th className="p-3 text-left">Note Examen</th>
                        <th className="p-3 text-left">Coefficient</th>
                        <th className="p-3 text-left">Total</th>
                        <th className="p-3 text-left">Validation</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filterNote.map((note) => (
                        <>
                          <tr
                            key={note.id_cours}
                            className={`border-b hover:bg-gray-50 transition duration-150 cursor-pointer ${
                              selectedModuleId === note.id_cours ? "bg-blue-50" : ""  
                            } ${
                              note.statut_reclamation === "EnAttente" ? "bg-amber-100" : ""  
                            }`}
                            onClick={() => {
                              setSelectedModuleId(note.id_cours);
                              setcommentaire_etudiant(note.commentaire_etudiant?note.commentaire_etudiant:"" );
                            }}
                          >
                            <td className="p-3 font-medium">
                              {note.cours.filiere_module.module.nom}
                            </td>
                            <td className="p-3">{note.note_class}</td>
                            <td className="p-3">{note.note_exam}</td>
                            <td className="p-3">{note.cours.filiere_module.coefficient}</td>
                            <td className="p-3">
                              {(
                                ((note.note_class + note.note_exam) / 2) *
                                note.cours.filiere_module.coefficient
                              ).toFixed(2)}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  (note.note_class + note.note_exam) / 2 >= 10
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {(note.note_class + note.note_exam) / 2 >= 10
                                  ? "Validé"
                                  : "Non Validé"}
                              </span>
                            </td>
                          </tr>

                          {selectedModuleId === note.id_cours && (
                            <tr className="bg-blue-50">
                              <td colSpan={6} className="p-4">
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                  className="bg-white border border-blue-200 rounded-lg shadow-sm p-4"
                                >
                                  <h3 className="font-medium text-blue-600 mb-3">
                                    Formulaire de réclamation - {note.cours.filiere_module.module.nom}
                                  </h3>
                                  {reclamationEnvoyee ? (
                                    <div className="bg-green-50 border border-green-200 rounded p-3 text-green-700">
                                      Votre réclamation a été envoyée avec succès. Nous traiterons
                                      votre demande dans les plus brefs délais.
                                    </div>
                                  ) : (
                                    <>
                                      <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Décrivez le problème (max 200 caractères)
                                        </label>
                                        <textarea
                                          value={commentaire_etudiant}
                                          onChange={(e) => setcommentaire_etudiant(e.target.value)}
                                          placeholder="Ex: La note d'examen semble incorrecte, j'ai estimé avoir obtenu un meilleur résultat..."
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                          rows={3}
                                          maxLength={200}
                                        />
                                        <div className="text-xs text-gray-500 mt-1 text-right">
                                          {commentaire_etudiant.length}/200 caractères
                                        </div>
                                      </div>
                                      <div className="flex justify-end space-x-3">
                                        <button
                                          onClick={() => setSelectedModuleId(null)}
                                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                          Annuler
                                        </button>
                                        <button
                                          onClick={() => handleSubmitReclamation(note)}
                                          disabled={!commentaire_etudiant.trim()}
                                          className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                                            !commentaire_etudiant.trim()
                                              ? "bg-blue-300 cursor-not-allowed"
                                              : "bg-blue-500 hover:bg-blue-600"
                                          }`}
                                        >
                                          Envoyer la réclamation
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}