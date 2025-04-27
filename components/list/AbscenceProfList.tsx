import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef, GridValueGetter } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

// Définir l'interface pour un enseignant
interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  Heure: string;
  specialite?: string;
}

// Exemple de données
const initialRows: Teacher[] = [
  { id: 1, lastName: 'Diallo', firstName: 'Kadidia', Heure: '8H-10H', specialite: 'Maths' },
  { id: 2, lastName: 'Cisse', firstName: 'Moussa', Heure: '10H-12H', specialite: 'Physique' },
  { id: 3, lastName: 'Konaté', firstName: 'Souleymane', Heure: '10H-12H', specialite: 'Chimie' },
  { id: 4, lastName: 'Toure', firstName: 'Boubacar', Heure: '10H-12H', specialite: 'Maths' },
  { id: 5, lastName: 'Sidibe', firstName: 'Adam', Heure: '10H-12H', specialite: 'Biologie' },
  { id: 6, lastName: 'Sylla', firstName: 'Ousmane', Heure: '10H-12H', specialite: 'Physique' },
  { id: 7, lastName: 'Diarra', firstName: 'Mamadou', Heure: '10H-12H', specialite: 'Maths' },
  { id: 8, lastName: 'Diakite', firstName: 'Madi', Heure: '10H-12H', specialite: 'SVT' },
  { id: 9, lastName: 'Ba', firstName: 'Mamadou', Heure: '10H-12H', specialite: 'Chimie' },
];

// Colonnes du tableau
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'Nom', width: 130 },
  { field: 'lastName', headerName: 'Prenom', width: 130 },
  { field: 'Heure', headerName: 'Heure', width: 130 },
  // {
  //   field: 'specialite',
  //   headerName: 'Spécialité',
  //   width: 130,
  //   valueGetter: (params: { row: Teacher }) => params.row.specialite || 'Non spécifié',
  // },
];

export default function AbsenceProfList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [rows, setRows] = useState<Teacher[]>(initialRows);

  // Filtrage dynamique
  const filteredRows = rows.filter((row) => {
    const matchesSearch = `${row.firstName} ${row.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter ? row.specialite === classFilter : true;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="p-4">
      {/* Barre de recherche et filtres */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/3 p-3 border rounded-lg text-sm"
        />
        <select
          value={classFilter}
          onChange={(e) => {
            setClassFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/3 p-3 border rounded-lg text-sm"
        >
          <option value="">Filtrer par spécialité</option>
          {[...new Set(rows.map((e) => e.specialite))].map((specialite) => (
            <option key={specialite} value={specialite}>
              {specialite}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowForm(true)}
          className="w-1/4 p-3 border rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 transition duration-200"
        >
          Enregister les absences
        </button>
      </div>

      {/* Tableau */}
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          paginationModel={{ page: currentPage - 1, pageSize: 5 }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
          onPaginationModelChange={(model) => setCurrentPage(model.page + 1)}
        />
      </Paper>
    </div>
  );
}
