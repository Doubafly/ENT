import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Modal from "../modal/Modal";

// Interfaces
interface Student {
  id: number;
  firstName: string;
  lastName: string;
  Heure: string;
  justifier?: string;
  classe?: string;
}

interface EmploiDuTemps {
  id: string;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  classe_id: string;
  cours_id: string;
}

// Données statiques
const initialRows: Student[] = [
  { id: 1, lastName: 'Diallo', firstName: 'Kadidia', Heure: '8H-10H', justifier: 'malade', classe: 'Licence' },
  { id: 2, lastName: 'Cisse', firstName: 'Moussa', Heure: '10H-12H', justifier: '_', classe: 'Licence' },
  { id: 3, lastName: 'Konaté', firstName: 'Souleymane', Heure: '10H-12H', justifier: '_', classe: 'Secondaire' },
];

const emploiDuTemps: EmploiDuTemps[] = [
  { id: '1', jour: 'lundi', heure_debut: '08:00', heure_fin: '10:00', classe_id: 'Licence', cours_id: 'math' },
  { id: '2', jour: 'lundi', heure_debut: '10:00', heure_fin: '12:00', classe_id: 'Secondaire', cours_id: 'physique' },
  { id: '3', jour: 'lundi', heure_debut: '14:00', heure_fin: '16:00', classe_id: 'Primaire', cours_id: 'lecture' },
  { id: '4', jour: 'mardi', heure_debut: '08:00', heure_fin: '10:00', classe_id: 'Licence', cours_id: 'chimie' },
  { id: '5', jour: 'samedi', heure_debut: '10:00', heure_fin: '12:00', classe_id: 'Secondaire', cours_id: 'histoire' },
  { id: '6', jour: 'samedi', heure_debut: '21:00', heure_fin: '23:00', classe_id: 'Licence', cours_id: 'maths' },
];

// Composant principal
export default function AbsenceEtudiantList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [rows] = useState<Student[]>(initialRows);
  const [selectedTeacher, setSelectedTeacher] = useState<Student | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"] as const;
  const dayName = jours[new Date(selectedDate).getDay()];

  const paginationModel = { page: 0, pageSize: 5 };

  const classeHasCoursNow = (classe: string) => {
    const now = new Date();
    const day = now.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute;

    const classeCours = emploiDuTemps.filter(
      (cours) => cours.classe_id === classe && cours.jour.toLowerCase() === day
    );

    for (const cours of classeCours) {
      const [startHour, startMinute] = cours.heure_debut.split(':').map(Number);
      const [endHour, endMinute] = cours.heure_fin.split(':').map(Number);

      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      if (currentTime >= startTime && currentTime <= endTime) {
        return true;
      }
    }

    return false;
  };

  const filteredRows = rows.filter((row) => {
    const matchesSearch = `${row.firstName} ${row.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter ? row.classe === classFilter : true;
    const hasCoursNow = classeHasCoursNow(row.classe ?? "");
    return matchesSearch && matchesClass && hasCoursNow;
  });

  const handleOpenModal = (student: Student) => {
    setSelectedTeacher(student);
  };

  const handleEnregistrer = () => {
    const enseignantsSelectionnes = rows.filter((row) =>
      selectedRows.includes(row.id)
    );
    console.log('Enseignants sélectionnés :', enseignantsSelectionnes);
    alert(`${enseignantsSelectionnes.length} enseignant(s) enregistré(s).`);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'Nom', width: 130 },
    { field: 'lastName', headerName: 'Prenom', width: 130 },
    { field: 'Heure', headerName: 'Heure', width: 130 },
    { field: 'classe', headerName: 'Classe', width: 130 },
    { field: 'justifier', headerName: 'Justification', width: 130 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <button
          className="text-blue-500 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
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
          placeholder="Rechercher un étudiant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm"
        />
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

      {/* Enregistrer + Jour */}
      <div className="flex justify-between items-center min-w-[200px] p-3 border rounded-lg text-sm">
        <div className="flex items-center text-ml text-green-600">
          <span>Jour :</span>
          <span className="ml-2 font-medium capitalize">{dayName}</span>
        </div>
        <button
          onClick={handleEnregistrer}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={selectedRows.length === 0}
        >
          Enregistrer
        </button>
      </div>

      {/* Tableau */}
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection as unknown as number[]);
          }}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>

      {/* Modal étudiant */}
      {selectedTeacher && (
        <Modal onClose={() => setSelectedTeacher(null)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
            <div className="flex flex-col items-center mb-4">
              <img
                src="img/man2.jpg"
                alt="Profile"
                className="object-cover w-[120px] h-[120px] rounded-full border"
              />
              <h2 className="text-lg font-bold mt-2">
                {selectedTeacher.firstName} {selectedTeacher.lastName}
              </h2>
              <p className="text-gray-500 text-sm">Classe: {selectedTeacher.classe}</p>
              <p className="text-green-500 text-sm font-bold">Justification: {selectedTeacher.justifier}</p>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-md font-semibold mb-4">Liste des Absences :</h3>
              <ul className="grid grid-cols-2 gap-2 list-none text-gray-700">
                <li>Absence le 20/04/2025</li>
                <li>Absence le 05/05/2025</li>
                <li>Absence le 10/05/2025</li>
                <li>Absence le 15/05/2025</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
