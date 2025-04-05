"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import FormulaireFiliere from "../formulaires/FormulaireFiliere";
import { ConfirmDialog } from "../ConfirmDialog";

type Filiere = {
  id_filiere: number;
  nom: string;
  description: string;
  niveau: string;
  montant_annuel: number;
  id_annexe?: number;
  annexe?: {
    nom: string;
  };
};

const ListeFilieres: React.FC = () => {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [selectedFiliere, setSelectedFiliere] = useState<Filiere | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFiliereOpen, setIsFiliereOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filiereToDelete, setFiliereToDelete] = useState<Filiere | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Filiere, "id_filiere">>({
    nom: "",
    description: "",
    niveau: "",
    montant_annuel: 0
  });
  const itemsPerPage: number = 5;

  const handleDeleteClick = (filiere: Filiere) => {
    setFiliereToDelete(filiere);
    setShowDeleteConfirm(true);
  };

  const handleCreateSuccess = () => {
    fetchFilieres();
  };

  // Fonction pour charger les filières depuis l'API
  const fetchFilieres = async () => {
    try {
      const response = await fetch("/api/filieres");
      if (!response.ok)
        throw new Error("Erreur lors du chargement des filières");
      const result = await response.json();
      if (!Array.isArray(result.data)) {
        throw new Error("Les données récupérées ne sont pas un tableau !");
      }
      setFilieres(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Charger les filières au montage du composant
  useEffect(() => {
    fetchFilieres();
  }, []);

  const totalPages = Math.ceil(filieres.length / itemsPerPage);
  const indexOfLastFiliere = currentPage * itemsPerPage;
  const indexOfFirstFiliere = indexOfLastFiliere - itemsPerPage;
  const currentFilieres = filieres.slice(indexOfFirstFiliere, indexOfLastFiliere);

  const handleSelect = (filiere: Filiere) => {
    setSelectedFiliere(
      filiere.id_filiere === selectedFiliere?.id_filiere ? null : filiere
    );
  };

  const handleDelete = async () => {
    if (!filiereToDelete) return;

    try {
      const response = await fetch(`/api/filieres/${filiereToDelete.id_filiere}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setFilieres(
        filieres.filter((f) => f.id_filiere !== filiereToDelete.id_filiere)
      );
      setSelectedFiliere(null);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // Modification - Préparation du formulaire
  const handleEditClick = () => {
    if (!selectedFiliere) return;

    setEditFormData({
      nom: selectedFiliere.nom,
      description: selectedFiliere.description,
      niveau: selectedFiliere.niveau,
      montant_annuel: selectedFiliere.montant_annuel,
      id_annexe: selectedFiliere.id_annexe
    });
    setIsEditMode(true);
  };

  // Soumission des modifications
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiliere) return;

    try {
      const response = await fetch(`/api/filieres/${selectedFiliere.id_filiere}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) throw new Error("Erreur lors de la modification");

      const updatedFiliere = await response.json();
      setFilieres(
        filieres.map((f) =>
          f.id_filiere === selectedFiliere.id_filiere ? updatedFiliere.data : f
        )
      );

      setIsFiliereOpen(false);
      setIsEditMode(false);
      setSelectedFiliere(null);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Gestion des changements dans le formulaire de modification
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ 
      ...prev, 
      [name]: name === "montant_annuel" ? Number(value) : value 
    }));
  };

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg flex items-start">
      <div className="w-3/4">
        <h2 className="text-xl font-semibold mb-4">Liste des Filieres</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Niveau</th>
                <th className="p-3 text-left">Montant</th>
                <th className="p-3 text-left">Annexe</th>
              </tr>
            </thead>
            <tbody>
              {currentFilieres.map((filiere) => (
                <tr
                  key={filiere.id_filiere}
                  className={`cursor-pointer border-b ${
                    selectedFiliere?.id_filiere === filiere.id_filiere
                      ? "bg-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelect(filiere)}
                >
                  <td className="p-3">{filiere.nom}</td>
                  <td className="p-3">{filiere.description}</td>
                  <td className="p-3">{filiere.niveau}</td>
                  <td className="p-3">{filiere.montant_annuel} €</td>
                  <td className="p-3">{filiere.annexe?.nom || "-"}</td>
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
          onClick={() => setIsFiliereOpen(true)}
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
                <h1 className="text-xl font-bold">Modifier la Filière</h1>

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
                    <label className="block text-gray-700 mb-2">Description :</label>
                    <input
                      type="text"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Niveau :</label>
                    <select
                      name="niveau"
                      value={editFormData.niveau}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionnez un niveau</option>
                      <option value="Licence">Licence</option>
                      <option value="MASTER">Master</option>
                      <option value="DOCTORAT">Doctorat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Montant annuel :</label>
                    <input
                      type="number"
                      name="montant_annuel"
                      value={editFormData.montant_annuel}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min="0"
                    />
                  </div>


                  <div>
                    <label className="block text-gray-700 mb-2">Annexes :</label>
                    <input
                      type="text"
                      name="id_annexe"
                      value={editFormData.id_annexe}
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
                        setIsFiliereOpen(false);
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
        {isFiliereOpen && !isEditMode && (
          <div
            className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center"
            onClick={() => setIsFiliereOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-6 shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <FormulaireFiliere
                onCancel={() => setIsFiliereOpen(false)}
                title="Création d'une Nouvelle Filière"
                onSuccess={handleCreateSuccess}
              />
            </div>
          </div>
        )}
        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedFiliere
              ? "bg-yellow-600 text-white hover:bg-yellow-700"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedFiliere}
          onClick={handleEditClick}
        >
          <FaEdit className="mr-1" /> Modifier
        </button>
        <button
          onClick={() => selectedFiliere && handleDeleteClick(selectedFiliere)}
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedFiliere
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedFiliere}
        >
          <FaTrash className="mr-1" /> Supprimer
        </button>
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Confirmer la suppression"
          message={`Êtes-vous sûr de vouloir supprimer définitivement la filière "${filiereToDelete?.nom}" ?`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      </div>
    </div>
  );
};

export default ListeFilieres;