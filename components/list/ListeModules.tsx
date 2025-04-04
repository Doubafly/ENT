"use client";
import { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import FormulaireModule from "../formulaires/FormulaireModule";

type Module = {
  id: number;
  nom: string;
  code_module: string;
  description: string;
  credits: number;
  volumeHoraire: number;
};

const ListeModules = () => {
  const [modules, setModules] = useState([
    {
      id: 1,
      nom: "Mathématiques",
      code_module: "MATH101",
      description: "Algèbre et Analyse",
      credits: 6,
      volumeHoraire: 45,
    },
    {
      id: 2,
      nom: "Programmation",
      code_module: "INFO102",
      description: "Programmation en C",
      credits: 4,
      volumeHoraire: 30,
    },
    {
      id: 3,
      nom: "Base de Données",
      code_module: "INFO201",
      description: "SQL et Modélisation",
      credits: 5,
      volumeHoraire: 40,
    },
    {
      id: 4,
      nom: "Réseaux",
      code_module: "INFO301",
      description: "Réseaux Informatiques",
      credits: 5,
      volumeHoraire: 40,
    },
    {
      id: 5,
      nom: "Système d'exploitation",
      code_module: "INFO202",
      description: "Gestion des systèmes",
      credits: 4,
      volumeHoraire: 35,
    },
    {
      id: 6,
      nom: "Sécurité",
      code_module: "INFO402",
      description: "Sécurité informatique",
      credits: 6,
      volumeHoraire: 50,
    },
    {
      id: 7,
      nom: "Algorithmique",
      code_module: "MATH202",
      description: "Algorithmes avancés",
      credits: 4,
      volumeHoraire: 30,
    },
    {
      id: 8,
      nom: "Cloud Computing",
      code_module: "INFO502",
      description: "Introduction au Cloud",
      credits: 4,
      volumeHoraire: 40,
    },
  ]);

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(modules.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentModules = modules.slice(indexOfFirstItem, indexOfLastItem);

  const handleSelect = (module: Module) => {
    setSelectedModule(module.id === selectedModule?.id ? null : module);
  };

  const handleDelete = () => {
    if (selectedModule) {
      setModules(modules.filter((module) => module.id !== selectedModule.id));
      setSelectedModule(null);
    }
  };

  const handlePageChange = (direction: number) => {
    setCurrentPage((prev) =>
      Math.min(Math.max(prev + direction, 1), totalPages)
    );
  };

  const handleAddFiliere = async (formData: FormData): Promise<void> => {
    // Add your logic to handle form data here
    setIsAdding(false); // Ferme le formulaire après l'ajout
  };

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg flex items-start">
      {/* Table & Pagination */}
      <div className="w-4/4">
        <h2 className="text-xl font-semibold mb-4">Liste des Modules</h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Crédits</th>
                <th className="p-3 text-left">Volume Horaire</th>
              </tr>
            </thead>
            <tbody>
              {currentModules.map((module) => (
                <tr
                  key={module.id}
                  className={`cursor-pointer border-b ${
                    selectedModule?.id === module.id
                      ? "bg-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelect(module)}
                >
                  <td className="p-3">{module.nom}</td>
                  <td className="p-3">{module.code_module}</td>
                  <td className="p-3">{module.description}</td>
                  <td className="p-3">{module.credits}</td>
                  <td className="p-3">{module.volumeHoraire}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {modules.length > itemsPerPage && (
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
      <div className="w-1/6 flex flex-col items-start space-y-4 mt-10 ml-auto">
        <button
          className="bg-green-600 text-white px-3 py-1.5 w-full rounded-lg flex items-center justify-center hover:bg-green-700 text-sm"
          onClick={() => setIsAdding(true)}
        >
          <FaPlus className="mr-1" /> Ajouter
        </button>
        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedModule
              ? "bg-yellow-600 text-white hover:bg-yellow-700"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedModule}
        >
          <FaEdit className="mr-1" /> Modifier
        </button>
        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedModule
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedModule}
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
            <FormulaireModule
              title="Ajouter un module"
              onSubmit={handleAddFiliere}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeModules;
