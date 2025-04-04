import { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa"; // Importation des icônes
import FormulaireSession from "../formulaires/FormulaireSession";
// Adjust the path as necessary

const ListeSession = () => {
  const [roles, setRoles] = useState([
    { id: 1, Session: "2023-2022" },
    { id: 2, Session: "2022-2222" },
    { id: 3, Session: "2023-2022" },
    { id: 4, Session: "2023-2022" },
    { id: 5, Session: "2023-2022" },
    { id: 6, Session: "2023-2022" },
  ]);

  const [selectedSession, setSelectedSession] = useState<Role | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Nombre d'éléments par page

  interface Role {
    id: number;
    Session: string;
  }

  // Pagination
  const totalPages = Math.ceil(roles.length / itemsPerPage);
  const indexOfLastRole = currentPage * itemsPerPage;
  const indexOfFirstRole = indexOfLastRole - itemsPerPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);
  const [isAdding, setIsAdding] = useState(false);
  const handleSelect = (role: Role) => {
    setSelectedSession(role.id === selectedSession?.id ? null : role);
  };

  const handleDelete = () => {
    if (selectedSession) {
      setRoles(roles.filter((role) => role.id !== selectedSession.id));
      setSelectedSession(null);
    }
  };

  const handlePageChange = (direction: number) => {
    setCurrentPage((prev) =>
      Math.min(Math.max(prev + direction, 1), totalPages)
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex">
      {/* Tableau des rôles */}
      <div className="w-3/4">
        <h2 className="text-xl font-semibold mb-4">Liste des Rôles</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">id</th>
              <th className="border p-2">Session</th>
            </tr>
          </thead>
          <tbody>
            {currentRoles.map((role) => (
              <tr
                key={role.id}
                className={`cursor-pointer hover:bg-blue-100 ${
                  selectedSession?.id === role.id ? "bg-blue-200" : ""
                }`}
                onClick={() => handleSelect(role)}
              >
                <td className="border p-2">{role.id}</td>
                <td className="border p-2">{role.Session}</td>
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
        <button
          className="bg-green-600 text-white px-3 py-1.5 w-full rounded-lg flex items-center justify-center hover:bg-green-700 text-sm"
          onClick={() => setIsAdding(true)}
        >
          <FaPlus className="mr-2" /> Ajouter
        </button>
        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedSession
              ? "bg-yellow-600 hover:bg-yellow-700 text-white"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedSession}
        >
          <FaEdit className="mr-2" /> Modifier
        </button>
        <button
          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-center text-sm ${
            selectedSession
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          onClick={handleDelete}
          disabled={!selectedSession}
        >
          <FaTrash className="mr-2" /> Supprimer
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
            La liste de session
            <FormulaireSession
              onCancel={() => setIsAdding(false)}
              title="Ajouter une Session"
              onSubmit={async (formData: FormData) => {
                const session = formData.get("Session") as string;
                setRoles([
                  ...roles,
                  { id: roles.length + 1, Session: session },
                ]);
                setIsAdding(false);
              }}
              />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeSession;
