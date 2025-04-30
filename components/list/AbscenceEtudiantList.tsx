import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Modal from "../modal/Modal";

// Interfaces pour typer les données des étudiants et de l'emploi du temps
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

// Données statiques des étudiants et emploi du temps
const initialRows: Student[] = [
  { id: 1, lastName: 'Diallo', firstName: 'Kadidia', Heure: '8H-10H', justifier: 'malade', classe: 'Licence' },
  { id: 2, lastName: 'Cisse', firstName: 'Moussa', Heure: '10H-12H', justifier: '_', classe: 'Licence' },
  { id: 3, lastName: 'Konaté', firstName: 'Souleymane', Heure: '10H-12H', justifier: '_', classe: 'Secondaire' },
  // Ajout d'autres étudiants...
];

const emploiDuTemps: EmploiDuTemps[] = [
  { id: '1', jour: 'lundi', heure_debut: '08:00', heure_fin: '10:00', classe_id: 'Licence', cours_id: 'math' },
  { id: '2', jour: 'lundi', heure_debut: '10:00', heure_fin: '12:00', classe_id: 'Secondaire', cours_id: 'physique' },
  { id: '3', jour: 'lundi', heure_debut: '14:00', heure_fin: '16:00', classe_id: 'Primaire', cours_id: 'lecture' },
  // Ajout d'autres horaires...
];

// Fonction principale pour afficher la liste des absences
export default function AbsenceEtudiantList() {
  // Hooks d'état pour gérer les filtres et les données
  const [searchTerm, setSearchTerm] = useState(""); // Pour filtrer par nom de l'étudiant
  const [classFilter, setClassFilter] = useState(""); // Pour filtrer par classe
  const [rows] = useState<Student[]>(initialRows); // Données des étudiants
  const [selectedTeacher, setSelectedTeacher] = useState<Student | null>(null); // Étudiant sélectionné pour voir ses absences
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]); // Date sélectionnée

  // Tableau des jours de la semaine
  const jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"] as const;
  const dayName = jours[new Date(selectedDate).getDay()]; // Nom du jour de la semaine basé sur la date sélectionnée

  // Modèle de pagination
  const paginationModel = { page: 0, pageSize: 5 };

  // Fonction pour vérifier si un cours est en cours maintenant
  const classeHasCoursNow = (classe: string) => {
    const now = new Date();
    const day = now.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase(); // Jour actuel
    const hour = now.getHours(); // Heure actuelle
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute; // Conversion de l'heure actuelle en minutes

    // Filtrer les cours de la classe actuelle pour le jour sélectionné
    const classeCours = emploiDuTemps.filter(
      (cours) => cours.classe_id === classe && cours.jour.toLowerCase() === day
    );

    // Vérifier si l'heure actuelle se situe dans l'intervalle d'un des cours
    for (const cours of classeCours) {
      const [startHour, startMinute] = cours.heure_debut.split(':').map(Number); // Début du cours
      const [endHour, endMinute] = cours.heure_fin.split(':').map(Number); // Fin du cours

      const startTime = startHour * 60 + startMinute; // Heure de début en minutes
      const endTime = endHour * 60 + endMinute; // Heure de fin en minutes

      // Si l'heure actuelle est entre l'heure de début et de fin, le cours est en cours
      if (currentTime >= startTime && currentTime <= endTime) {
        return true;
      }
    }

    return false; // Aucun cours en cours
  };

  // Filtrage des étudiants en fonction des critères de recherche et de classe
  const filteredRows = rows.filter((row) => {
    const matchesSearch = `${row.firstName} ${row.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter ? row.classe === classFilter : true;
    const hasCoursNow = classeHasCoursNow(row.classe ?? ""); // Vérifier si l'étudiant a un cours en cours maintenant
    return matchesSearch && matchesClass && hasCoursNow; // Retourne les étudiants qui correspondent aux critères
  });

  // Ouvrir la modal avec les informations de l'étudiant sélectionné
  const handleOpenModal = (student: Student) => {
    setSelectedTeacher(student);
  };

  // Colonnes du tableau
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
            handleOpenModal(params.row); // Ouvrir la modal pour voir les absences
          }}
        >
          Voir ses absences
        </button>
      ),
    },
  ];

  return (
    <div className="ml-0 px-1 py-5 text-xl">
      {/* Section de filtres */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Rechercher un étudiant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Mise à jour du terme de recherche
          className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm"
        />
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)} // Mise à jour du filtre de classe
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

      {/* Affichage du jour actuel */}
      <div className="flex items-center text-ml text-green-600 mb-4">
        <span>Jour :</span>
        <span className="ml-2 font-medium capitalize">{dayName}</span>
      </div>

      {/* Tableau des étudiants */}
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>

      {/* Modal pour afficher les détails d'un étudiant */}
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

            {/* Liste des absences */}
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
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
