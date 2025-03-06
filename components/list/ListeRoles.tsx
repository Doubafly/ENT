import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Importation des icônes

const ListeRoles = () => {
  const [roles, setRoles] = useState([
    { id: 1, nom: "Admin", description: "Gère tout le système", permissions: "Créer, Lire, Modifier, Supprimer" },
    { id: 2, nom: "Professeur", description: "Gère les cours et notes", permissions: "Lire, Modifier" },
    { id: 3, nom: "Étudiant", description: "Accède aux ressources pédagogiques", permissions: "Lire" },
    { id: 4, nom: "Super Admin", description: "Accès complet à l'administration", permissions: "Créer, Lire, Modifier, Supprimer, Administrer" },
    { id: 5, nom: "Assistante", description: "Assiste dans la gestion des cours", permissions: "Lire, Modifier" },
    { id: 6, nom: "Technicien", description: "Gère la maintenance des systèmes", permissions: "Lire, Modifier, Supprimer" }
  ]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Nombre d'éléments par page

  interface Role {
    id: number;
    nom: string;
    description: string;
    permissions: string;
  }

  // Pagination
  const totalPages = Math.ceil(roles.length / itemsPerPage);
  const indexOfLastRole = currentPage * itemsPerPage;
  const indexOfFirstRole = indexOfLastRole - itemsPerPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);

  const handleSelect = (role: Role) => {
    setSelectedRole(role.id === selectedRole?.id ? null : role);
  };

  const handleDelete = () => {
    if (selectedRole) {
      setRoles(roles.filter((role) => role.id !== selectedRole.id));
      setSelectedRole(null);
    }
  };

  const handlePageChange = (direction: number) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + direction, 1), totalPages));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex">
      {/* Tableau des rôles */}
      <div className="w-3/4">
        <h2 className="text-xl font-semibold mb-4">Liste des Rôles</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Nom</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {currentRoles.map((role) => (
              <tr
                key={role.id}
                className={`cursor-pointer hover:bg-blue-100 ${selectedRole?.id === role.id ? "bg-blue-200" : ""}`}
                onClick={() => handleSelect(role)}
              >
                <td className="border p-2">{role.nom}</td>
                <td className="border p-2">{role.description}</td>
                <td className="border p-2">{role.permissions}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {roles.length > itemsPerPage && (
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

      {/* Boutons d'action à droite avec icônes */}
      <div className="w-1/6 flex flex-col items-end space-y-4 mt-10 ml-auto">
        <button className="bg-green-600 text-white px-3 py-1.5 w-full rounded-lg flex items-center justify-center hover:bg-green-700 text-sm">
          <FaPlus className="mr-2" /> Ajouter
        </button>
        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedRole ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedRole}
        >
          <FaEdit className="mr-2" /> Modifier
        </button>
        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedRole ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          onClick={handleDelete}
          disabled={!selectedRole}
        >
          <FaTrash className="mr-2" /> Supprimer
        </button>
      </div>
    </div>
  );
};

export default ListeRoles;
