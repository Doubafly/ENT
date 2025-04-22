"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import FormulaireSession from "../formulaires/FormulaireSession";
import { ConfirmDialog } from "../ConfirmDialog";

type Session = {
  id_sessions: number;
  annee_academique: string;
  cours?: {
    id_cours: number;
    semestre: string;
    filiere_module: {
      code_module: string;
      volume_horaire: number;
      filiere: {
        nom: string;
      };
      module: {
        nom: string;
      };
    };
    enseignant: {
      id: number;
      specialite: string;
      utilisateur: {
        nom: string;
        prenom: string;
      };
    };
  }[];
};

const ListeSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const itemsPerPage = 5;

  const [editFormData, setEditFormData] = useState<{
    annee_academique: string;
  }>({
    annee_academique: "",
  });

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/sessions");
      if (!response.ok) throw new Error("Échec du chargement des sessions");
      const { data } = await response.json(); // Modification ici pour extraire 'data'
      setSessions(data || []);
    } catch (error) {
      console.error("Erreur:", error);
      setError(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreateSuccess = () => {
    fetchSessions();
    setSuccessMessage("Session créée avec succès");
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsSessionOpen(false);
  };

  const handleSelect = (session: Session) => {
    setSelectedSession(prev => 
      prev?.id_sessions === session.id_sessions ? null : session
    );
  };

  const handleDeleteClick = (session: Session) => {
    setSelectedSession(session);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedSession) return;
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${selectedSession.id_sessions}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la suppression");
      }

      await fetchSessions();
      setSelectedSession(null);
      setSuccessMessage("Session supprimée avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      setError(error instanceof Error ? error.message : "Erreur de suppression");
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleEditClick = () => {
    if (!selectedSession) return;
    setEditFormData({
      annee_academique: selectedSession.annee_academique,
    });
    setIsEditMode(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${selectedSession.id_sessions}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la modification");
      }

      await fetchSessions();
      setSuccessMessage("Session modifiée avec succès");
      setIsEditMode(false);
    } catch (error) {
      console.error("Erreur:", error);
      setError(error instanceof Error ? error.message : "Erreur de modification");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Pagination
  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const currentSessions = sessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-2xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
        <strong>Erreur !</strong> {error}
        <button 
          onClick={fetchSessions}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-6">
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <div className="w-full md:w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Liste des Sessions Académiques</h2>
          <span className="text-sm text-gray-500">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} au total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Année Académique</th>
                <th className="p-3 text-left">Nombre de Cours</th>
              </tr>
            </thead>
            <tbody>
              {currentSessions.length > 0 ? (
                currentSessions.map((session) => (
                  <tr
                    key={session.id_sessions}
                    className={`cursor-pointer border-b ${
                      selectedSession?.id_sessions === session.id_sessions
                        ? "bg-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelect(session)}
                  >
                    <td className="p-3 font-medium">{session.annee_academique}</td>
                    <td className="p-3">
                      {session.cours?.length || 0} cours
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-gray-500">
                    Aucune session disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {sessions.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-300"
            >
              Précédent
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-300"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      <div className="w-full md:w-1/4 space-y-4">
        <button
          className="bg-green-600 text-white px-4 py-2 w-full rounded-lg flex items-center justify-center hover:bg-green-700"
          onClick={() => setIsSessionOpen(true)}
        >
          <FaPlus className="mr-2" /> Ajouter
        </button>

        <button
          className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
            selectedSession
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedSession}
          onClick={handleEditClick}
        >
          <FaEdit className="mr-2" /> Modifier
        </button>

        <button
          onClick={() => selectedSession && handleDeleteClick(selectedSession)}
          className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
            selectedSession
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedSession}
        >
          <FaTrash className="mr-2" /> Supprimer
        </button>

        {selectedSession && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium mb-2">Détails de la session</h3>
            <p className="text-sm">
              <span className="font-medium">Année académique:</span> {selectedSession.annee_academique}
            </p>
            <p className="text-sm">
              <span className="font-medium">Nombre de cours:</span> {selectedSession.cours?.length || 0}
            </p>
          </div>
        )}
      </div>

      {/* Modal de modification */}
      {isEditMode && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div
            className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Modifier la session</h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setSelectedSession(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année académique *
                  </label>
                  <input
                    type="text"
                    name="annee_academique"
                    value={editFormData.annee_academique}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setSelectedSession(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de création */}
      {isSessionOpen && !isEditMode && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div
            className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <FormulaireSession
              onCancel={() => setIsSessionOpen(false)}
              title="Création d'une Nouvelle Session"
              onSuccess={handleCreateSuccess}
            />
          </div> 
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer la session "${selectedSession?.annee_academique}" ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText={isProcessing ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
      />
    </div>
  );
};

export default ListeSessions;