import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef, GridValueGetter } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

// Définir l'interface pour un enseignant
interface Student {
  id: number;
  firstName: string;
  lastName: string;
  Heure: string;
  justifier?: string;
  classe?: string;
  
}

// Exemple de données
const initialRows: Student[] = [
  { id: 1, lastName: 'Diallo', firstName: 'Kadidia', Heure: '8H-10H', justifier: 'malade' , classe: 'Licence'}, 
   { id: 2, lastName: 'Cisse', firstName: 'Moussa', Heure: '10H-12H', justifier: '_', classe: 'Licence'},  
  { id: 3, lastName: 'Konaté', firstName: 'Souleymane', Heure: '10H-12H', justifier: '_', classe: 'Secondaire'}, 
  { id: 4, lastName: 'Toure', firstName: 'Boubacar', Heure: '10H-12H', justifier: '_', classe: 'Primaire'}, 
  { id: 5, lastName: 'Sidibe', firstName: 'Adam', Heure: '10H-12H', justifier: 'permission', classe: 'Primaire'}, 
  { id: 6, lastName: 'Sylla', firstName: 'Ousmane', Heure: '10H-12H', justifier: 'malade', classe: 'Primaire'},  
  { id: 7, lastName: 'Diarra', firstName: 'Mamadou', Heure: '10H-12H', justifier: '_', classe: 'Primaire'}, 
  { id: 8, lastName: 'Diakite', firstName: 'Madi', Heure: '10H-12H', justifier: 'malade', classe: 'Secondaire'}, 
  { id: 9, lastName: 'Ba', firstName: 'Mamadou', Heure: '10H-12H', justifier: 'permission', classe: 'Licence'}, 
];

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
      <strong>
        <button className="text-blue-500 hover:text-blue-700"> Voir ses absences</button>
      </strong>
    ),
  },
];

export default function AbsenceEtudiantList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [rows, setRows] = useState<Student[]>(initialRows);
  
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
    // Traduction du jour de la date sélectionnée
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
  // Filtrage dynamique
  const filteredRows = rows.filter((row) => {
    const matchesSearch = `${row.firstName} ${row.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    // const matchesClass = classFilter ? row.module === classFilter : true;
    return matchesSearch ;
  });

  // ...

return (
  <div  className="ml-0 px-1 py-5 text-xl">
    {/* Barre de recherche et filtres */}
    <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
      <input
        type="text"
        placeholder="Rechercher un enseignant..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm"
      />
      {/* <select
        value={classFilter}
        onChange={(e) => {
          setClassFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm"
      >
        {/* <option value="">Filtrer module</option>
        {[...new Set(rows.map((e) => e.module))].map((module) => (
          <option key={module} value={module}>
            {module}
          </option>
        ))} 
      </select> */}
      <select
        value={classFilter}
        onChange={(e) => {
          setClassFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm"
      >
        <option value="">Filtrer par Classes</option>
        {[...new Set(rows.map((e) => e.classe))].map((classe) => (
          <option key={classe} value={classe}>
            {classe}
          </option>
        ))}
      </select>
      <button
        onClick={() => setShowForm(true)}
        className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 transition duration-200"
      >
        Enregister les absences
      </button>
    </div>

    <div className="flex items-center text-ml text-green-600 mb-4">
      <span>Jour :</span>
      <span className="ml-2 font-medium capitalize">{dayName}</span>
    </div>

    {/* Tableau */}
    <Paper sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  </div>
);
}