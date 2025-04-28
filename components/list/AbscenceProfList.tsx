import * as React from "react";
import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Modal from "../modal/Modal";

// Définir l'interface pour un enseignant
interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  Heure: string;
  module?: string;
  classe?: string;
}

// Exemple de données
const initialRows: Teacher[] = [
  {
    id: 1,
    lastName: "Diallo",
    firstName: "Kadidia",
    Heure: "8H-10H",
    module: "Python",
    classe: "Licence",
  },
  {
    id: 2,
    lastName: "Cisse",
    firstName: "Moussa",
    Heure: "10H-12H",
    module: "Versioning",
    classe: "Licence",
  },
  {
    id: 3,
    lastName: "Konaté",
    firstName: "Souleymane",
    Heure: "10H-12H",
    module: "Java",
    classe: "Secondaire",
  },
  {
    id: 4,
    lastName: "Toure",
    firstName: "Boubacar",
    Heure: "10H-12H",
    module: "Maths",
    classe: "Primaire",
  },
  {
    id: 5,
    lastName: "Sidibe",
    firstName: "Adam",
    Heure: "10H-12H",
    module: "Finances",
    classe: "Primaire",
  },
  {
    id: 6,
    lastName: "Sylla",
    firstName: "Ousmane",
    Heure: "10H-12H",
    module: "Shell",
    classe: "Primaire",
  },
  {
    id: 7,
    lastName: "Diarra",
    firstName: "Mamadou",
    Heure: "10H-12H",
    module: "Langage C",
    classe: "Primaire",
  },
  {
    id: 8,
    lastName: "Diakite",
    firstName: "Madi",
    Heure: "10H-12H",
    module: "PHP",
    classe: "Secondaire",
  },
  {
    id: 9,
    lastName: "Ba",
    firstName: "Mamadou",
    Heure: "10H-12H",
    module: "React",
    classe: "Licence",
  },
];

export default function AbsenceProfList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [rows, setRows] = useState<Teacher[]>(initialRows);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const jours = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ] as const;
  const dayName = jours[new Date(selectedDate).getDay()];

  const paginationModel = { page: 0, pageSize: 5 };

  const filteredRows = rows.filter((row) => {
    const matchesSearch = `${row.firstName} ${row.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass = classFilter ? row.classe === classFilter : true;
    const matchesModule = moduleFilter ? row.module === moduleFilter : true;
    return matchesSearch && matchesClass && matchesModule;
  });

  // Fonction pour ouvrir le modal
  const handleOpenModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  // Colonnes du tableau
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "Nom", width: 130 },
    { field: "lastName", headerName: "Prenom", width: 130 },
    { field: "Heure", headerName: "Heure", width: 130 },
    { field: "module", headerName: "Module", width: 130 },
    { field: "classe", headerName: "Classe", width: 130 },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <button
          className="text-blue-500 hover:underline"
          onClick={(e) => {
            e.stopPropagation(); //  Empecher la sélection quand on clique
            handleOpenModal(params.row);
          }}
        >
          Voir ses absences
        </button>
      ),
    },
  ];

  return (
    <div className="ml-0 px-1 py-5 text-xl">
      {/* Filtres */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm"
        />
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm"
        >
          <option value="">Filtrer par Module</option>
          {[...new Set(rows.map((e) => e.module))].map((module) => (
            <option key={module} value={module}>
              {module}
            </option>
          ))}
        </select>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm"
        >
          <option value="">Filtrer par Classe</option>
          {[...new Set(rows.map((e) => e.classe))].map((classe) => (
            <option key={classe} value={classe}>
              {classe}
            </option>
          ))}
        </select>
      </div>

      {/* Jour */}
      <div className="flex items-center text-ml text-green-600 mb-4">
        <span>Jour :</span>
        <span className="ml-2 font-medium capitalize">{dayName}</span>
      </div>

      {/* Tableau */}
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick //  pour que cliquer ne coche pas
          sx={{ border: 0 }}
        />
      </Paper>

      {/* Modal */}
      {selectedTeacher && (
        <Modal onClose={() => setSelectedTeacher(null)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
            <div className="flex flex-col items-center mb-4">
              <img
                title="teacher-profile"
                src="img/man2.jpg"
                alt="Profile"
                className="object-cover w-[120px] h-[120px] rounded-full border"
              />
              <h2 className="text-lg font-bold mt-2">
                {selectedTeacher.firstName} {selectedTeacher.lastName}
              </h2>
              <p className="text-gray-500 text-sm">
                Module: {selectedTeacher.module}
              </p>
              <p className="text-gray-500 text-sm">
                Classe: {selectedTeacher.classe}
              </p>
            </div>

            {/* Liste d'absences */}
            <div className="mt-4 text-center">
  <h3 className="text-md font-semibold mb-4">Liste des Absences :</h3>
  <ul className="grid grid-cols-2 gap-2 list-none text-gray-700">
    <li>Absence le 20/04/2025</li>
    <li>Absence le 05/05/2025</li>
    <li>Absence le 10/05/2025</li>
    <li>Absence le 15/05/2025</li>
    <li>Absence le 20/05/2025</li>
    <li>Absence le 25/05/2025</li>
    <li>Absence le 30/05/2025</li>
    {/* Remplacer plus tard par les vraies données */}
  </ul>
</div>

          </div>
        </Modal>
      )}
    </div>
  );
}
