"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import FormulaireFiliere from "../formulaires/FormulaireFiliere";
import { ConfirmDialog } from "../ConfirmDialog";

type Filiere = {
  id_filiere: number;
  nom: string;
  description: string;
  niveau: FilieresNiveau;
  montant_annuel: number;
  id_annexe?: number | null;
  annexe?: {
    id_annexe: number;
    nom: string;
  };
};

type Annexe = {
  id_annexe: number;
  nom: string;
 
};

enum FilieresNiveau {
  Licence = "Licence",
  Master1 = "Master1",
  Master2 = "Master2",
  Doctorat = "Doctorat"
}

const ListeFilieres: React.FC = () => {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [annexes, setAnnexes] = useState<Annexe[]>([]);
  const [selectedFiliere, setSelectedFiliere] = useState<Filiere | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFiliereOpen, setIsFiliereOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filiereToDelete, setFiliereToDelete] = useState<Filiere | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage: number = 5;

  const [editFormData, setEditFormData] = useState<{
    nom: string;
    description: string;
    niveau: FilieresNiveau;
    montant_annuel: number;
    id_annexe?: number | null;
  }>({
    nom: "",
    description: "",
    niveau: FilieresNiveau.Licence,
    montant_annuel: 0,
    id_annexe: null
  });

  // Charger les filières et annexes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [filieresRes, annexesRes] = await Promise.all([
          fetch("/api/filieres"),
          fetch("/api/annexes")
        ]);

        if (!filieresRes.ok) throw new Error("Erreur lors du chargement des filières");
        if (!annexesRes.ok) throw new Error("Erreur lors du chargement des annexes");

        const filieresData = await filieresRes.json();
        const annexesData = await annexesRes.json();

        if (!Array.isArray(filieresData.filieres)) {
          throw new Error("Format de données invalide pour les filières");
        }

        setFilieres(filieresData.filieres);
        setAnnexes(annexesData.annexes || []);
      } catch (err) {
        console.error("Erreur:", err);
        setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateSuccess = () => {
    setFilieres([...filieres]); // Example: Resetting to the current state
  };

  const handleSelect = (filiere: Filiere) => {
    setSelectedFiliere(
      filiere.id_filiere === selectedFiliere?.id_filiere ? null : filiere
    );
  };

  const handleDeleteClick = (filiere: Filiere) => {
    setFiliereToDelete(filiere);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!filiereToDelete) return;

    try {
      const response = await fetch(`/api/filieres/${filiereToDelete.id_filiere}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression");
      }

      setFilieres(filieres.filter(f => f.id_filiere !== filiereToDelete.id_filiere));
      setSelectedFiliere(null);
    } catch (error) {
      console.error("Erreur:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la suppression");
    } finally {
      setShowDeleteConfirm(false);
      setFiliereToDelete(null);
    }
  };

  const handleEditClick = () => {
    if (!selectedFiliere) return;

    setEditFormData({
      nom: selectedFiliere.nom,
      description: selectedFiliere.description || "",
      niveau: selectedFiliere.niveau,
      montant_annuel: selectedFiliere.montant_annuel,
      id_annexe: selectedFiliere.id_annexe ?? null
    });
    setIsEditMode(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiliere) return;

    try {
      // Validation des données
      if (!editFormData.nom.trim()) {
        throw new Error("Le nom de la filière est obligatoire");
      }

      if (editFormData.montant_annuel < 0) {
        throw new Error("Le montant annuel ne peut pas être négatif");
      }

      const response = await fetch(`/api/filieres/${selectedFiliere.id_filiere}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editFormData,
          id_annexe: editFormData.id_annexe || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la modification");
      }

      const updatedFiliere = await response.json();
      
      setFilieres(
        filieres.map(f =>
          f.id_filiere === selectedFiliere.id_filiere 
            ? { ...f, ...updatedFiliere.filiere } 
            : f
        )
      );

      setIsFiliereOpen(false);
      setIsEditMode(false);
      setSelectedFiliere(null);
    } catch (error) {
      console.error("Erreur détaillée:", error);
      alert(
        error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de la modification"
      );
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setEditFormData(prev => ({
      ...prev,
      [name]: name === "montant_annuel" || name === "id_annexe" 
        ? Number(value) || null
        : value
    }));
  };

  // Pagination
  const totalPages = Math.ceil(filieres.length / itemsPerPage);
  const indexOfLastFiliere = currentPage * itemsPerPage;
  const indexOfFirstFiliere = indexOfLastFiliere - itemsPerPage;
  const currentFilieres = filieres.slice(indexOfFirstFiliere, indexOfLastFiliere);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong>Erreur!</strong> {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Liste des Filières</h2>
          <span className="text-sm text-gray-500">
            {filieres.length} filière{filieres.length !== 1 ? 's' : ''} au total
          </span>
        </div>

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
              {currentFilieres.length > 0 ? (
                currentFilieres.map((filiere) => (
                  <tr
                    key={filiere.id_filiere}
                    className={`cursor-pointer border-b ${
                      selectedFiliere?.id_filiere === filiere.id_filiere
                        ? "bg-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelect(filiere)}
                  >
                    <td className="p-3 font-medium">{filiere.nom}</td>
                    <td className="p-3 text-gray-600">
                      {filiere.description || "-"}
                    </td>
                    <td className="p-3">
                      {filiere.niveau.replace("Master1", "Master 1").replace("Master2", "Master 2")}
                    </td>
                    <td className="p-3">
                      {filiere.montant_annuel.toLocaleString()} €
                    </td>
                    <td className="p-3">
                      {filiere.annexe?.nom || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    Aucune filière disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filieres.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Précédent
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      <div className="w-full md:w-1/4 space-y-4">
        <button
          className="bg-green-600 text-white px-4 py-2 w-full rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
          onClick={() => setIsFiliereOpen(true)}
        >
          <FaPlus className="mr-2" /> Ajouter
        </button>

        <button
          className={`w-full px-4 py-2 rounded-lg flex items-center justify-center transition-colors ${
            selectedFiliere
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedFiliere}
          onClick={handleEditClick}
        >
          <FaEdit className="mr-2" /> Modifier
        </button>

        <button
          onClick={() => selectedFiliere && handleDeleteClick(selectedFiliere)}
          className={`w-full px-4 py-2 rounded-lg flex items-center justify-center transition-colors ${
            selectedFiliere
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedFiliere}
        >
          <FaTrash className="mr-2" /> Supprimer
        </button>

        {selectedFiliere && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium mb-2">Détails de la filière</h3>
            <p className="text-sm">
              <span className="font-medium">Nom:</span> {selectedFiliere.nom}
            </p>
            <p className="text-sm">
              <span className="font-medium">Niveau:</span> {selectedFiliere.niveau}
            </p>
            <p className="text-sm">
              <span className="font-medium">Montant:</span> {selectedFiliere.montant_annuel} €
            </p>
            {selectedFiliere.annexe && (
              <p className="text-sm">
                <span className="font-medium">Annexe:</span> {selectedFiliere.annexe.nom}
              </p>
            )}
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
                <h2 className="text-xl font-bold">Modifier la filière</h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setSelectedFiliere(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la filière *
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
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau *
                  </label>
                  <select
                    name="niveau"
                    value={editFormData.niveau}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={FilieresNiveau.Licence}>Licence</option>
                    <option value={FilieresNiveau.Master1}>Master 1</option>
                    <option value={FilieresNiveau.Master2}>Master 2</option>
                    <option value={FilieresNiveau.Doctorat}>Doctorat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant annuel (€) *
                  </label>
                  <input
                    type="number"
                    name="montant_annuel"
                    value={editFormData.montant_annuel}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annexe
                  </label>
                  <select
                    name="id_annexe"
                    value={editFormData.id_annexe || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Aucune annexe --</option>
                    {annexes.map((annexe) => (
                      <option key={annexe.id_annexe} value={annexe.id_annexe}>
                        {annexe.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setSelectedFiliere(null);
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
      {isFiliereOpen && !isEditMode && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div
            className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md"
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

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer la filière "${filiereToDelete?.nom}" ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Supprimer"
        cancelText="Annuler"
        
      />
    </div>
  );
};

export default ListeFilieres;