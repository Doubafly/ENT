"use client";
import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import FormulaireFiliere from "../formulaires/FormulaireFiliere";

const ListeAnnexes = () => {
  const [annexes, setAnnexes] = useState([
    { id: 1, nom: "Annexe 1", adresse: "10 Rue A", ville: "Paris", region: "Île-de-France" },
    { id: 2, nom: "Annexe 2", adresse: "20 Rue B", ville: "Lyon", region: "Auvergne-Rhône-Alpes" },
    { id: 3, nom: "Annexe 3", adresse: "30 Rue C", ville: "Marseille", region: "Provence-Alpes-Côte d'Azur" },
    { id: 4, nom: "Annexe 4", adresse: "40 Rue D", ville: "Nice", region: "Provence-Alpes-Côte d'Azur" },
    { id: 5, nom: "Annexe 5", adresse: "50 Rue E", ville: "Bordeaux", region: "Nouvelle-Aquitaine" },
    { id: 6, nom: "Annexe 6", adresse: "60 Rue F", ville: "Toulouse", region: "Occitanie" }
  ]);

  const [selectedAnnexe, setSelectedAnnexe] = useState<{ id: number; nom: string; adresse: string; ville: string; region: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiliereOpen, setIsFiliereOpen] = useState(false);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(annexes.length / itemsPerPage);
  const indexOfLastAnnexe = currentPage * itemsPerPage;
  const indexOfFirstAnnexe = indexOfLastAnnexe - itemsPerPage;
  const currentAnnexes = annexes.slice(indexOfFirstAnnexe, indexOfLastAnnexe);

  interface Annexe {
    id: number;
    nom: string;
    adresse: string;
    ville: string;
    region: string;
  }

  const handleSelect = (annexe: Annexe) => {
    setSelectedAnnexe(annexe.id === selectedAnnexe?.id ? null : annexe);
  };

  const handleDelete = () => {
    if (selectedAnnexe) {
      setAnnexes(annexes.filter((a) => a.id !== selectedAnnexe.id));
      setSelectedAnnexe(null);
    }
  };
  

  interface PageChangeHandler {
    (direction: number): void;
  }

  const handlePageChange: PageChangeHandler = (direction) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + direction, 1), totalPages));
  };

   // Fonction pour afficher/masquer le formulaire
   const  onCreateFiliere: () =>  void = () => {
    setIsFiliereOpen(true);
  };

  function handleRegisterSubmit(formData: FormData): Promise<void> {
    throw new Error("Function not implemented.");
    setIsFiliereOpen(false); 
  }

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg flex items-start">
      {/* Table & Pagination */}
      <div className="w-3/4">
        <h2 className="text-xl font-semibold mb-4">Liste des Annexes</h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Adresse</th>
                <th className="p-3 text-left">Ville</th>
                <th className="p-3 text-left">Région</th>
              </tr>
            </thead>
            <tbody>
              {currentAnnexes.map((annexe) => (
                <tr
                  key={annexe.id}
                  className={`cursor-pointer border-b ${selectedAnnexe?.id === annexe.id ? "bg-blue-200" : "hover:bg-gray-100"}`}
                  onClick={() => handleSelect(annexe)}
                >
                  <td className="p-3">{annexe.nom}</td>
                  <td className="p-3">{annexe.adresse}</td>
                  <td className="p-3">{annexe.ville}</td>
                  <td className="p-3">{annexe.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {annexes.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(-1)}
              disabled={currentPage === 1}
              className="bg-gray-500 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              Precedent
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === totalPages}
              className="bg-gray-500 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {/* Boutons d'action a droite */}
      <div className="w-1/6 flex flex-col items-start space-y-4 mt-11 ml-auto">
        <button className="bg-green-600 text-white px-3 py-1.5 w-full rounded-lg flex items-center justify-center hover:bg-green-700 text-sm"
            onClick={() => setIsFiliereOpen(true)}// Ajoute le formulaire lorsque cliqué
        >
          <FaPlus className="mr-1" /> Ajouter
          
        </button>
          {/* Formulaire à afficher lorsque isFiliereOpen est true */}
      {isFiliereOpen && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsFiliereOpen(false)} // Ferme le formulaire lorsqu'on clique en dehors
        >
          <div
            className="bg-white rounded-lg p-6 shadow-lg w-96"
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture du formulaire lorsqu'on clique à l'intérieur
          >
            <FormulaireFiliere
              onSubmit={handleRegisterSubmit}
              onCancel={() => setIsFiliereOpen(false)} // Ferme le formulaire lorsqu'on annule
              title="Création d'une Nouvelle Filière"
            />
          </div>
        </div>
      )}
        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedAnnexe ? "bg-yellow-600 text-white hover:bg-yellow-700" : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedAnnexe}
        >
          <FaEdit className="mr-1" /> Modifier

        </button>
        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedAnnexe ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedAnnexe}
          onClick={handleDelete}
        >
          <FaTrash className="mr-1" /> Supprimer
        </button>
      </div>
    </div>
  );
};

export default ListeAnnexes;
