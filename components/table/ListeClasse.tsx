"use client";
import ListCard, { User } from "@/components/card/ListCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiBook,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiSearch,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import Configuration from "../note/configuration";

interface Classe {
  id_filiere: number;
  nom: string;
  description: string | null;
  niveau: string;
  montant_annuel: number;
  id_annexe: number | null;
  annexe?: {
    id_annexe: number;
    nom: string;
    ville: string;
  };
  enseignants?: User[];
  effectif?: number;
  etudiants?: User[];
  filtreEtudiant?: User[];
  filiere_module?: any[];
}

export default function ClasseList() {
  // États
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // États modales
  const [showModal, setShowModal] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  // Formulaires
  const [alldata, setAllData] = useState<any>(null);
  const [newClassAbbr, setNewClassAbbr] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newClassTeachers, setNewClassTeachers] = useState<string[]>([]);

  // Données filtrées et paginées
  const filteredClasses = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return classes.filter(
      (c) =>
        c.nom.toLowerCase().includes(searchTerm) ||
        c.niveau.toLowerCase().includes(searchTerm)
    );
  }, [classes, search]);

  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClasses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClasses, currentPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClasses.length / itemsPerPage)
  );
  const selectedClass = useMemo(
    () => classes.find((c) => c.id_filiere === selectedClassId),
    [classes, selectedClassId]
  );

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [alldataRes] = await Promise.all([
          fetch("/api/filieres/modules").then((res) => res.json()),
        ]);

        setAllData(alldataRes);

        const processFiliereData = (filiere: any) => {
          const enseignantsMap = new Map();

          filiere.filiere_module?.forEach((Fmodule: any) => {
            Fmodule.cours?.forEach((cour: any) => {
              if (cour.enseignant) {
                const enseignant = cour.enseignant;
                enseignantsMap.set(enseignant.id, {
                  id: enseignant.id,
                  specialite: enseignant.specialite,
                  matricule: enseignant.matricule,
                  nom: enseignant.utilisateur.nom,
                  prenom: enseignant.utilisateur.prenom,
                  email: enseignant.utilisateur.email,
                  tel: enseignant.utilisateur.telephone,
                  adresse: enseignant.utilisateur.adresse,
                  profil: enseignant.utilisateur.profil,
                  sexe: enseignant.utilisateur.sexe,
                });
              }
            });
          });

          return {
            ...filiere,
            enseignants: Array.from(enseignantsMap.values()),
            filtreEtudiant:
              filiere.etudiants?.map((etudiant: any) => ({
                notes: etudiant.notes?.map((note: any) => ({
                  note_class: note.note_class,
                  note_exam: note.note_exam,
                })),
                id_utilisateur: etudiant.utilisateur.id_utilisateur,
                id: etudiant.id,
                image: etudiant.utilisateur.profil,
                nom: etudiant.utilisateur.nom,
                prenom: etudiant.utilisateur.prenom,
                email: etudiant.utilisateur.email,
                adresse: etudiant.utilisateur.adresse,
                date_naissance: etudiant.date_naissance,
                date_inscription: etudiant.date_inscription,
                tel: etudiant.utilisateur.telephone,
                filiere: {
                  id_filiere: filiere.id_filiere,
                  nom: filiere.nom,
                },
                matricule: etudiant.matricule,
                sexe: etudiant.utilisateur.sexe,
              })) || [],
            effectif: filiere.etudiants?.length || 0,
          };
        };

        setClasses(alldataRes.data.filiere.map(processFiliereData));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonctions API
  const apiCall = useCallback(
    async (url: string, method: string, data?: any) => {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
        body: data ? JSON.stringify(data) : undefined,
      };
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    []
  );

  const createFiliere = useCallback(
    (data: any) => apiCall("/api/filieres", "POST", data),
    [apiCall]
  );
  const updateFiliere = useCallback(
    (id: number, data: any) => apiCall(`/api/filieres/${id}`, "PUT", data),
    [apiCall]
  );
  const deleteFiliere = useCallback(
    (id: number) => apiCall(`/api/filieres/${id}`, "DELETE"),
    [apiCall]
  );

  // Gestion des classes
  const handleUpdateClass = useCallback(
    async (updatedClass: Classe) => {
      if (!updatedClass) return;

      try {
        const { id_filiere, ...updateData } = updatedClass;
        const data = await updateFiliere(id_filiere, updateData);
        setClasses((prev) =>
          prev.map((c) =>
            c.id_filiere === id_filiere
              ? { ...data.data, enseignants: c.enseignants }
              : c
          )
        );
        setShowModal(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Erreur inconnue");
      }
    },
    [updateFiliere]
  );

  const handleDeleteClass = useCallback(
    async (id: number) => {
      try {
        await deleteFiliere(id);
        setClasses((prev) => prev.filter((c) => c.id_filiere !== id));
        if (id === selectedClassId) {
          setShowModal(false);
          setSelectedClassId(null);
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : "Erreur inconnue");
      }
    },
    [deleteFiliere, selectedClassId]
  );

  const resetForm = useCallback(() => {
    setNewClassAbbr("");
    setNewClassName("");
    setNewClassTeachers([]);
  }, []);

  // Affichage du chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Affichage des erreurs
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
    <div className="container mx-auto mt-6 px-4 py-6">
      {/* En-tête avec recherche et bouton d'ajout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Classes
        </h1>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une classe..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tableau des classes */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Effectif
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedClasses.length > 0 ? (
                paginatedClasses.map((classe) => (
                  <tr key={classe.id_filiere} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {classe.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {classe.niveau}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "XOF",
                      }).format(classe.montant_annuel)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          classe.effectif
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {classe.effectif || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedClassId(classe.id_filiere);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="Détails"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(classe.id_filiere)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          title="Supprimer"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {search
                      ? "Aucune classe ne correspond à votre recherche"
                      : "Aucune classe disponible"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredClasses.length > itemsPerPage && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Précédent
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  à{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredClasses.length
                    )}
                  </span>{" "}
                  sur{" "}
                  <span className="font-medium">{filteredClasses.length}</span>{" "}
                  classes
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Première page</span>«
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Précédent</span>‹
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Suivant</span>›
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Dernière page</span>»
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modale de détails */}
      {showModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Détails de la classe: {selectedClass.nom}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Section Nom et Niveau */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={selectedClass.nom}
                      onChange={(e) =>
                        handleUpdateClass({
                          ...selectedClass,
                          nom: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Niveau
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={selectedClass.niveau}
                      onChange={(e) =>
                        handleUpdateClass({
                          ...selectedClass,
                          niveau: e.target.value,
                        })
                      }
                    >
                      <option value="Licence">Licence</option>
                      <option value="Master">Master</option>
                      <option value="Doctorat">Doctorat</option>
                      <option value="BTS">BTS</option>
                    </select>
                  </div>
                </div>

                {/* Section Enseignants */}
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowTeachers(!showTeachers)}
                    className="flex items-center justify-between w-full bg-gray-100 px-4 py-3 hover:bg-gray-200 transition-colors"
                  >
                    <span className="font-medium flex items-center">
                      <FiUsers className="mr-2 text-blue-500" />
                      Enseignants ({selectedClass.enseignants?.length || 0})
                    </span>
                    {showTeachers ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {showTeachers && (
                    <div className="p-4 bg-white">
                      {selectedClass.enseignants?.length === 0 ? (
                        <p className="text-gray-500 text-center py-2">
                          Aucun enseignant
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedClass.enseignants?.map((teacher) => (
                            <ListCard
                              key={teacher.id}
                              type="enseignant"
                              item={teacher}
                              onDelete={() => {}}
                              onEdit={() => {}}
                              onSelect={() => {}}
                              onrecharge={() => {}}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Section Étudiants */}
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowStudents(!showStudents)}
                    className="flex items-center justify-between w-full bg-gray-100 px-4 py-3 hover:bg-gray-200 transition-colors"
                  >
                    <span className="font-medium flex items-center">
                      <FiUsers className="mr-2 text-blue-500" />
                      Étudiants ({selectedClass.effectif || 0})
                    </span>
                    {showStudents ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {showStudents && (
                    <div className="p-4 bg-white">
                      {selectedClass.effectif === 0 ? (
                        <p className="text-gray-500 text-center py-2">
                          Aucun étudiant
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedClass.filtreEtudiant?.map((etudiant) => (
                            <ListCard
                              key={etudiant.id}
                              type="etudiant"
                              item={etudiant}
                              onDelete={() => {}}
                              onEdit={() => {}}
                              onSelect={() => {}}
                              onrecharge={() => {}}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Section Matières */}
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowSubjects(!showSubjects)}
                    className="flex items-center justify-between w-full bg-gray-100 px-4 py-3 hover:bg-gray-200 transition-colors"
                  >
                    <span className="font-medium flex items-center">
                      <FiBook className="mr-2 text-blue-500" />
                      Matières
                    </span>
                    {showSubjects ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {showSubjects && selectedClassId && (
                    <div className="p-4 bg-white">
                      <Configuration
                        filiereId={selectedClassId}
                        donne={selectedClass}
                        alldata={alldata}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button
                  onClick={() => handleUpdateClass(selectedClass)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
