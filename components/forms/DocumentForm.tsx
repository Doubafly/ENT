"use client";
import { Document, Filiere, Module } from "@/type/documentTypes";
import React, { useEffect, useState } from "react";
import { FiSave, FiUpload, FiX } from "react-icons/fi";

interface DocumentFormProps {
  document?: Document;
  filieres: Filiere[];
  modules: Module[];
  onSubmit: (document: Omit<Document, "id">) => Promise<void>;
  onCancel: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({
  document,
  filieres,
  modules,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Document, "id">>({
    titre: document?.titre || "",
    description: document?.description || "",
    chemin_fichier: document?.chemin_fichier || "",
    type_fichier: document?.type_fichier || "",
    taille_fichier: document?.taille_fichier || 0,
    id_uploader: document?.id_uploader || 0,
    id_classe: document?.id_classe || 0,
    filiere: document?.filiere || null,
    module: document?.module || null,
    uploader: document?.uploader || null,
    date_upload: document?.date_upload || new Date().toISOString(),
    est_actif: document?.est_actif || true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filteredModules, setFilteredModules] = useState<Module[]>(modules);

  // Filtrer les modules en fonction de la filière sélectionnée
  useEffect(() => {
    if (formData.filiere?.id) {
      const filtered = modules.filter(
        (module) => module.filiere_id === formData.filiere?.id
      );
      setFilteredModules(filtered);
      setFormData((prev) => ({
        ...prev,
        module: null,
        id_classe: 0,
      }));
    } else {
      setFilteredModules(modules);
    }
  }, [formData.filiere?.id, modules]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "filiere") {
      const selectedFiliere = filieres.find((f) => f.id === parseInt(value));
      setFormData((prev) => ({
        ...prev,
        filiere: selectedFiliere || null,
        id_classe: selectedFiliere?.id || 0,
      }));
    } else if (name === "module") {
      const selectedModule = modules.find((m) => m.id === parseInt(value));
      setFormData((prev) => ({
        ...prev,
        module: selectedModule || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      setFormData((prev) => ({
        ...prev,
        type_fichier: file.type,
        taille_fichier: file.size,
        chemin_fichier: file.name, // Temporaire, sera remplacé par le chemin serveur après upload
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile) {
      setIsUploading(true);
      try {
        // Simuler l'upload (remplacer par un vrai appel API)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const fakePath = `/uploads/documents/${Date.now()}_${
          selectedFile.name
        }`;

        await onSubmit({
          ...formData,
          chemin_fichier: fakePath,
          date_upload: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Erreur lors de l'upload:", err);
      } finally {
        setIsUploading(false);
      }
    } else {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="titre"
            className="block text-sm font-medium text-gray-700"
          >
            Titre du document <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="filiere"
            className="block text-sm font-medium text-gray-700"
          >
            Filière
          </label>
          <select
            id="filiere"
            name="filiere"
            value={formData.filiere?.id || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Sélectionnez une filière</option>
            {filieres.map((filiere) => (
              <option key={filiere.id} value={filiere.id}>
                {filiere.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="module"
            className="block text-sm font-medium text-gray-700"
          >
            Module
          </label>
          <select
            id="module"
            name="module"
            value={formData.module?.id || ""}
            onChange={handleChange}
            disabled={!formData.filiere?.id}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="">Sélectionnez un module</option>
            {filteredModules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Fichier <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {selectedFile ? (
                <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                  <div className="flex items-center">
                    <FiUpload className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-blue-700 truncate max-w-xs">
                      {selectedFile.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
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
                        name="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        className="sr-only"
                        required={!document} // Requis seulement pour la création
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
          disabled={isUploading}
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
