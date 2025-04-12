"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import FormulaireModule from "../formulaires/FormulaireModule";
import { ConfirmDialog } from "../ConfirmDialog";

type Filiere = {
  id_filiere: number;
  nom: string;
};

type FiliereModule = {
  id_filiere_module: number;
  code_module: string;
  volume_horaire: number;
  coefficient: number;
  syllabus: string;
  filiere: Filiere;
};

type Module = {
  id_module: number;
  nom: string;
  description?: string | null;
  filiere_module?: FiliereModule[];
};

const ListeModules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModuleOpen, setIsModuleOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const itemsPerPage = 5;

  // Chargement des données
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [modulesRes, filieresRes] = await Promise.all([
        fetch("/api/modules?include=filiere_module.filiere"),
        fetch("/api/filieres")
      ]);

      if (!modulesRes.ok) throw new Error("Échec du chargement des modules");
      if (!filieresRes.ok) throw new Error("Échec du chargement des filières");

      const modulesData = await modulesRes.json();
      const filieresData = await filieresRes.json();

      setModules(modulesData.modules || []);
      setFilieres(filieresData.filieres || []);
    } catch (error) {
      console.error("Erreur:", error);
      setError(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Gestion de la création
  const handleCreateSuccess = () => {
    fetchData();
    setSuccessMessage("Module créé avec succès");
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsModuleOpen(false);
  };

  // Gestion de la sélection
  const handleSelect = (module: Module) => {
    setSelectedModule(prev => 
      prev?.id_module === module.id_module ? null : module
    );
  };

  // Gestion de la suppression
  const handleDeleteClick = (module: Module) => {
    setSelectedModule(module);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedModule) return;
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`/api/modules/${selectedModule.id_module}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setModules(prev => prev.filter(m => m.id_module !== selectedModule.id_module));
      setSelectedModule(null);
      setSuccessMessage("Module supprimé avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      setError("Échec de la suppression. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Gestion de la modification
  const handleEditClick = () => {
    if (!selectedModule) return;
    setIsEditMode(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return;
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`/api/modules/${selectedModule.id_module}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: selectedModule.nom,
          description: selectedModule.description,
          filiere_module: selectedModule.filiere_module?.map(fm => ({
            id_filiere_module: fm.id_filiere_module,
            code_module: fm.code_module,
            volume_horaire: fm.volume_horaire,
            coefficient: fm.coefficient,
            syllabus: fm.syllabus,
            id_filiere: fm.filiere.id_filiere
          }))
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const updatedModule = await response.json();
      setModules(prev => 
        prev.map(m => m.id_module === updatedModule.module.id_module ? updatedModule.module : m)
      );
      setSelectedModule(updatedModule.module);
      setSuccessMessage("Module mis à jour avec succès");
      setIsEditMode(false);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Échec de la mise à jour. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Gestion des changements de formulaire
  const handleFieldChange = (field: keyof Module, value: string) => {
    setSelectedModule(prev => 
      prev ? { ...prev, [field]: value } : null
    );
  };

  const handleFiliereModuleChange = (
    index: number,
    field: keyof FiliereModule,
    value: string | number
  ) => {
    setSelectedModule(prev => {
      if (!prev || !prev.filiere_module) return prev;

      const updatedFiliereModules = [...prev.filiere_module];
      updatedFiliereModules[index] = {
        ...updatedFiliereModules[index],
        [field]: value,
        ...(field === 'id_filiere' as string ? {
          filiere: filieres.find(f => f.id_filiere === Number(value)) || 
          updatedFiliereModules[index].filiere
        } : {})
      };

      return {
        ...prev,
        filiere_module: updatedFiliereModules
      };
    });
  };

  // Pagination
  const totalPages = Math.ceil(modules.length / itemsPerPage);
  const indexOfLastModule = currentPage * itemsPerPage;
  const indexOfFirstModule = indexOfLastModule - itemsPerPage;
  const currentModules = modules.slice(indexOfFirstModule, indexOfLastModule);

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-2xl text-blue-500" />
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Erreur !</strong> {error}
        <button 
          onClick={fetchData}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-6">
      {/* Message de succès */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Liste des modules */}
      <div className="w-full md:w-3/4">
        <h2 className="text-xl font-semibold mb-4">Liste des Modules</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Filière</th>
                <th className="p-3 text-left">Volume Horaire</th>
                <th className="p-3 text-left">Coefficient</th>
              </tr>
            </thead>
            <tbody>
              {currentModules.length > 0 ? (
                currentModules.map((module) => (
                  <tr
                    key={`module-${module.id_module}`}
                    className={`cursor-pointer border-b ${
                      selectedModule?.id_module === module.id_module
                        ? "bg-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelect(module)}
                  >
                    <td className="p-3 font-medium">{module.nom}</td>
                    <td className="p-3">
                      {module.filiere_module?.[0]?.code_module || "-"}
                    </td>
                    <td className="p-3">
                      {module.filiere_module?.[0]?.filiere.nom || "-"}
                    </td>
                    <td className="p-3">
                      {module.filiere_module?.[0]?.volume_horaire || 0}h
                    </td>
                    <td className="p-3">
                      {module.filiere_module?.[0]?.coefficient || 1}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    Aucun module disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {modules.length > 0 && (
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

      {/* Actions */}
      <div className="w-full md:w-1/4 space-y-4">
        <button
          className="bg-green-600 text-white px-4 py-2 w-full rounded-lg flex items-center justify-center hover:bg-green-700"
          onClick={() => setIsModuleOpen(true)}
        >
          <FaPlus className="mr-2" /> Ajouter
        </button>

        <button
          className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
            selectedModule
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedModule}
          onClick={handleEditClick}
        >
          <FaEdit className="mr-2" /> Modifier
        </button>

        <button
          onClick={() => selectedModule && handleDeleteClick(selectedModule)}
          className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
            selectedModule
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedModule}
        >
          <FaTrash className="mr-2" /> Supprimer
        </button>

        {/* Détails du module sélectionné */}
        {selectedModule && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium mb-2">Détails du module</h3>
            <p className="text-sm">
              <span className="font-medium">Nom:</span> {selectedModule.nom}
            </p>
            <p className="text-sm">
              <span className="font-medium">Description:</span> {selectedModule.description || "Aucune"}
            </p>
            {selectedModule.filiere_module?.map((fm, index) => (
              <div key={index} className="mt-2 pt-2 border-t">
                <p className="text-sm">
                  <span className="font-medium">Code:</span> {fm.code_module}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Filière:</span> {fm.filiere.nom}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Volume Horaire:</span> {fm.volume_horaire}h
                </p>
                <p className="text-sm">
                  <span className="font-medium">Coefficient:</span> {fm.coefficient}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Syllabus:</span> {fm.syllabus || "Aucun"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de modification */}
      {isEditMode && selectedModule && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Modifier le module</h2>
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du module *
                  </label>
                  <input
                    type="text"
                    value={selectedModule.nom}
                    onChange={(e) => handleFieldChange("nom", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={selectedModule.description || ""}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {selectedModule.filiere_module?.map((fm, index) => (
                  <div key={index} className="space-y-3 border p-3 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code module *
                      </label>
                      <input
                        type="text"
                        value={fm.code_module}
                        onChange={(e) => handleFiliereModuleChange(index, "code_module", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filière *
                      </label>
                      <select
                        value={fm.filiere.id_filiere}
                        onChange={(e) => {
                          const filiereId = Number(e.target.value);
                          setSelectedModule((prev) => {
                            if (!prev || !prev.filiere_module) return prev;

                            const updatedFiliereModules = [...prev.filiere_module];
                            updatedFiliereModules[index] = {
                              ...updatedFiliereModules[index],
                              filiere: filieres.find((f) => f.id_filiere === filiereId) || updatedFiliereModules[index].filiere,
                            };

                            return {
                              ...prev,
                              filiere_module: updatedFiliereModules,
                            };
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        {filieres.map(filiere => (
                          <option key={filiere.id_filiere} value={filiere.id_filiere}>
                            {filiere.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Volume horaire (h) *
                      </label>
                      <input
                        type="number"
                        value={fm.volume_horaire}
                        onChange={(e) => handleFiliereModuleChange(index, "volume_horaire", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coefficient *
                      </label>
                      <input
                        type="number"
                        value={fm.coefficient}
                        onChange={(e) => handleFiliereModuleChange(index, "coefficient", parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Syllabus
                      </label>
                      <textarea
                        value={fm.syllabus}
                        onChange={(e) => handleFiliereModuleChange(index, "syllabus", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`px-4 py-2 text-white rounded-md flex items-center justify-center ${
                    isProcessing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isProcessing && <FaSpinner className="animate-spin mr-2" />}
                  {isProcessing ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de création */}
      {isModuleOpen && !isEditMode && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
            <FormulaireModule
              onCancel={() => setIsModuleOpen(false)}
              onSuccess={handleCreateSuccess}
              title="Création d'un nouveau module"
            />
          </div>
        </div>
      )}

      {/* Confirmation de suppression */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer le module "${selectedModule?.nom}" ?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText={isProcessing ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
       
      />
    </div>
  );
};

export default ListeModules;