"use client";
import ListCard, { User } from "@/components/card/ListCard";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  // États pour les données
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // États pour les modales
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  // États pour les formulaires
  const [alldata, setAllData] = useState<any>(null);
  const [newClassAbbr, setNewClassAbbr] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newClassTeachers, setNewClassTeachers] = useState<string[]>([]);

  // Mémoization des données filtrées et paginées
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

  // Chargement initial des données avec optimisation
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

  // API calls memoization
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

  // Gestion des classes avec useCallback
  const handleAddClass = useCallback(async () => {
    try {
      const newClass = {
        nom: newClassName,
        description: `${newClassAbbr} - ${newClassName}`,
        niveau: "Licence",
        montant_annuel: 0,
        id_annexe: null,
        enseignants: newClassTeachers,
      };

      const created = await createFiliere(newClass);
      setClasses((prev) => [
        ...prev,
        {
          ...created.data,
          enseignants: newClassTeachers,
          effectif: 0,
          filtreEtudiant: [],
        },
      ]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }, [newClassName, newClassAbbr, newClassTeachers, createFiliere]);

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

  if (loading) {
    return (
      <div className="p-10 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 bg-red-50 border-l-4 border-red-500">
        <div className="flex items-center">
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
    <div className="p-10 mt-4 bg-gray-50 min-h-screen">
      {/* Barre de recherche et bouton d'ajout */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Rechercher une classe..."
          className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      
      </div>

      {/* Tableau des classes */}
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">Niveau</th>
            <th className="p-3 text-left">Montant</th>
            <th className="p-3 text-left">Effectif</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedClasses.map((classe) => (
            <tr
              key={classe.id_filiere}
              className="border-b hover:bg-gray-50 transition duration-150"
            >
              <td className="p-3">{classe.nom}</td>
              <td className="p-3">{classe.niveau}</td>
              <td className="p-3">{classe.montant_annuel} FCFA</td>
              <td className="p-3">{classe.effectif || 0}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedClassId(classe.id_filiere);
                    setShowModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 transition duration-200"
                  title="Voir les détails"
                >
                  <Image
                    src="/icons/eye.png"
                    alt="Détails"
                    width={20}
                    height={20}
                    priority
                  />
                </button>
                <button
                  onClick={() => handleDeleteClass(classe.id_filiere)}
                  className="text-red-500 hover:text-red-700 transition duration-200"
                  title="Supprimer"
                >
                  <Image
                    src="/icons/delete.png"
                    alt="Supprimer"
                    width={20}
                    height={20}
                    priority
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        <div className="text-gray-700">
          Page {currentPage} sur {totalPages}
        </div>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>

      {/* Modale de détails */}
      {showModal && selectedClass && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-5xl shadow-xl overflow-y-auto max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-500">
              Détails de la classe
            </h2>

            <div className="space-y-6">
              {/* Section Nom et Niveau */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Niveau
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedClass.niveau}
                    onChange={(e) =>
                      handleUpdateClass({
                        ...selectedClass,
                        niveau: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Section Enseignants */}
              <div>
                <button
                  onClick={() => setShowTeachers(!showTeachers)}
                  className="flex items-center justify-between w-full bg-blue-100 p-3 rounded-lg hover:bg-blue-200 transition duration-200"
                >
                  <span className="text-lg font-semibold text-blue-500">
                    Enseignants ({selectedClass.enseignants?.length || 0})
                  </span>
                  <span className="text-blue-500">
                    {showTeachers ? "▲" : "▼"}
                  </span>
                </button>

                {showTeachers && (
                  <div className="mt-4 space-y-4">
                    {selectedClass.enseignants?.length === 0 && (
                      <div className="text-gray-500 text-center py-4">
                        Aucun enseignant inscrit dans cette classe.
                      </div>
                    )}
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(selectedClass.enseignants || []).map((teacher) => (
                        <ListCard
                          type="enseignant"
                          key={teacher.id}
                          item={teacher}
                          onDelete={() => {}}
                          onEdit={() => {}}
                          onSelect={() => {}}
                          onrecharge={() => {}}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Section Étudiants */}
              <div>
                <button
                  onClick={() => setShowStudents(!showStudents)}
                  className="flex items-center justify-between w-full bg-blue-100 p-3 rounded-lg hover:bg-blue-200 transition duration-200"
                >
                  <span className="text-lg font-semibold text-blue-500">
                    Étudiants ({selectedClass.effectif || 0})
                  </span>
                  <span className="text-blue-500">
                    {showStudents ? "▲" : "▼"}
                  </span>
                </button>

                {showStudents && (
                  <div className="mt-4 space-y-4">
                    {selectedClass.effectif === 0 && (
                      <div className="text-gray-500 text-center py-4">
                        Aucun étudiant inscrit dans cette classe.
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedClass.filtreEtudiant
                        ?.slice(0, selectedClass.effectif || 0)
                        .map((etudiant: User) => (
                          <ListCard
                            type="etudiant"
                            key={etudiant.id}
                            item={etudiant}
                            onDelete={() => {}}
                            onEdit={() => {}}
                            onSelect={() => {}}
                            onrecharge={() => {}}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section Matières */}
              <div>
                <button
                  onClick={() => setShowSubjects(!showSubjects)}
                  className="flex items-center justify-between w-full bg-blue-100 p-3 rounded-lg hover:bg-blue-200 transition duration-200"
                >
                  <span className="text-lg font-semibold text-blue-500">
                    Matières
                  </span>
                  <span className="text-blue-500">
                    {showSubjects ? "▲" : "▼"}
                  </span>
                </button>

                {showSubjects && (
                  <div className="mt-4">
                    <Configuration
                      filiereId={selectedClassId}
                      donne={selectedClass}
                      alldata={alldata}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Fermer
              </button>
              <button
                onClick={() => handleUpdateClass(selectedClass)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale d'ajout */}
      {showAddModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Ajouter une classe</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1">Nom complet</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Abréviation</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newClassAbbr}
                  onChange={(e) => setNewClassAbbr(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Enseignants</label>
                <div className="space-y-2">
                  {newClassTeachers.map((teacher, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span>{teacher}</span>
                      <button
                        title="Supprimer"
                        type="button"
                        onClick={() =>
                          setNewClassTeachers((prev) =>
                            prev.filter((t) => t !== teacher)
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Image
                          src="/icons/delete.png"
                          alt="Supprimer"
                          width={16}
                          height={16}
                          priority
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddClass}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                disabled={!newClassName || !newClassAbbr}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
