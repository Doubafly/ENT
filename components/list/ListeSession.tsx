"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import FormulaireSession from "../formulaires/FormulaireSession";
import { ConfirmDialog } from "../ConfirmDialog";

type Session = {
  id_sessions: number;
  annee_academique: string;
};

const ListeSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Session, "id_sessions">>({
    annee_academique: "",
  });
  const itemsPerPage: number = 5;

  // Charger les sessions depuis l'API
  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions");
      if (!response.ok) throw new Error("Erreur lors du chargement des sessions");
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDeleteClick = (session: Session) => {
    setSessionToDelete(session);
    setShowDeleteConfirm(true);
  };

  const handleCreateSuccess = () => {
    fetchSessions(); // Recharge les sessions après création
    setIsFormOpen(false);
  };

  // Pagination
  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const indexOfLastSession = currentPage * itemsPerPage;
  const indexOfFirstSession = indexOfLastSession - itemsPerPage;
  const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);

  const handleSelect = (session: Session) => {
    setSelectedSession(
      session.id_sessions === selectedSession?.id_sessions ? null : session
    );
  };

  const handleDelete = async () => {
    if (!sessionToDelete) return;

    try {
      const response = await fetch(`/api/sessions/${sessionToDelete.id_sessions}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setSessions(sessions.filter(s => s.id_sessions !== sessionToDelete.id_sessions));
      setSelectedSession(null);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // Modification - Préparation du formulaire
  const handleEditClick = () => {
    if (!selectedSession) return;

    setEditFormData({
      annee_academique: selectedSession.annee_academique,
    });
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // Soumission des modifications
  const handleEditSubmit = async (formData: { annee_academique: string }) => {
    if (!selectedSession) return;

    try {
      const response = await fetch(`/api/sessions/${selectedSession.id_sessions}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de la modification");

      fetchSessions(); // Recharge les données
      setIsFormOpen(false);
      setIsEditMode(false);
      setSelectedSession(null);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg flex items-start">
      <div className="w-3/4">
        <h2 className="text-xl font-semibold mb-4">Liste des Sessions Académiques</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Année Académique</th>
              </tr>
            </thead>
            <tbody>
              {currentSessions.map((session) => (
                <tr
                  key={session.id_sessions}
                  className={`cursor-pointer border-b ${
                    selectedSession?.id_sessions === session.id_sessions
                      ? "bg-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelect(session)}
                >
                  <td className="p-3">{session.id_sessions}</td>
                  <td className="p-3">{session.annee_academique}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-500 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-gray-500 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>

      <div className="w-1/6 flex flex-col items-start space-y-4 mt-11 ml-auto">
        <button
          className="bg-green-600 text-white px-3 py-1.5 w-full rounded-lg flex items-center justify-center hover:bg-green-700 text-sm"
          onClick={() => {
            setIsEditMode(false);
            setIsFormOpen(true);
          }}
        >
          <FaPlus className="mr-1" /> Ajouter
        </button>

        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedSession
              ? "bg-yellow-600 text-white hover:bg-yellow-700"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedSession}
          onClick={handleEditClick}
        >
          <FaEdit className="mr-1" /> Modifier
        </button>

        <button
          onClick={() => selectedSession && handleDeleteClick(selectedSession)}
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedSession
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedSession}
        >
          <FaTrash className="mr-1" /> Supprimer
        </button>

        {isFormOpen && (
          <div
            className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center"
            onClick={() => setIsFormOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-6 shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <FormulaireSession
                onCancel={() => {
                  setIsFormOpen(false);
                  setIsEditMode(false);
                }}
                title={isEditMode ? "Modifier la Session" : "Créer une Session"}
                onSubmit={isEditMode ? handleEditSubmit : handleCreateSuccess}
                isEditMode={isEditMode}
                initialData={editFormData}
              />
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Confirmer la suppression"
          message={`Êtes-vous sûr de vouloir supprimer définitivement la session "${sessionToDelete?.annee_academique}" ?`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      </div>
    </div>
  );
};

export default ListeSessions;