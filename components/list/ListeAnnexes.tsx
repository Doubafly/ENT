"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAnnexeOpen, setIsAnnexeOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [annexeToDelete, setAnnexeToDelete] = useState<Annexe | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Annexe, "id_annexe">>({
    nom: "",
    adresse: "",
    ville: "",
    region: ""
  });
  const itemsPerPage: number = 5;

  const handleDeleteClick = (annexe: Annexe) => {
    setAnnexeToDelete(annexe);
    setShowDeleteConfirm(true);
  };

  const handleCreateSuccess = () => {
    setAnnexes([...annexes]);
  };

  // Fonction pour charger les annexes depuis l'API
  const fetchAnnexes = async () => {
    try {
      const response = await fetch("/api/annexes");
      if (!response.ok) throw new Error("Erreur lors du chargement des annexes");
      const result = await response.json();
      if (!Array.isArray(result.annexes)) {
        throw new Error("Les données récupérées ne sont pas un tableau !");
      }
      setAnnexes(result.annexes);
    } catch (error) {
      console.error(error);
    }
  };

  // Charger les annexes au montage du composant
  useEffect(() => {
    fetchAnnexes();
  }, []);

  const totalPages = Math.ceil(annexes.length / itemsPerPage);
  const indexOfLastAnnexe = currentPage * itemsPerPage;
  const indexOfFirstAnnexe = indexOfLastAnnexe - itemsPerPage;
  const currentAnnexes = annexes.slice(indexOfFirstAnnexe, indexOfLastAnnexe);

  const handleSelect = (annexe: Annexe) => {
    setSelectedAnnexe(
      annexe.id_annexe === selectedAnnexe?.id_annexe ? null : annexe
    );
  };

  const handleDelete = async () => {
    if (!annexeToDelete) return;

    try {
      const response = await fetch(`/api/annexes/${annexeToDelete.id_annexe}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setAnnexes(annexes.filter(a => a.id_annexe !== annexeToDelete.id_annexe));
      setSelectedAnnexe(null);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // Modification - Préparation du formulaire
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

  // Soumission des modifications
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnnexe) return;

    try {
      const response = await fetch(`/api/annexes/${selectedAnnexe.id_annexe}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) throw new Error("Erreur lors de la modification");

      const updatedAnnexe = await response.json();
      setAnnexes(
        annexes.map(a =>
          a.id_annexe === selectedAnnexe.id_annexe ? updatedAnnexe.annexe : a
        )
      );

      setIsAnnexeOpen(false);
      setIsEditMode(false);
      setSelectedAnnexe(null);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Gestion des changements dans le formulaire de modification
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ 
      ...prev, 
      [name]: value
    }));
  };

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg flex items-start">
      <div className="w-3/4">
        <h2 className="text-xl font-semibold mb-4">Liste des Annexes</h2>
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
              {currentAnnexes.map((annexe) => (
                <tr
                  key={annexe.id_annexe}
                  className={`cursor-pointer border-b ${
                    selectedAnnexe?.id_annexe === annexe?.id_annexe
                      ? "bg-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelect(annexe)}
                >
                     <td className="p-3">{annexe.nom || "-"}</td>
                  <td className="p-3">{annexe.adresse || "-"}</td>
                  <td className="p-3">{annexe.ville || "-"}</td>
                  <td className="p-3">{annexe.region || "-"}</td>
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
          onClick={() => setIsAnnexeOpen(true)}
        >
          <FaPlus className="mr-1" /> Ajouter
        </button>

        {isEditMode && (
          <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div
              className="bg-white rounded-lg p-6 shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <h1 className="text-xl font-bold">Modifier l'Annexe</h1>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Nom :</label>
                    <input
                      type="text"
                      name="nom"
                      value={editFormData.nom}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Adresse :</label>
                    <input
                      type="text"
                      name="adresse"
                      value={editFormData.adresse}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Ville :</label>
                    <input
                      type="text"
                      name="ville"
                      value={editFormData.ville}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Région :</label>
                    <input
                      type="text"
                      name="region"
                      value={editFormData.region}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAnnexeOpen(false);
                        setIsEditMode(false);
                      }}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {isAnnexeOpen && !isEditMode && (
          <div
            className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center"
            onClick={() => setIsAnnexeOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-6 shadow-lg w-96"
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

        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedAnnexe
              ? "bg-yellow-600 text-white hover:bg-yellow-700"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedAnnexe}
          onClick={handleEditClick}
        >
          <FaEdit className="mr-1" /> Modifier
        </button>

        <button
          onClick={() => selectedAnnexe && handleDeleteClick(selectedAnnexe)}
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedAnnexe
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedAnnexe}
        >
          <FaTrash className="mr-1" /> Supprimer
        </button>

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Confirmer la suppression"
          message={`Êtes-vous sûr de vouloir supprimer définitivement l'annexe "${annexeToDelete?.nom}" ?`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      </div>
    </div>
  );
};

export default ListeAnnexes;