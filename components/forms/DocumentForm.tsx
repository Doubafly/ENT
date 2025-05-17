"use client";
import { DocumentFormData, Filiere, Module, User } from "@/type/documentTypes";
import React, { useEffect, useState } from "react";
import { FiSave, FiUpload, FiX } from "react-icons/fi";

interface DocumentFormProps {
  document?: DocumentFormData;
  filieres: Filiere[];
  modules: Module[];
  onSubmit: (formData: DocumentFormData) => Promise<void>;
  onCancel: () => void;
  currentUser?: any;
}

const DocumentForm: React.FC<DocumentFormProps> = ({
  document,
  filieres,
  modules,
  onSubmit,
  onCancel,
  currentUser
}) => {
  const [formData, setFormData] = useState<DocumentFormData>({
    titre: document?.titre || "",
    description: document?.description || "",
    id_uploader: currentUser?.id || document?.id_uploader || 0,
    id_filiere: document?.id_filiere || undefined,
    id_module: document?.id_module || undefined,
    id_classe: document?.id_classe || undefined,
    file: undefined,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filteredModules, setFilteredModules] = useState<Module[]>(modules);
  const [filiereModuleId, setFiliereModuleId] = useState<number | undefined>(
    document?.id_classe
  );
  const [fileName, setFileName] = useState<string | null>(
    document?.chemin_fichier?.split("/").pop() || null
  );

  // Effet pour charger les données initiales lors de la modification
  useEffect(() => {
    if (document) {
      const findInitialData = () => {
        if (!document.id_classe) return;

        const filiereModule = filieres
          .flatMap((f) => f.filiere_module)
          .find((fm) => fm.id_filiere_module === document.id_classe);

        if (filiereModule) {
          setFormData((prev) => ({
            ...prev,
            id_filiere: filiereModule.id_filiere,
            id_module: filiereModule.id_module,
          }));
          setFiliereModuleId(filiereModule.id_filiere_module);
        }
      };

      findInitialData();
    }
  }, [document, filieres]);

  // Filtrer les modules selon la filière sélectionnée
  useEffect(() => {
    if (formData.id_filiere) {
      const selectedFiliere = filieres.find(
        (f) => f.id_filiere === formData.id_filiere
      );
      const filtered =
        selectedFiliere?.filiere_module
          .map((fm) => modules.find((m) => m.id_module === fm.id_module))
          .filter((m): m is Module => m !== undefined) || [];

      setFilteredModules(filtered);

      if (filtered.length === 1) {
        setFormData((prev) => ({ ...prev, id_module: filtered[0].id_module }));
      }
    } else {
      setFilteredModules(modules);
    }
  }, [formData.id_filiere, filieres, modules]);

  // Trouver l'id_filiere_module quand filière et module sont sélectionnés
  useEffect(() => {
    if (formData.id_filiere && formData.id_module) {
      const selectedFiliere = filieres.find(
        (f) => f.id_filiere === formData.id_filiere
      );
      const filiereModule = selectedFiliere?.filiere_module.find(
        (fm) => fm.id_module === formData.id_module
      );

      setFiliereModuleId(filiereModule?.id_filiere_module);
    } else {
      setFiliereModuleId(undefined);
    }
  }, [formData.id_filiere, formData.id_module, filieres]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("id_")
        ? value
          ? parseInt(value)
          : undefined
        : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFormData((prev) => ({ ...prev, file }));
      setFileName(file.name);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, file: undefined }));
    setFileName(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      if (!formData.titre || !formData.id_uploader || !filiereModuleId) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      if (!document && !selectedFile) {
        throw new Error("Veuillez sélectionner un fichier");
      }

      const submissionData: DocumentFormData = {
        ...formData,
        id_classe: filiereModuleId,
        file: selectedFile || undefined,
      };

      await onSubmit(submissionData);
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      alert(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Titre */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Filière */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Filière <span className="text-red-500">*</span>
          </label>
          <select
            name="id_filiere"
            value={formData.id_filiere || ""}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Sélectionnez une filière</option>
            {filieres.map((filiere) => (
              <option key={filiere.id_filiere} value={filiere.id_filiere}>
                {filiere.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Module */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Module <span className="text-red-500">*</span>
          </label>
          <select
            name="id_module"
            value={formData.id_module || ""}
            onChange={handleChange}
            required
            disabled={!formData.id_filiere}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
          >
            <option value="">Sélectionnez un module</option>
            {filteredModules.map((module) => (
              <option key={module.id_module} value={module.id_module}>
                {module.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Uploader - caché mais obligatoire */}
        {currentUser && (
          <div className="hidden">
            <input 
              type="hidden" 
              name="id_uploader" 
              value={currentUser.id} 
            />
          </div>
        )}

        {/* Affichage de l'uploader */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Uploader
          </label>
          <div className="mt-1 p-2 bg-gray-100 rounded-md">
            {currentUser ? (
              <p className="text-sm text-gray-900">
                {currentUser.prenom} {currentUser.nom} (vous)
              </p>
            ) : (
              <p className="text-sm text-gray-500">Non connecté</p>
            )}
          </div>
        </div>

        {/* Fichier */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Fichier {!document && <span className="text-red-500">*</span>}
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {selectedFile || fileName ? (
                <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                  <div className="flex items-center">
                    <FiUpload className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-blue-700 truncate max-w-xs">
                      {selectedFile ? selectedFile.name : fileName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Uploader un fichier</span>
                      <input
                        id="file-upload"
                        name="file"
                        type="file"
                        onChange={handleFileChange}
                        className="sr-only"
                        required={!document}
                      />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOCX, PPTX jusqu'à 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isUploading || !filiereModuleId}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              En cours...
            </>
          ) : (
            <>
              <FiSave className="-ml-1 mr-2 h-4 w-4" />
              {document ? "Mettre à jour" : "Enregistrer"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;