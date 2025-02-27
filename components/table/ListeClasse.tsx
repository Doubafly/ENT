"use client";
import Image from "next/image";
import { useState } from "react";

// Icônes Heroicons

interface Classe {
  id: number;
  abbr: string;
  name: string;
  enseignants: string[];
  niveau: string;
  effectif: number;
}

export default function ClasseList() {
  const [classes, setClasses] = useState<Classe[]>([
    {
      id: 1,
      abbr: "AP",
      name: "Analyse-Programmation",
      enseignants: ["Drissa Kouma"],
      niveau: "Licence 1",
      effectif: 30,
    },
    {
      id: 2,
      abbr: "GL",
      name: "Génie Logiciel",
      enseignants: ["Awa Traoré"],
      niveau: "Licence 2",
      effectif: 25,
    },
    {
      id: 3,
      abbr: "RSI",
      name: "Réseaux et Systèmes Informatiques",
      enseignants: ["Ibrahim Diallo"],
      niveau: "Licence 3",
      effectif: 20,
    },
    {
      id: 4,
      abbr: "BD",
      name: "Bases de Données",
      enseignants: ["Fatoumata Diarra"],
      niveau: "Licence 2",
      effectif: 28,
    },
    {
      id: 5,
      abbr: "IA",
      name: "Intelligence Artificielle",
      enseignants: ["Moussa Keita"],
      niveau: "Master 1",
      effectif: 18,
    },
    {
      id: 1,
      abbr: "AP",
      name: "Analyse-Programmation",
      enseignants: ["Drissa Kouma"],
      niveau: "Licence 1",
      effectif: 30,
    },
    {
      id: 2,
      abbr: "GL",
      name: "Génie Logiciel",
      enseignants: ["Awa Traoré"],
      niveau: "Licence 2",
      effectif: 25,
    },
    {
      id: 3,
      abbr: "RSI",
      name: "Réseaux et Systèmes Informatiques",
      enseignants: ["Ibrahim Diallo"],
      niveau: "Licence 3",
      effectif: 20,
    },
    {
      id: 4,
      abbr: "BD",
      name: "Bases de Données",
      enseignants: ["Fatoumata Diarra"],
      niveau: "Licence 2",
      effectif: 28,
    },
    {
      id: 5,
      abbr: "IA",
      name: "Intelligence Artificielle",
      enseignants: ["Moussa Keita"],
      niveau: "Master 1",
      effectif: 18,
    },
    {
      id: 1,
      abbr: "AP",
      name: "Analyse-Programmation",
      enseignants: ["Drissa Kouma"],
      niveau: "Licence 1",
      effectif: 30,
    },
    {
      id: 2,
      abbr: "GL",
      name: "Génie Logiciel",
      enseignants: ["Awa Traoré"],
      niveau: "Licence 2",
      effectif: 25,
    },
    {
      id: 3,
      abbr: "RSI",
      name: "Réseaux et Systèmes Informatiques",
      enseignants: ["Ibrahim Diallo"],
      niveau: "Licence 3",
      effectif: 20,
    },
    {
      id: 4,
      abbr: "BD",
      name: "Bases de Données",
      enseignants: ["Fatoumata Diarra"],
      niveau: "Licence 2",
      effectif: 28,
    },
    {
      id: 5,
      abbr: "IA",
      name: "Intelligence Artificielle",
      enseignants: ["Moussa Keita"],
      niveau: "Master 1",
      effectif: 18,
    },
    {
      id: 1,
      abbr: "AP",
      name: "Analyse-Programmation",
      enseignants: ["Drissa Kouma"],
      niveau: "Licence 1",
      effectif: 30,
    },
    {
      id: 2,
      abbr: "GL",
      name: "Génie Logiciel",
      enseignants: ["Awa Traoré"],
      niveau: "Licence 2",
      effectif: 25,
    },
    {
      id: 3,
      abbr: "RSI",
      name: "Réseaux et Systèmes Informatiques",
      enseignants: ["Ibrahim Diallo"],
      niveau: "Licence 3",
      effectif: 20,
    },
    {
      id: 4,
      abbr: "BD",
      name: "Bases de Données",
      enseignants: ["Fatoumata Diarra"],
      niveau: "Licence 2",
      effectif: 28,
    },
    {
      id: 5,
      abbr: "IA",
      name: "Intelligence Artificielle",
      enseignants: ["Moussa Keita"],
      niveau: "Master 1",
      effectif: 18,
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassAbbr, setNewClassAbbr] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newClassTeachers, setNewClassTeachers] = useState<string[]>([]);
  const [tempTeacher, setTempTeacher] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.abbr.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  // Gestion des enseignants
  const handleAddTeacher = () => {
    if (!newTeacher.trim() || !selectedClassId) return;

    const trimmedTeacher = newTeacher.trim();
    const exists = classes.some(
      (c) => c.id === selectedClassId && c.enseignants.includes(trimmedTeacher)
    );

    if (exists) {
      alert("Cet enseignant existe déjà !");
      return;
    }

    setClasses((prev) =>
      prev.map((c) =>
        c.id === selectedClassId
          ? { ...c, enseignants: [...c.enseignants, trimmedTeacher] }
          : c
      )
    );
    setNewTeacher("");
  };

  const handleRemoveTeacher = (teacher: string, classeId: number) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classeId
          ? { ...c, enseignants: c.enseignants.filter((t) => t !== teacher) }
          : c
      )
    );
  };

  // Gestion des classes
  const handleDeleteClass = (id: number) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    if (id === selectedClassId) {
      setShowModal(false);
      setSelectedClassId(null);
    }
  };

  const handleAddClass = () => {
    if (!newClassAbbr.trim() || !newClassName.trim()) return;

    const newClass: Classe = {
      id: Math.max(...classes.map((c) => c.id), 0) + 1,
      abbr: newClassAbbr.trim(),
      name: newClassName.trim(),
      enseignants: newClassTeachers,
      niveau: "Licence 1", // Valeur par défaut
      effectif: 0, // Valeur par défaut
    };

    setClasses((prev) => [...prev, newClass]);
    setShowAddModal(false);
    setNewClassAbbr("");
    setNewClassName("");
    setNewClassTeachers([]);
  };

  const handleUpdateClass = (updatedClass: Classe) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
  };

  const addTeacherToNewClass = () => {
    if (tempTeacher.trim() && !newClassTeachers.includes(tempTeacher.trim())) {
      setNewClassTeachers((prev) => [...prev, tempTeacher.trim()]);
      setTempTeacher("");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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

      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-3 text-left">Abréviation</th>
            <th className="p-3 text-left">Nom Complet</th>
            <th className="p-3 text-left">Niveau</th>
            <th className="p-3 text-left">Effectif</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedClasses.map((classe) => (
            <tr
              key={classe.id}
              className="border-b hover:bg-gray-50 transition duration-150"
            >
              <td className="p-3">{classe.abbr}</td>
              <td className="p-3">{classe.name}</td>
              <td className="p-3">{classe.niveau}</td>
              <td className="p-3">{classe.effectif}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedClassId(classe.id);
                    setShowModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 transition duration-200"
                  title="Voir les détails"
                >
                  <Image
                    src="/icons/eye.png"
                    alt="Voir les détails"
                    width={20}
                    height={20}
                  />
                </button>
                <button
                  onClick={() => handleDeleteClass(classe.id)}
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
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        <div className="text-gray-700">
          Page {currentPage} sur {totalPages}
        </div>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
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
            className="bg-white p-6 rounded-lg w-96 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-500">
              Détails de la classe
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Abréviation
                </label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedClass.abbr}
                  onChange={(e) =>
                    handleUpdateClass({
                      ...selectedClass,
                      abbr: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedClass.name}
                  onChange={(e) =>
                    handleUpdateClass({
                      ...selectedClass,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enseignants
                </label>
                <ul className="space-y-2">
                  {selectedClass.enseignants.map((teacher, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"
                    >
                      <span>{teacher}</span>
                      <button
                        onClick={() =>
                          handleRemoveTeacher(teacher, selectedClass.id)
                        }
                        className="text-red-500 hover:text-red-700 transition duration-200"
                      >
                        <Image
                          src="/icons/delete.png"
                          alt="Supprimer"
                          width={20}
                          height={20}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Ajouter un enseignant"
                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newTeacher}
                    onChange={(e) => setNewTeacher(e.target.value)}
                  />
                  <button
                    onClick={handleAddTeacher}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 w-full hover:bg-blue-600 transition duration-200"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Fermer
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
            className="bg-white p-6 rounded-lg w-96 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-500">
              Ajouter une classe
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Abréviation
                </label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newClassAbbr}
                  onChange={(e) => setNewClassAbbr(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enseignants
                </label>
                <ul className="space-y-2">
                  {newClassTeachers.map((teacher, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"
                    >
                      <span>{teacher}</span>
                      <button
                        onClick={() =>
                          setNewClassTeachers((prev) =>
                            prev.filter((t) => t !== teacher)
                          )
                        }
                        className="text-red-500 hover:text-red-700 transition duration-200"
                      >
                        <Image
                          src="/icons/delete.png"
                          alt="Supprimer"
                          width={20}
                          height={20}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Ajouter un enseignant"
                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tempTeacher}
                    onChange={(e) => setTempTeacher(e.target.value)}
                  />
                  <button
                    onClick={addTeacherToNewClass}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 w-full hover:bg-blue-600 transition duration-200"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddClass}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Créer la classe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
