"use client";
import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import FormulaireFiliere from "../formulaires/FormulaireFiliere"; // Assure-toi que le chemin est correct

const ListeFilieres = () => {
  const [filieres, setFilieres] = useState([
    { id: 1, nom: "Informatique", description: "Programmation, IA et Réseaux", niveau: "Licence" },
    { id: 2, nom: "Génie Civil", description: "Construction et Architecture", niveau: "Master" },
    { id: 3, nom: "Économie", description: "Gestion et Finance", niveau: "Licence" },
    { id: 4, nom: "Droit", description: "Législation et jurisprudence", niveau: "Master" },
    { id: 5, nom: "Médecine", description: "Soins et Santé", niveau: "Master" },
    { id: 6, nom: "Chimie", description: "Laboratoire et Expérimentation", niveau: "Licence" }
  ]);

  const [selectedFiliere, setSelectedFiliere] = useState<Filiere | null>(null);
  const [isAdding, setIsAdding] = useState(false); // État pour afficher le formulaire d'ajout
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(filieres.length / itemsPerPage);
  const indexOfLastFiliere = currentPage * itemsPerPage;
  const indexOfFirstFiliere = indexOfLastFiliere - itemsPerPage;
  const currentFilieres = filieres.slice(indexOfFirstFiliere, indexOfLastFiliere);

interface Filiere {
    id: number;
    nom: string;
    description: string;
    niveau: string;
}

const handleSelect = (filiere: Filiere) => {
    setSelectedFiliere(filiere.id === selectedFiliere?.id ? null : filiere);
};

  const handleDelete = () => {
    if (selectedFiliere) {
      setFilieres(filieres.filter((filiere) => filiere.id !== selectedFiliere.id));
      setSelectedFiliere(null);
    }
  };

  const handlePageChange = (direction: number) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + direction, 1), totalPages));
  };

  // Fonction pour ajouter une filière
  const handleAddFiliere = async (formData: FormData): Promise<void> => {
    // Add your logic to handle form data here
    setIsAdding(false); // Ferme le formulaire après l'ajout
  };

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg flex">
      {/* Tableau des filières */}
      <div className="w-3/4">
        <h2 className="text-xl font-semibold mb-4">Liste des Filières</h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Niveau</th>
              </tr>
            </thead>
            <tbody>
              {currentFilieres.map((filiere) => (
                <tr
                  key={filiere.id}
                  className={`cursor-pointer border-b ${selectedFiliere?.id === filiere.id ? "bg-blue-200" : "hover:bg-gray-100"}`}
                  onClick={() => handleSelect(filiere)}
                >
                  <td className="p-3">{filiere.nom}</td>
                  <td className="p-3">{filiere.description}</td>
                  <td className="p-3">{filiere.niveau}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filieres.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(-1)}
              disabled={currentPage === 1}
              className="bg-gray-500 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              Précédent
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

      {/* Boutons d'action */}
      <div className="w-1/6 flex flex-col items-start space-y-4 mt-10 ml-auto">
        <button
          className="bg-green-600 text-white px-3 py-1.5 w-full rounded-lg flex items-center justify-center hover:bg-green-700 text-sm"
          onClick={() => setIsAdding(true)} // Ouvre le formulaire
        >
          <FaPlus className="mr-1" /> Ajouter
        </button>
        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedFiliere ? "bg-yellow-600 text-white hover:bg-yellow-700" : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedFiliere}
        >
          <FaEdit className="mr-1" /> Modifier
        </button>
        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedFiliere ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedFiliere}
          onClick={handleDelete}
        >
          <FaTrash className="mr-1" /> Supprimer
        </button>
      </div>

      {/* Affichage du formulaire dans une boîte modale */}
      {isAdding && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsAdding(false)}
        >
          <div
            className="bg-white rounded-lg p-6 shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <FormulaireFiliere
              onSubmit={handleAddFiliere}
              onCancel={() => setIsAdding(false)}
              title="Création d'une Nouvelle Filière"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeFilieres;
