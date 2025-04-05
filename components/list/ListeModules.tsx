"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import FormulaireModule from "../formulaires/FormulaireModule";
import { ConfirmDialog } from "../ConfirmDialog";

type Module = {
  id_module: number;
  nom: string;
  code: string;
  description: string;
  credit: number;
  volumeHoraire: number;
};

const ListeModules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModuleOpen, setIsModuleOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Module, "id_module">>({
    nom: "",
    code: "",
    description: "",
    credit: 0,
    volumeHoraire: 0
  });
  const itemsPerPage: number = 5;

  const handleDeleteClick = (module: Module) => {
    setModuleToDelete(module);
    setShowDeleteConfirm(true);
  };

  const handleCreateSuccess = () => {
    fetchModules();
  };

  // Fonction pour charger les modules depuis la BD
  const fetchModules = async () => {
    try {
      const response = await fetch("/api/modules");
      if (!response.ok)
        throw new Error("Erreur lors du chargement des modules");
      const result = await response.json();
      if (!Array.isArray(result.modules)) {
        throw new Error("Les données récupérées ne sont pas un tableau !");
      }
      setModules(result.modules);
    } catch (error) {
      console.error(error);
    }
  };

  // Charger les modules au montage du composant
  useEffect(() => {
    fetchModules();
  }, []);

  const totalPages = Math.ceil(modules.length / itemsPerPage);
  const indexOfLastModule = currentPage * itemsPerPage;
  const indexOfFirstModule = indexOfLastModule - itemsPerPage;
  const currentModules = Array.isArray(modules)
    ? modules.slice(indexOfFirstModule, indexOfLastModule)
    : [];

  const handleSelect = (module: Module) => {
    setSelectedModule(
      module.id_module === selectedModule?.id_module ? null : module
    );
  };

  const handleDelete = async () => {
    if (!moduleToDelete) return;

    try {
      const response = await fetch(`/api/modules/${moduleToDelete.id_module}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setModules(
        modules.filter((m) => m.id_module !== moduleToDelete.id_module)
      );
      setSelectedModule(null);

      console.log("Suppression réussie");
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // Modification - Préparation du formulaire
  const handleEditClick = () => {
    if (!selectedModule) return;

    setEditFormData({
      nom: selectedModule.nom,
      code: selectedModule.code,
      description: selectedModule.description,
      credit: selectedModule.credit,
      volumeHoraire: selectedModule.volumeHoraire
    });
    setIsEditMode(true);
  };

  // Soumission des modifications
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return;

    try {
      const response = await fetch(`/api/modules/${selectedModule.id_module}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) throw new Error("Erreur lors de la modification");

      const updatedModule = await response.json();
      setModules(
        modules.map((m) =>
          m.id_module === selectedModule.id_module ? updatedModule.module : m
        )
      );

      setIsModuleOpen(false);
      setIsEditMode(false);
      setSelectedModule(null);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Gestion des changements dans le formulaire de modification
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ 
      ...prev, 
      [name]: name === "credit" || name === "volumeHoraire" ? Number(value) : value 
    }));
  };

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg flex items-start">
      <div className="w-3/4">
        <h2 className="text-xl font-semibold mb-4">Liste des Modules</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Crédits</th>
                <th className="p-3 text-left">Volume Horaire</th>
              </tr>
            </thead>
            <tbody>
              {currentModules.map((module) => (
                <tr
                  key={module.id_module}
                  className={`cursor-pointer border-b ${
                    selectedModule?.id_module === module.id_module
                      ? "bg-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelect(module)}
                >
                  <td className="p-3">{module.nom}</td>
                  <td className="p-3">{module.code}</td>
                  <td className="p-3">{module.description}</td>
                  <td className="p-3">{module.credit}</td>
                  <td className="p-3">{module.volumeHoraire}h</td>
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
          onClick={() => setIsModuleOpen(true)}
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
                <h1 className="text-xl font-bold">Modifier le Module</h1>

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
                    <label className="block text-gray-700 mb-2">Code :</label>
                    <input
                      type="text"
                      name="code"
                      value={editFormData.code}
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
                    <label className="block text-gray-700 mb-2">Crédits :</label>
                    <input
                      type="number"
                      name="credit"
                      value={editFormData.credit}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Volume Horaire :</label>
                    <input
                      type="number"
                      name="volumeHoraire"
                      value={editFormData.volumeHoraire}
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
                        setIsModuleOpen(false);
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
        {isModuleOpen && !isEditMode && (
          <div
            className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center"
            onClick={() => setIsModuleOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-6 shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <FormulaireModule
                onCancel={() => setIsModuleOpen(false)}
                title="Création d'un Nouveau Module"
                onSuccess={handleCreateSuccess}
              />
            </div>
          </div>
        )}
        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedModule
              ? "bg-yellow-600 text-white hover:bg-yellow-700"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedModule}
          onClick={handleEditClick}
        >
          <FaEdit className="mr-1" /> Modifier
        </button>
        <button
          onClick={() => selectedModule && handleDeleteClick(selectedModule)}
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedModule
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedModule}
        >
          <FaTrash className="mr-1" /> Supprimer
        </button>
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Confirmer la suppression"
          message={`Êtes-vous sûr de vouloir supprimer définitivement le module "${moduleToDelete?.nom}" ?`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      </div>
    </div>
  );
};

export default ListeModules;