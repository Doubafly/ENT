"use client";
import ListCard, { User } from "@/components/card/ListCard";
import Image from "next/image";
import { useEffect, useState } from "react";
import Configuration from "../note/Configuration2";

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
  const [enseignants, setEnseignants] = useState<User[]>(enseignantsData);
  const [etudiants, setEtudiants] = useState<User[]>(etudiantsData);

  // États pour l'UI
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
  const [newTeacher, setNewTeacher] = useState("");
  const [newStudent, setNewStudent] = useState("");
  const [newClassAbbr, setNewClassAbbr] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newClassTeachers, setNewClassTeachers] = useState<string[]>([]);
  const [tempTeacher, setTempTeacher] = useState("");

  // Chargement initial des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filieresRes] = await Promise.all([fetch("/api/filieres")]);

        if (!filieresRes.ok)
          throw new Error("Erreur de chargement des filières");

        const filieresData = await filieresRes.json();

        setClasses(
          filieresData.filieres.map((filiere: any) => ({
            ...filiere,
            enseignants: Array.from(
              new Map(
                filiere.filiere_module.flatMap((Fmodule: any) =>
                  Fmodule.cours.flatMap((cour: any) =>
                    cour.enseignant
                      ? [
                          [
                            cour.enseignant.id,
                            {
                              id: cour.enseignant.id,
                              specialite: cour.enseignant.specialite,
                              matricule: cour.enseignant.matricule,
                              nom: cour.enseignant.utilisateur.nom,
                              prenom: cour.enseignant.utilisateur.prenom,
                              email: cour.enseignant.utilisateur.email,
                              tel: cour.enseignant.utilisateur.telephone,
                              adresse: cour.enseignant.utilisateur.adresse,
                              profil: cour.enseignant.utilisateur.profil,
                              sexe: cour.enseignant.utilisateur.sexe,
                            },
                          ],
                        ]
                      : []
                  )
                )
              ).values()
            ),
            filtreEtudiant: filiere.etudiants.map((etudiant: any) => ({
              notes: etudiant.notes.map((note: any) => ({
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
            })),
            effectif: filiere.etudiants?.length || 0,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonctions API
  const createFiliere = async (data: any) => {
    const res = await fetch("/api/filieres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: data.nom,
        description: data.description,
        niveau: data.niveau,
        montant_annuel: data.montant_annuel,
        id_annexe: data.id_annexe,
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const updateFiliere = async (id: number, data: any) => {
    const res = await fetch(`/api/filieres/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const deleteFiliere = async (id: number) => {
    const res = await fetch(`/api/filieres/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  // Gestion des classes
  const handleAddClass = async () => {
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
        },
      ]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  const handleUpdateClass = async (updatedClass: Classe) => {
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
  };

  const handleDeleteClass = async (id: number) => {
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
  };

  // Gestion des enseignants/étudiants
  // const handleAddTeacher = () => {
  //   if (!newTeacher.trim() || !selectedClassId) return;

  //   const trimmedTeacher = newTeacher.trim();
  //   setClasses((prev) =>
  //     prev.map((c) =>
  //       c.id_filiere === selectedClassId
  //         ? { ...c, enseignants: [...(c.enseignants || []), trimmedTeacher] }
  //         : c
  //     )
  //   );
  //   setNewTeacher("");
  // };

  // const handleRemoveTeacher = (teacher: string, classId: number) => {
  //   setClasses((prev) =>
  //     prev.map((c) =>
  //       c.id_filiere === classId
  //         ? {
  //             ...c,
  //             enseignants: (c.enseignants || []).filter((t) => t !== teacher),
  //           }
  //         : c
  //     )
  //   );
  // };

  const handleAddStudent = () => {
    if (!newStudent.trim() || !selectedClassId) return;

    const trimmedStudent = newStudent.trim();
    setClasses((prev) =>
      prev.map((c) =>
        c.id_filiere === selectedClassId
          ? { ...c, effectif: (c.effectif || 0) + 1 }
          : c
      )
    );
    setNewStudent("");
  };

  // Utilitaires
  const resetForm = () => {
    setNewClassAbbr("");
    setNewClassName("");
    setNewClassTeachers([]);
    setTempTeacher("");
  };

  const addTeacherToNewClass = () => {
    if (tempTeacher.trim() && !newClassTeachers.includes(tempTeacher.trim())) {
      setNewClassTeachers((prev) => [...prev, tempTeacher.trim()]);
      setTempTeacher("");
    }
  };

  // Filtrage et pagination
  const filteredClasses = classes.filter(
    (c) =>
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.niveau.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  const selectedClass = classes.find((c) => c.id_filiere === selectedClassId);

  if (loading) return <div className="p-10">Chargement en cours...</div>;
  if (error) return <div className="p-10 text-red-500">Erreur: {error}</div>;

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
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 shadow-md flex items-center gap-2"
        >
          <span>+</span>
          <span>Ajouter une classe</span>
        </button>
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
                    Je suis là {selectedClass.nom}
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
                    <div className="mt-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ajouter un étudiant"
                          className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newStudent}
                          onChange={(e) => setNewStudent(e.target.value)}
                        />
                        <button
                          onClick={handleAddStudent}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                          Ajouter
                        </button>
                      </div>
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
                    <Configuration filiereId={1} />
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

// Données statiques (à remplacer par des appels API si nécessaire)
const enseignantsData: User[] = [
  // ... (conservez vos données enseignants existantes)
];

const etudiantsData: User[] = [
  // ... (conservez vos données étudiants existantes)
];

const classe: any = [
  // ... (conservez vos données de classes statiques existantes)
];
