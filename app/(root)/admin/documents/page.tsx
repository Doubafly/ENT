"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FiFile, FiUpload, FiSearch, FiFilter, FiX, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import Modal from "@/components/modal/Modal";
import DocumentForm from "@/components/forms/DocumentForm";
import { Document, Filiere, Module, User } from "@/type/documentTypes";
import { debounce } from "lodash";
import Pagination from "@/components/ui/Pagination";

const DocumentsPage = () => {
  // États pour la gestion des données
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [filiereFilter, setFiliereFilter] = useState<string>("");
  const [moduleFilter, setModuleFilter] = useState<string>("");
  const [uploaderFilter, setUploaderFilter] = useState<string>("");
  
  // États pour les modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  // États pour les données de formulaire
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [uploaders, setUploaders] = useState<User[]>([]);

  // Chargement initial des données
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Chargement en parallèle pour optimiser les performances
        const [docsRes, filieresRes, modulesRes, uploadersRes] = await Promise.all([
          fetch('/api/documents'),
          fetch('/api/filieres'),
          fetch('/api/modules'),
          fetch('/api/users/uploaders')
        ]);

        if (!docsRes.ok || !filieresRes.ok || !modulesRes.ok || !uploadersRes.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const [docsData, filieresData, modulesData, uploadersData] = await Promise.all([
          docsRes.json(),
          filieresRes.json(),
          modulesRes.json(),
          uploadersRes.json()
        ]);

        setDocuments(docsData.data);
        setFilteredDocuments(docsData.data);
        setFilieres(filieresData.data);
        setModules(modulesData.data);
        setUploaders(uploadersData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filtrage des documents avec debounce pour optimiser les performances
  const filterDocuments = useCallback(debounce((search, filiere, module, uploader) => {
    const filtered = documents.filter(doc => {
      const matchesSearch = search === "" || 
        doc.titre.toLowerCase().includes(search.toLowerCase()) || 
        doc.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesFiliere = filiere === "" || doc.filiere?.nom === filiere;
      const matchesModule = module === "" || doc.module?.nom === module;
      const matchesUploader = uploader === "" || 
        `${doc.uploader?.prenom} ${doc.uploader?.nom}`.includes(uploader);

      return matchesSearch && matchesFiliere && matchesModule && matchesUploader;
    });

    setFilteredDocuments(filtered);
    setCurrentPage(1); // Reset à la première page après filtrage
  }, 300), [documents]);

  // Application des filtres
  useEffect(() => {
    filterDocuments(searchTerm, filiereFilter, moduleFilter, uploaderFilter);
  }, [searchTerm, filiereFilter, moduleFilter, uploaderFilter, filterDocuments]);

  // Gestion de la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  // Fonction pour créer un document
  const handleCreateDocument = async (newDocument: Omit<Document, 'id'>) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDocument)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du document');
      }

      const createdDoc = await response.json();
      setDocuments(prev => [...prev, createdDoc.data]);
      setIsFormOpen(false);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  // Fonction pour supprimer un document
  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;

    try {
      const response = await fetch(`/api/documents/${selectedDocument.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setDocuments(prev => prev.filter(doc => doc.id !== selectedDocument.id));
      setIsDeleteModalOpen(false);
      setSelectedDocument(null);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setFiliereFilter("");
    setModuleFilter("");
    setUploaderFilter("");
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
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Documents</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus /> Ajouter un document
        </button>
      </div>

      {/* Barre de filtres */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Filtre par filière */}
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
              {filieres.map(filiere => (
                <option key={filiere.id} value={filiere.nom}>
                  {filiere.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par module */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les modules</option>
              {modules.map(module => (
                <option key={module.id} value={module.nom}>
                  {module.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par uploader */}
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
              {uploaders.map(uploader => (
                <option key={uploader.id} value={`${uploader.prenom} ${uploader.nom}`}>
                  {uploader.prenom} {uploader.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bouton de réinitialisation */}
        {(searchTerm || filiereFilter || moduleFilter || uploaderFilter) && (
          <button
            onClick={resetFilters}
            className="mt-4 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <FiX /> Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Tableau des documents */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filière
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploader
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <div className="text-sm font-medium text-gray-900">{doc.titre}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{doc.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{doc.filiere?.nom || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{doc.module?.nom || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {doc.uploader ? `${doc.uploader.prenom} ${doc.uploader.nom}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(doc.date_upload).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <a 
                          href={doc.chemin_fichier} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                          title="Télécharger"
                        >
                          <FiUpload />
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
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun document trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Modal de création/édition */}
      <Modal isOpen={isFormOpen} onClose={() => {
        setIsFormOpen(false);
        setSelectedDocument(null);
      }}>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {selectedDocument ? 'Modifier le document' : 'Ajouter un nouveau document'}
            </h2>
          </div>
          <div className="p-6">
            <DocumentForm
              document={selectedDocument || undefined}
              filieres={filieres}
              modules={modules}
              onSubmit={selectedDocument ? handleCreateDocument : handleCreateDocument}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedDocument(null);
              }}
            />
          </div>
        </div>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => {
        setIsDeleteModalOpen(false);
        setSelectedDocument(null);
      }}>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md">
          <div className="px-6 py-4 bg-red-50 border-b border-red-200">
            <h2 className="text-lg font-medium text-red-800">Confirmer la suppression</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Êtes-vous sûr de vouloir supprimer le document <span className="font-semibold">{selectedDocument?.titre}</span> ? Cette action est irréversible.
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