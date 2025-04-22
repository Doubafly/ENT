"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import FormulaireAnnexe from "../formulaires/FormulaireAnnexe";
import { ConfirmDialog } from "../ConfirmDialog";

type Annexe = {
  id_annexe: number;
  nom: string;
  adresse: string;
  ville?: string;
  region?: string;
};

const ListeAnnexes: React.FC = () => {
  const [annexes, setAnnexes] = useState<Annexe[]>([]);
  const [selectedAnnexe, setSelectedAnnexe] = useState<Annexe | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnnexeOpen, setIsAnnexeOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const itemsPerPage = 5;

  const [editFormData, setEditFormData] = useState<Omit<Annexe, "id_annexe">>({
    nom: "",
    adresse: "",
    ville: "",
    region: ""
  });

  const fetchAnnexes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/annexes");
      if (!response.ok) throw new Error("Échec du chargement des annexes");
      const data = await response.json();
      setAnnexes(data.annexes || []);
    } catch (error) {
      console.error("Erreur:", error);
      setError(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnexes();
  }, []);

  const handleCreateSuccess = () => {
    fetchAnnexes();
    setSuccessMessage("Annexe créée avec succès");
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsAnnexeOpen(false);
  };

  const handleSelect = (annexe: Annexe) => {
    setSelectedAnnexe(prev => 
      prev?.id_annexe === annexe.id_annexe ? null : annexe
    );
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedAnnexe) return;
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`/api/annexes/${selectedAnnexe.id_annexe}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la suppression");
      }

      await fetchAnnexes();
      setSelectedAnnexe(null);
      setSuccessMessage("Annexe supprimée avec succès");
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
    if (!selectedAnnexe) return;
    setEditFormData({
      nom: selectedAnnexe.nom,
      adresse: selectedAnnexe.adresse,
      ville: selectedAnnexe.ville || "",
      region: selectedAnnexe.region || ""
    });
    setIsEditMode(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnnexe) return;
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`/api/annexes/${selectedAnnexe.id_annexe}`, {
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

      await fetchAnnexes();
      setSuccessMessage("Annexe modifiée avec succès");
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
  const totalPages = Math.ceil(annexes.length / itemsPerPage);
  const currentAnnexes = annexes.slice(
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
          onClick={fetchAnnexes}
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
          <h2 className="text-xl font-semibold">Liste des Annexes</h2>
          <span className="text-sm text-gray-500">
            {annexes.length} annexe{annexes.length !== 1 ? 's' : ''} au total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Adresse</th>
                <th className="p-3 text-left">Ville</th>
                <th className="p-3 text-left">Région</th>
              </tr>
            </thead>
            <tbody>
              {currentAnnexes.length > 0 ? (
                currentAnnexes.map((annexe) => (
                  <tr
                    key={annexe.id_annexe}
                    className={`cursor-pointer border-b ${
                      selectedAnnexe?.id_annexe === annexe.id_annexe
                        ? "bg-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelect(annexe)}
                  >
                    <td className="p-3 font-medium">{annexe.nom}</td>
                    <td className="p-3">{annexe.adresse}</td>
                    <td className="p-3">{annexe.ville || "-"}</td>
                    <td className="p-3">{annexe.region || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Aucune annexe disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {annexes.length > 0 && (
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
          onClick={() => setIsAnnexeOpen(true)}
        >
          <FaPlus className="mr-2" /> Ajouter
        </button>

        <button
          className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
            selectedAnnexe
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedAnnexe}
          onClick={handleEditClick}
        >
          <FaEdit className="mr-2" /> Modifier
        </button>

        <button
          onClick={handleDeleteClick}
          className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
            selectedAnnexe
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedAnnexe}
        >
          <FaTrash className="mr-2" /> Supprimer
        </button>

        {selectedAnnexe && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium mb-2">Détails de l'annexe</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Nom:</span> {selectedAnnexe.nom}</p>
              <p><span className="font-medium">Adresse:</span> {selectedAnnexe.adresse}</p>
              {selectedAnnexe.ville && <p><span className="font-medium">Ville:</span> {selectedAnnexe.ville}</p>}
              {selectedAnnexe.region && <p><span className="font-medium">Région:</span> {selectedAnnexe.region}</p>}
            </div>
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
                <h2 className="text-xl font-bold">Modifier l'annexe</h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setSelectedAnnexe(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={editFormData.nom}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={editFormData.adresse}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="ville"
                    value={editFormData.ville}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Région
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={editFormData.region}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setSelectedAnnexe(null);
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
      {isAnnexeOpen && !isEditMode && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div
            className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <FormulaireAnnexe
              onCancel={() => setIsAnnexeOpen(false)}
              title="Création d'une Nouvelle Annexe"
              onSuccess={handleCreateSuccess}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer l'annexe "${selectedAnnexe?.nom}" ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText={isProcessing ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
        
      />
    </div>
  );
};

export default ListeAnnexes;