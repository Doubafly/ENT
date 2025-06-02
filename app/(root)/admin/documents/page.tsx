"use client";
import DocumentForm from "@/components/forms/DocumentForm";
import Modal from "@/components/modal/SuperModal";
import Pagination from "@/components/ui/Pagination";
import { DocumentFormData, Filiere, Module, User } from "@/type/documentTypes";
import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiDownload,
  FiEdit2,
  FiFile,
  FiFilter,
  FiMapPin,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";

interface ApiDocument {
  id: number;
  titre: string;
  description: string;
  chemin_fichier: string;
  type_fichier: string;
  taille_fichier: number;
  id_uploader: number;
  id_classe: number;
  utilisateur: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  } | null;
  filiere: string | null;
  id_filier: number;
  module: string | null;
  session: string | null;
  annexe: string | null;
  enseignant: string | null;
}

interface Session {
  id_sessions: number;
  annee_academique: string;
}

interface Annexe {
  id: number;
  nom: string;
}

const DocumentsPage = () => {
  // État principal
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [filiereFilter, setFiliereFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [uploaderFilter, setUploaderFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  const [annexeFilter, setAnnexeFilter] = useState("");
  const [enseignantFilter, setEnseignantFilter] = useState("");

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ApiDocument | null>(
    null
  );

  // Données pour les filtres
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [uploaders, setUploaders] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [annexes, setAnnexes] = useState<Annexe[]>([]);
  const [enseignants, setEnseignants] = useState<User[]>([]);

  // Modules filtrés
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);

  // Mémoization des données filtrées
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        searchTerm === "" ||
        doc.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFiliere =
        filiereFilter === "" ||
        doc.filiere?.toLowerCase() === filiereFilter.toLowerCase();

      const matchesModule =
        moduleFilter === "" ||
        doc.module?.toLowerCase() === moduleFilter.toLowerCase();

      const matchesUploader =
        uploaderFilter === "" ||
        `${doc.utilisateur?.prenom} ${doc.utilisateur?.nom}`
          .toLowerCase()
          .includes(uploaderFilter.toLowerCase());

      const matchesSession =
        sessionFilter === "" ||
        doc.session?.toLowerCase() === sessionFilter.toLowerCase();

      const matchesAnnexe =
        annexeFilter === "" ||
        doc.annexe?.toLowerCase() === annexeFilter.toLowerCase();

      const matchesEnseignant =
        enseignantFilter === "" ||
        doc.enseignant?.toLowerCase().includes(enseignantFilter.toLowerCase());

      return (
        matchesSearch &&
        matchesFiliere &&
        matchesModule &&
        matchesUploader &&
        matchesSession &&
        matchesAnnexe &&
        matchesEnseignant
      );
    });
  }, [
    documents,
    searchTerm,
    filiereFilter,
    moduleFilter,
    uploaderFilter,
    sessionFilter,
    annexeFilter,
    enseignantFilter,
  ]);

  // Pagination calculs
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, filteredDocuments]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  // Chargement initial des données
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        const endpoints = [
          "/api/cours/doc",
          "/api/filieres",
          "/api/utilisateurs/enseignants",
          "/api/sessions",
          "/api/annexes",
        ];

        const responses = await Promise.all(endpoints.map((url) => fetch(url)));

        const hasError = responses.some((response) => !response.ok);
        if (hasError) throw new Error("Erreur lors du chargement des données");

        const [
          documentsData,
          filieresData,
          uploadersData,
          sessionsData,
          annexesData,
        ] = await Promise.all(responses.map((res) => res.json()));

        // Formatage des données
        const formattedDocuments: ApiDocument[] = documentsData.documents || [];
        const allModules: Module[] = filieresData.filieres.flatMap(
          (filiere: Filiere) =>
            filiere.filiere_module
              ?.map((fm) => fm.module)
              .filter((m): m is Module => m !== undefined) || []
        );

        const formattedEnseignants = (uploadersData.utilisateurs || []).map(
          (enseignant: any) => ({
            ...enseignant,
            nomComplet: `${enseignant.utilisateur.prenom} ${enseignant.utilisateur.nom}`,
          })
        );

        // Mise à jour de l'état
        setDocuments(formattedDocuments);
        setFilieres(filieresData.filieres || []);
        setModules(allModules);
        setFilteredModules(allModules);
        setUploaders(uploadersData.utilisateurs || []);
        setSessions(
          sessionsData.data?.map((s: any) => ({
            id_sessions: s.id_sessions,
            annee_academique: s.annee_academique,
          })) || []
        );
        setAnnexes(
          annexesData.annexes?.map((a: any) => ({
            id: a.id_annexe,
            nom: a.nom,
          })) || []
        );
        setEnseignants(formattedEnseignants);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filtrage des modules en fonction de la filière
  useEffect(() => {
    if (filiereFilter) {
      const selectedFiliere = filieres.find((f) => f.nom === filiereFilter);
      if (selectedFiliere) {
        const modulesForFiliere =
          selectedFiliere.filiere_module
            ?.map((fm) => fm.module)
            .filter((m): m is Module => m !== undefined) || [];

        setFilteredModules(modulesForFiliere);
        if (
          moduleFilter &&
          !modulesForFiliere.some((m) => m.nom === moduleFilter)
        ) {
          setModuleFilter("");
        }
      }
    } else {
      setFilteredModules(modules);
    }
  }, [filiereFilter, filieres, modules, moduleFilter]);

  // Gestion des documents
  const handleDocumentAction = async (
    method: "POST" | "PUT" | "DELETE",
    formData?: DocumentFormData,
    id?: number
  ) => {
    try {
      let url = "/api/documents";
      if (method === "PUT" || method === "DELETE") url += `/${id}`;

      const options: RequestInit = { method };

      if (method !== "DELETE" && formData) {
        const formDataToSend = new FormData();
        formDataToSend.append("titre", formData.titre);
        if (formData.description)
          formDataToSend.append("description", formData.description);
        formDataToSend.append("id_uploader", formData.id_uploader.toString());
        if (formData.id_classe !== undefined) {
          formDataToSend.append("id_classe", formData.id_classe.toString());
        }
        if (formData.file) formDataToSend.append("file", formData.file);
        options.body = formDataToSend;
      }

      const response = await fetch(url, options);
      if (!response.ok)
        throw new Error(
          `Erreur ${
            method === "POST"
              ? "création"
              : method === "PUT"
              ? "mise à jour"
              : "suppression"
          }`
        );

      // Rafraîchir les documents
      const documentsRes = await fetch("/api/cours/doc");
      const documentsData = await documentsRes.json();
      setDocuments(documentsData.documents || []);

      return true;
    } catch (err) {
      console.error("Erreur:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    }
  };

  const handleCreateDocument = (formData: DocumentFormData) =>
    handleDocumentAction("POST", formData).then((success) => {
      if (success) setIsFormOpen(false);
    });

  const handleUpdateDocument = (formData: DocumentFormData) =>
    handleDocumentAction("PUT", formData, selectedDocument?.id).then(
      (success) => {
        if (success) {
          setIsFormOpen(false);
          setSelectedDocument(null);
        }
      }
    );

  const handleDeleteDocument = () =>
    handleDocumentAction("DELETE", undefined, selectedDocument?.id).then(
      (success) => {
        if (success) {
          setIsDeleteModalOpen(false);
          setSelectedDocument(null);
        }
      }
    );

  // Utilitaires
  const findFiliereId = (filiereName: string | null): number | undefined => {
    if (!filiereName) return undefined;
    return filieres.find((f) => f.nom === filiereName)?.id_filiere;
  };

  const findModuleId = (moduleName: string | null): number | undefined => {
    if (!moduleName) return undefined;
    return modules.find((m) => m.nom === moduleName)?.id_module;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFiliereFilter("");
    setModuleFilter("");
    setUploaderFilter("");
    setSessionFilter("");
    setAnnexeFilter("");
    setEnseignantFilter("");
    setCurrentPage(1);
  };

  // Affichage des états de chargement et d'erreur
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Documents
        </h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus /> Ajouter un document
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              value={filiereFilter}
              onChange={(e) => setFiliereFilter(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les filières</option>
              {filieres.map((filiere) => (
                <option key={filiere.id_filiere} value={filiere.nom}>
                  {filiere.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              disabled={!filiereFilter}
              className={`pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                !filiereFilter ? "bg-gray-100" : ""
              }`}
            >
              <option value="">Tous les modules</option>
              {filteredModules.map((module) => (
                <option key={module.id_module} value={module.nom}>
                  {module.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <select
              value={uploaderFilter}
              onChange={(e) => setUploaderFilter(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les uploaders</option>
              {uploaders.map((uploader) => (
                <option
                  key={uploader.id}
                  value={`${uploader.utilisateur.prenom} ${uploader.utilisateur.nom}`}
                >
                  {uploader.utilisateur.prenom} {uploader.utilisateur.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les sessions</option>
              {sessions.map((session) => (
                <option
                  key={session.id_sessions}
                  value={session.annee_academique}
                >
                  {session.annee_academique}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="text-gray-400" />
            </div>
            <select
              value={annexeFilter}
              onChange={(e) => setAnnexeFilter(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les annexes</option>
              {annexes.map((annexe) => (
                <option key={annexe.id} value={annexe.nom}>
                  {annexe.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <select
              value={enseignantFilter}
              onChange={(e) => setEnseignantFilter(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les enseignants</option>
              {enseignants.map((enseignant) => (
                <option
                  key={enseignant.id}
                  value={`${enseignant.utilisateur.prenom} ${enseignant.utilisateur.nom}`}
                >
                  {enseignant.utilisateur.prenom} {enseignant.utilisateur.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm ||
          filiereFilter ||
          moduleFilter ||
          uploaderFilter ||
          sessionFilter ||
          annexeFilter ||
          enseignantFilter) && (
          <button
            onClick={resetFilters}
            className="mt-4 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <FiX /> Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Titre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Filière
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Module
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Enseignant
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiFile className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {doc.titre}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {doc.description || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {doc.filiere || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {doc.module || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {doc.utilisateur?.nom + " " + doc.utilisateur?.prenom ||
                          "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <a
                          href={doc.chemin_fichier}
                          download
                          className="text-blue-600 hover:text-blue-900"
                          title="Télécharger"
                        >
                          <FiDownload />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedDocument(doc);
                            setIsFormOpen(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Modifier"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDocument(doc);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Aucun document trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length > itemsPerPage && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedDocument(null);
        }}
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {selectedDocument
                ? "Modifier le document"
                : "Ajouter un nouveau document"}
            </h2>
          </div>
          <div className="p-6">
            <DocumentForm
              document={
                selectedDocument
                  ? {
                      titre: selectedDocument.titre,
                      description: selectedDocument.description || "",
                      id_uploader: selectedDocument.id_uploader,
                      id_classe: selectedDocument.id_classe,
                      id_filiere: findFiliereId(selectedDocument.filiere),
                      id_module: findModuleId(selectedDocument.module),
                    }
                  : undefined
              }
              filieres={filieres}
              modules={modules}
              onSubmit={
                selectedDocument ? handleUpdateDocument : handleCreateDocument
              }
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedDocument(null);
              }}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDocument(null);
        }}
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md">
          <div className="px-6 py-4 bg-red-50 border-b border-red-200">
            <h2 className="text-lg font-medium text-red-800">
              Confirmer la suppression
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Êtes-vous sûr de vouloir supprimer le document{" "}
              <span className="font-semibold">{selectedDocument?.titre}</span> ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedDocument(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteDocument}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentsPage;
