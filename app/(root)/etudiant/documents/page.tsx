"use client";
import Pagination from "@/components/ui/Pagination";
import { Filiere, Module } from "@/type/documentTypes";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { FiDownload, FiFile, FiSearch, FiX } from "react-icons/fi";

export interface ApiDocument {
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
  id_filiere: number;
  filiere: string | null;
  module: string | null;
  session: string | null;
  annexe: string | null;
  enseignant: string | null;
}

// Fonction utilitaire pour lire les cookies
const getCookieValue = (name: string): any => {
  if (typeof window === "undefined") return null;

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return value ? JSON.parse(decodeURIComponent(value)) : null;
};

const StudentDocumentsPage = () => {
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<ApiDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [studentFiliereId, setStudentFiliereId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filtres simplifiés pour étudiant
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("");

  // Données pour les filtres
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);

  // Charger l'utilisateur courant et sa filière au montage
  useEffect(() => {
    const userData = getCookieValue("userInfo");
    if (userData) {
      setCurrentUser(userData);
      if (userData.type === "Etudiant" && userData.etudiant) {
        setStudentFiliereId(userData.etudiant.id_filiere);
      }
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        // Seulement charger les documents de la filière de l'étudiant
        const documentsRes = await fetch("/api/cours/doc");

        if (!documentsRes.ok) {
          throw new Error("Erreur lors du chargement des documents");
        }

        const documentsData = await documentsRes.json();
        const allDocuments: ApiDocument[] = documentsData.documents || [];

        // Filtrer les documents par filière de l'étudiant
        const studentDocuments = studentFiliereId
          ? allDocuments.filter((doc) => doc.id_filiere === studentFiliereId)
          : [];

        // Charger les modules spécifiques à la filière de l'étudiant
        const filieresRes = await fetch("/api/filieres");
        if (!filieresRes.ok) {
          throw new Error("Erreur lors du chargement des filières");
        }

        const filieresData = await filieresRes.json();
        const studentFiliereData = filieresData.filieres.find(
          (f: Filiere) => f.id_filiere === studentFiliereId
        );

        const studentModules: Module[] = [];
        if (studentFiliereData) {
          studentFiliereData.filiere_module?.forEach(
            (fm: {
              module: { id_module: any; nom: any; description: any };
            }) => {
              if (fm.module) {
                studentModules.push({
                  id_module: fm.module.id_module,
                  nom: fm.module.nom,
                  description: fm.module.description,
                });
              }
            }
          );
        }

        setDocuments(studentDocuments);
        setFilteredDocuments(studentDocuments);
        setModules(studentModules);
        setFilteredModules(studentModules);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [studentFiliereId]);

  const filterDocuments = useCallback(
    debounce((search: string, module: string) => {
      const filtered = documents.filter((doc: ApiDocument) => {
        const matchesSearch =
          search === "" ||
          doc.titre.toLowerCase().includes(search.toLowerCase()) ||
          (doc.description &&
            doc.description.toLowerCase().includes(search.toLowerCase()));

        const matchesModule =
          module === "" ||
          (doc.module && doc.module.toLowerCase() === module.toLowerCase());

        return matchesSearch && matchesModule;
      });

      setFilteredDocuments(filtered);
      setCurrentPage(1);
    }, 300),
    [documents]
  );

  useEffect(() => {
    filterDocuments(searchTerm, moduleFilter);
  }, [searchTerm, moduleFilter, filterDocuments]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const resetFilters = () => {
    setSearchTerm("");
    setModuleFilter("");
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Documents de ma filière {studentFiliereId}
        </h1>
      </div>

      {/* Barre de filtres simplifiée */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recherche par texte */}
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

          {/* Filtre par module */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFile className="text-gray-400" />
            </div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les modules</option>
              {filteredModules.map((module) => (
                <option key={module.id_module} value={module.nom}>
                  {module.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || moduleFilter) && (
          <button
            onClick={resetFilters}
            className="mt-4 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <FiX /> Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Tableau des documents simplifié */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enseignant
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {studentFiliereId
                      ? "Aucun document trouvé pour votre filière"
                      : "Impossible de déterminer votre filière"}
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
    </div>
  );
};

export default StudentDocumentsPage;
