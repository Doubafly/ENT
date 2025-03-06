"use client";
import ListCard, { User } from "@/components/card/ListCard";
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
  etudiants?: string[]; // Add this line
}
const enseignantsData: User[] = [
  {
    id: 1,
    image: "/img/profil1.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "mah@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT001",
  },
  {
    id: 2,
    image: "/img/profil2.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "kissa@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT002",
  },
  {
    id: 3,
    image: "/img/profil3.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "awa@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT003",
  },
  {
    id: 4,
    image: "/img/profil4.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT004",
  },
  {
    id: 5,
    image: "/img/profil5.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "moussa@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT005",
  },
  {
    id: 6,
    image: "/img/profil6.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "issa@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT006",
  },
  {
    id: 7,
    image: "/img/profil6.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "issa+1@example.com", // Email rendu unique
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT007",
  },
  {
    id: 8,
    image: "/img/profil7.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "bourma@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT008",
  },
  {
    id: 9,
    image: "/img/profil8.jpg",
    nom: "Maiga",
    prenom: "Mahamoud",
    email: "bourma+1@example.com", // Email rendu unique
    adresse: "Bamako, Sotuba",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT009",
  },
  {
    id: 10,
    image: "/img/profil9.jpg",
    nom: "DIALLO",
    prenom: "Moussa",
    email: "bourma+2@example.com", // Email rendu unique
    adresse: "Bamako, Mali",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT010",
  },
];

const etudiantsData: User[] = [
  {
    id: 11,
    image: "/img/profil7.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "bourma+3@example.com", // Email rendu unique
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT011",
  },
  {
    id: 12,
    image: "/img/profil8.jpg",
    nom: "Maiga",
    prenom: "Mahamoud",
    email: "bourma+4@example.com", // Email rendu unique
    adresse: "Bamako, Sotuba",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT012",
  },
  {
    id: 13,
    image: "/img/profil9.jpg",
    nom: "DIALLO",
    prenom: "Moussa",
    email: "bourma+5@example.com", // Email rendu unique
    adresse: "Bamako, Mali",
    date: "01/01/1980",
    tel: "0123456789",
    filiere: "Mathématiques",
    matricule: "MAT013",
  },
];
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
      id: 6,
      abbr: "AP",
      name: "Analyse-Programmation",
      enseignants: ["Drissa Kouma"],
      niveau: "Licence 1",
      effectif: 30,
    },
    {
      id: 7,
      abbr: "GL",
      name: "Génie Logiciel",
      enseignants: ["Awa Traoré"],
      niveau: "Licence 2",
      effectif: 25,
    },
    {
      id: 8,
      abbr: "RSI",
      name: "Réseaux et Systèmes Informatiques",
      enseignants: ["Ibrahim Diallo"],
      niveau: "Licence 3",
      effectif: 20,
    },
    {
      id: 9,
      abbr: "BD",
      name: "Bases de Données",
      enseignants: ["Fatoumata Diarra"],
      niveau: "Licence 2",
      effectif: 28,
    },
    {
      id: 10,
      abbr: "IA",
      name: "Intelligence Artificielle",
      enseignants: ["Moussa Keita"],
      niveau: "Master 1",
      effectif: 18,
    },
    {
      id: 11,
      abbr: "AP",
      name: "Analyse-Programmation",
      enseignants: ["Drissa Kouma"],
      niveau: "Licence 1",
      effectif: 30,
    },
    {
      id: 12,
      abbr: "GL",
      name: "Génie Logiciel",
      enseignants: ["Awa Traoré"],
      niveau: "Licence 2",
      effectif: 25,
    },
    {
      id: 13,
      abbr: "RSI",
      name: "Réseaux et Systèmes Informatiques",
      enseignants: ["Ibrahim Diallo"],
      niveau: "Licence 3",
      effectif: 20,
    },
    {
      id: 14,
      abbr: "BD",
      name: "Bases de Données",
      enseignants: ["Fatoumata Diarra"],
      niveau: "Licence 2",
      effectif: 28,
    },
    {
      id: 15,
      abbr: "IA",
      name: "Intelligence Artificielle",
      enseignants: ["Moussa Keita"],
      niveau: "Master 1",
      effectif: 18,
    },
    {
      id: 16,
      abbr: "AP",
      name: "Analyse-Programmation",
      enseignants: ["Drissa Kouma"],
      niveau: "Licence 1",
      effectif: 30,
    },
    {
      id: 17,
      abbr: "GL",
      name: "Génie Logiciel",
      enseignants: ["Awa Traoré"],
      niveau: "Licence 2",
      effectif: 25,
    },
    {
      id: 18,
      abbr: "RSI",
      name: "Réseaux et Systèmes Informatiques",
      enseignants: ["Ibrahim Diallo"],
      niveau: "Licence 3",
      effectif: 20,
    },
    {
      id: 19,
      abbr: "BD",
      name: "Bases de Données",
      enseignants: ["Fatoumata Diarra"],
      niveau: "Licence 2",
      effectif: 28,
    },
    {
      id: 20,
      abbr: "IA",
      name: "Intelligence Artificielle",
      enseignants: ["Moussa Keita"],
      niveau: "Master 1",
      effectif: 18,
    },
  ]);
  const [selectedEnseignant, setSelectedEnseignant] = useState<User | null>(
    null
  );
  const [selectedEtudiant, setSelectedEtudiant] = useState<User | null>(null);

  const handleDeleteEnseignant = (email: string) => {
    console.log("Supprimer enseignant:", email);
  };

  const handleDeleteEtudiant = (email: string) => {
    console.log("Supprimer étudiant:", email);
  };
  const [enseignants, setEnseignants] = useState<User[]>(enseignantsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnseigant, setSelectedEnseigant] = useState<User | null>(null); // État pour gérer l'affichage du modal
  const itemsPerPage = 8;

  // Calcul des pages
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Gérer la pagination
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Gérer la suppression d'un enseignant
  const handleDelete = (user: User) => {
    const updatedEnseignants = enseignants.filter(
      (e) => e.email !== user.email
    );
    // setEnseignants(updatedEnseignants);
    setEnseignants([...updatedEnseignants]);

    // Vérifier si la suppression a vidé la page courante
    const newTotalPages = Math.ceil(updatedEnseignants.length / itemsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
    }
  };

  const [search, setSearch] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassAbbr, setNewClassAbbr] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newClassTeachers, setNewClassTeachers] = useState<string[]>([]);
  const [tempTeacher, setTempTeacher] = useState("");

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.abbr.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
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
    <div className="p-10 mt-4 bg-gray-50 min-h-screen">
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
            className="bg-white p-6 rounded-lg w-full max-w-5xl shadow-xl overflow-y-auto max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-500">
              Détails de la classe
            </h2>
            <div className="space-y-6">
              {/* Section Abréviation et Nom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* Section Enseignants */}
              <div className="flex gap-10">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enseignants
                  </label>
                  <ul className="space-y-2 grid grid-cols-2">
                    {enseignantsData.map((enseignant, index) => (
                      // <ListCard key={`${enseignant.email}-${index}`} item={enseignant} onEdit={() => {}} onDelete={handleDelete} />
                      <li key={`${enseignant.email}-${index}`}>
                        <ListCard
                          item={enseignant}
                          onEdit={() => {}}
                          onDelete={handleDelete}
                          onSelect={() => setSelectedEnseignant(enseignant)}
                        />
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Etudiants
                  </label>
                  <ul className="space-y-2 grid grid-cols-2">
                    {enseignantsData.map((enseignant, index) => (
                      // <ListCard key={`${enseignant.email}-${index}`} item={enseignant} onEdit={() => {}} onDelete={handleDelete} />
                      <li key={`${enseignant.email}-${index}`}>
                        <ListCard
                          item={enseignant}
                          onEdit={() => {}}
                          onDelete={handleDelete}
                          onSelect={() => setSelectedEnseignant(enseignant)}
                        />
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
              {/* Section Liste des Enseignants */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-500">
                  Liste des Enseignants
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* {enseignantsData
                    .filter((enseignant) =>
                      selectedClass.enseignants.includes(enseignant.email)
                    )
                    .map((enseignant, index) => (
                      <ListCard
                        key={`${enseignant.email}-${index}`}
                        item={enseignant}
                        onEdit={() => {}}
                        onDelete={() =>
                          handleDeleteEnseignant(enseignant.email)
                        }
                        onSelect={() => setSelectedEnseignant(enseignant)}
                      />
                    ))} */}
                </div>
              </div>

              {/* Section Liste des Étudiants */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-500">
                  Liste des Étudiants
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {etudiantsData
                    .filter((etudiant) =>
                      selectedClass.etudiants?.includes(etudiant.email)
                    )
                    .map((etudiant, index) => (
                      <ListCard
                        key={`${etudiant.email}-${index}`}
                        item={etudiant}
                        onEdit={() => {}}
                        onDelete={() => handleDeleteEtudiant(etudiant.email)}
                        onSelect={() => setSelectedEtudiant(etudiant)}
                      />
                    ))}
                </div>
              </div>
            </div>

            {/* Bouton Fermer */}
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
