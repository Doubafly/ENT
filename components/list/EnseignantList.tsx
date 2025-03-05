"use client";

import ListCard, { User } from "@/components/card/ListCard";
import Modal from "@/components/modal/Modal";
import RegisterFormEnseignant from "../formulaires/FormulaireProf";
import Image from "next/image";
import { useState } from "react";

const enseignantsData: User[] = [
  {
    image: "/img/profil1.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "mah@example.com",
    adresse: "Paris, France",
    date: "2022",
    tel: "0123456789",
    matricule: "12CV",
    id: 1,
    filiere: "ap1",
  },
  {
    image: "/img/profil2.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "kissa@example.com",
    adresse: "Paris, France",
    date: "2023",
    tel: "0123456789",
    id: 2,
    filiere: "AP",
    matricule: "",
  },
  {
    image: "/img/profil3.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "awa@example.com",
    adresse: "Paris, France",
    date: "2022",
    tel: "0123456789",
    id: 3,
    filiere: "ISR",
    matricule: "",
  },
  {
    image: "/img/profil4.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "2023",
    tel: "0123456789",
    id: 0,
    filiere: "ISR",
    matricule: "",
  },
  {
    image: "/img/profil5.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "2023",
    tel: "0123456789",

    id: 0,
    filiere: "ISR",
    matricule: "",
  },
  {
    image: "/img/profil6.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "2023",
    tel: "0123456789",

    id: 0,
    filiere: "ISR",
    matricule: "",
  },
  {
    image: "/img/profil7.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "2023",
    tel: "0123456789",

    id: 0,
    filiere: "MIAGE",
    matricule: "",
  },
  {
    image: "/img/profil8.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "2023",
    tel: "0123456789",

    id: 0,
    filiere: "MIAGE",
    matricule: "",
  },
  {
    image: "/img/profil9.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "2023",
    tel: "0123456789",

    id: 0,
    filiere: "MIAGE",
    matricule: "",
  },
  {
    image: "/img/profil10.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "2023",
    tel: "0123456789",

    id: 0,
    filiere: "GLDW",
    matricule: "",
  },
  {
    image: "/img/profil11.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "2023",
    tel: "0123456789",

    id: 0,
    filiere: "GLDW",
    matricule: "",
  },
  {
    image: "/img/profil12.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "2023",
    tel: "0123456789",

    id: 0,
    filiere: "GLDW",
    matricule: "",
  },
  {
    image: "/img/profil13.jpg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "2023",
    tel: "0123456789",

    id: 0,
    filiere: "GLDW",
    matricule: "",
  },
];

export default function EnseignantList() {
  const [enseignants, setEnseignants] = useState<User[]>(enseignantsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEnseignant, setSelectedEnseignant] = useState<User | null>(
    null
  );
  const [showForm, setShowForm] = useState(false); // Contrôle l'affichage du formulaire d'ajout
  const itemsPerPage = 8;

  // Récupération des classes et années uniques pour les filtres
  const classesDisponibles = Array.from(
    new Set(enseignantsData.map((ens) => ens.filiere))
  );
  const anneesDisponibles = Array.from(
    new Set(enseignantsData.map((ens) => ens.date))
  );

  // Filtrage des enseignants
  const filteredEnseignants = enseignants.filter((enseignant) => {
    return (
      `${enseignant.nom} ${enseignant.prenom} ${enseignant.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (classFilter ? enseignant.filiere === classFilter : true) &&
      (yearFilter ? enseignant.date === yearFilter : true)
    );
  });

  const totalPages = Math.ceil(filteredEnseignants.length / itemsPerPage);
  const currentEnseignants = filteredEnseignants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (name: string) => {
    setEnseignants((prevEnseignants) =>
      prevEnseignants.filter((ens) => ens.nom !== name)
    );
    console.log(`Enseignant avec le nom ${name} supprimé.`);
  };
  // Fonction pour fermer le formulaire d'ajout
  const handleCloseForm = () => {
    setShowForm(false); // Ferme le formulaire en modifiant l'état
  };

  return (
    <div className="ml-0 px-1 py-5 text-xl ">
      {/* <h1 className="text-xl font-bold mb-6 text-center">
        <img src="/icons/teach.png" alt="Téléphone" className="w-8 h-8" />
        <span>Liste des Enseignants</span>
      </h1> */}
      <div className="flex justify-between items-center mb-4 ml-6">
        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/4 p-3 border rounded-lg text-xs"
        />

        {/*Filtre  Sélecteur de classe */}
        <select
          title="classe"
          value={classFilter}
          onChange={(e) => {
            setClassFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/4 p-3 border rounded-lg text-xs"
        >
          <option value="">Filtrer par classes</option>
          {classesDisponibles.map((filiere) => (
            <option key={filiere} value={filiere}>
              {filiere}
            </option>
          ))}
        </select>

        {/* Filtre Sélecteur d'année */}
        <select
          title="year"
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/4 p-3 border rounded-lg text-xs"
        >
          <option value="">Filtrer par années</option>
          {anneesDisponibles.map((annee) => (
            <option key={annee} value={annee}>
              {annee}
            </option>
          ))}
        </select>

        {/* Bouton Ajouter */}
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-2 bg-green-500 hover:bg-blue-300 text-white text-ms rounded-lg mr-4"
        >
          + Ajouter
        </button>
      </div>

      {/* Liste des enseignants */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {currentEnseignants.map((enseignant, index) => (
            <ListCard
              key={`${enseignant.email}-${index}`}
              item={enseignant}
              onEdit={() => {}}
              onDelete={() => handleDelete(enseignant.nom)}
              onSelect={() => setSelectedEnseignant(enseignant)}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs"
          >
            Précédent
          </button>
          <span className=" font-semibold text-xs">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs"
          >
            Suivant
          </button>
        </div>
      )}
      {/* Modal */}
      {selectedEnseignant && (
        <Modal onClose={() => setSelectedEnseignant(null)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[400px] relative">
            {/* Bouton Fermer (en haut à droite) */}
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setSelectedEnseignant(null)}
                className="bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded-lg hover:bg-gray-400 transition-all duration-200"
              >
                x
              </button>
            </div>

            {/* Section avec background gris */}
            <div className="bg-gray-100 p-5 rounded-lg flex flex-col items-center">
              {/* Image centrée */}
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden border">
                <img
                  src={selectedEnseignant.image}
                  alt={`Photo de ${selectedEnseignant.nom}`}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Nom et Email */}
              <h2 className="text-center text-lg font-bold mt-2">
                {selectedEnseignant.nom} {selectedEnseignant.prenom}
              </h2>
              <p className="text-gray-500 text-sm">
                {selectedEnseignant.email}
              </p>
            </div>

            {/* Contenu en colonne */}
            <div className="mt-4 flex justify-between items-start px-6">
              {/* Infos personnelles */}
              <div className="space-y-3 text-sm text-gray-700">
                <p className="flex gap-2 items-center">
                  <img
                    src="/icons/book.png"
                    alt="Adresse"
                    className="w-4 h-4"
                  />
                  {selectedEnseignant.adresse}
                </p>
                <p className="flex gap-2 items-center">
                  <img
                    src="/icons/calendar.png"
                    alt="Date"
                    className="w-4 h-4"
                  />
                  {selectedEnseignant.date}
                </p>
                <p className="flex gap-2 items-center">
                  <img
                    src="/icons/call.png"
                    alt="Téléphone"
                    className="w-4 h-4"
                  />
                  {selectedEnseignant.tel}
                </p>
              </div>

              {/* Boutons à droite */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => console.log("Modifier", selectedEnseignant)}
                  className="bg-blue-500 text-white px-4 py-1 text-sm rounded-lg hover:bg-blue-600 transition-all duration-200"
                >
                  Modifier
                </button>

                <button
                  onClick={() => console.log("Supprimer", selectedEnseignant)}
                  className="bg-red-500 text-white px-4 py-1 text-sm rounded-lg hover:bg-red-600 transition-all duration-200"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setSelectedEnseignant(null)}
                  className="bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded-lg hover:bg-gray-400 transition-all duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal d'ajout d'un étudiant avec un formulaire */}
      {showForm && (
        <Modal onClose={handleCloseForm}>
          <RegisterFormEnseignant
            onSubmit={async (formData) => {
              console.log("Formulaire soumis !");
              console.log(
                "Nouvel enseignant:",
                Object.fromEntries([...formData.entries()])
              );
              setShowForm(false); // Ferme le formulaire après la soumission
            }}
            onClose={handleCloseForm} // Passe la fonction handleCloseForm à RegisterFormEnseignant
          />
        </Modal>
      )}
    </div>
  );
}
