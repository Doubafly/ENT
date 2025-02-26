"use client";

import { useState } from "react";
import ListCard, { User } from "@/components/card/ListCard";

const enseignantsData: User[] = [
  { image: "/img/profil1.jpg", nom: "Dupont", prenom: "Jean", email: "mah@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil2.jpg", nom: "Dupont", prenom: "Jean", email: "kissa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil3.jpg", nom: "Dupont", prenom: "Jean", email: "awa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil4.jpg", nom: "Dupont", prenom: "Jean", email: "dramane@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil5.jpg", nom: "Dupont", prenom: "Jean", email: "moussa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil6.jpg", nom: "Dupont", prenom: "Jean", email: "issa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil6.jpg", nom: "Dupont", prenom: "Jean", email: "issa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil7.jpg", nom: "Dupont", prenom: "Jean", email: "bourma@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil8.jpg", nom: "Maiga", prenom: "Mahamoud", email: "bourma@example.com", adresse: "Bamako, Sotuba", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil9.jpg", nom: "DIALLO", prenom: "Moussa", email: "bourma@example.com", adresse: "Bamako, Mali", date: "01/01/1980", tel: "0123456789" },
];

export default function EnseignantList() {
  const [enseignants, setEnseignants] = useState<User[]>(enseignantsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtrage des enseignants en fonction du terme de recherche
  const filteredEnseignants = enseignants.filter((enseignant) =>
    `${enseignant.nom} ${enseignant.prenom} ${enseignant.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcul des pages
  const totalPages = Math.ceil(filteredEnseignants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnseignants = filteredEnseignants.slice(indexOfFirstItem, indexOfLastItem);

  // Gérer la pagination
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Gérer la suppression d'un enseignant
  const handleDelete = (user: User) => {
    const updatedEnseignants = enseignants.filter((e) => e.email !== user.email);
    // setEnseignants(updatedEnseignants);
    setEnseignants([...updatedEnseignants]);

    // Vérifier si la suppression a vidé la page courante
    const newTotalPages = Math.ceil(updatedEnseignants.length / itemsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
    }
  };
  // console.log("Enseignants:", enseignants);
  // console.log("Current enseignants affichés:", currentEnseignants);
  // console.log(`Page actuelle : ${currentPage} / ${totalPages}`);
  
  return (
    <div className="ml-0 px-1 py-5 text-xl">
      {/* Titre, barre de recherche et bouton Ajouter */}
      <div className="flex justify-between items-center mb-4 ml-6">
        <h1 className="text-xl font-bold">Liste des Enseignants</h1>
        <input
          type="text"
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Revenir à la première page lors d'une recherche
          }}
          className="w-1/3 p-3 border rounded-lg text-xs"
        />
        <button className="px-6 py-2 bg-green-500 hover:bg-blue-300 text-white text-xs rounded-lg mr-4">
          Ajouter
        </button>
      </div>

      {/* Liste des enseignants */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {currentEnseignants.map((enseignant, index) => (
  <ListCard key={`${enseignant.email}-${index}`} item={enseignant} onEdit={() => {}} onDelete={handleDelete} />
))}

        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-4">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50">
            Précédent
          </button>
          <span className="text-lg font-semibold">
            Page {currentPage} sur {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50">
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
