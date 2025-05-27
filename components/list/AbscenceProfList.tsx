"use client";
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Modal from "../modal/Modal";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Cours {
  id_cours: number;
  filiere_module: {
    module: {
      id_module: number;
      nom: string;
    };
    filiere: {
      id_filiere: number;
      nom: string;
      niveau: string;
    };
  };
  enseignant: {
    id_enseignant: number;
    utilisateur: {
      id_utilisateur: number;
      nom: string;
      prenom: string;
    };
  };
  emplois?: {
    id_emploi: number;
    jour: string;
    heure_debut: string;
    heure_fin: string;
    salle: string;
  }[];
}

interface Absence {
  id_absence: number;
  date: string;
  id_emploi: number;
  id_enseignant: number;
  justifiee: boolean;
  motif?: string;
}

export default function AbsenceProfList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [cours, setCours] = useState<Cours[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<{
    enseignant: Cours['enseignant'];
    emploi: Cours['emplois'] extends Array<infer T> ? T : never;
    module: string;
    classe: string;
  } | null>(null);

  // Charger les données initiales
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Charger les cours avec leurs emplois
      const coursResponse = await fetch('/api/cours');
      if (!coursResponse.ok) throw new Error('Erreur de chargement des cours');
      const coursData = await coursResponse.json();
      setCours(coursData.cours || []);
      
      // Charger les absences
      const absencesResponse = await fetch('/api/absences');
      if (!absencesResponse.ok) throw new Error('Erreur de chargement des absences');
      const absencesData = await absencesResponse.json();
      setAbsences(absencesData.absences || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Données cours:', cours);
  console.log('Données absences:', absences);
    fetchInitialData();
  }, [cours, absences]);

  // Formater le nom du jour en français
  const dayName = format(parseISO(selectedDate), 'EEEE', { locale: fr });
  const dayOfWeek = format(parseISO(selectedDate), 'EEEE', { locale: fr }).toLowerCase();

  // Préparer les données pour le tableau
  const rows = cours.flatMap(c => {
    // Vérifier si emplois existe et est un tableau
    if (!c.emplois || !Array.isArray(c.emplois)) {
      return [];
    }
    
    return c.emplois
      .filter(emploi => emploi.jour.toLowerCase() === dayOfWeek)
      .map(emploi => ({
        id: emploi.id_emploi,
        id_enseignant: c.enseignant.id_enseignant,
        nom: c.enseignant.utilisateur.nom,
        prenom: c.enseignant.utilisateur.prenom,
        heure: `${format(parseISO(emploi.heure_debut), 'HH:mm')}-${format(parseISO(emploi.heure_fin), 'HH:mm')}`,
        module: c.filiere_module.module.nom,
        classe: `${c.filiere_module.filiere.niveau} ${c.filiere_module.filiere.nom}`,
        salle: emploi.salle,
        present: !absences.some(a => 
          a.id_emploi === emploi.id_emploi && 
          a.date === selectedDate
        )
      }));
  });

  const filteredRows = rows.filter(row => {
    const matchesSearch = `${row.prenom} ${row.nom}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass = classFilter ? row.classe === classFilter : true;
    const matchesModule = moduleFilter ? row.module === moduleFilter : true;
    return matchesSearch && matchesClass && matchesModule;
  });

  const handleOpenModal = (row: typeof rows[0]) => {
    const coursCorrespondant = cours.find(c => 
      c.enseignant.id_enseignant === row.id_enseignant
    );
    const emploiCorrespondant = coursCorrespondant?.emplois?.find(e => e.id_emploi === row.id);

    if (coursCorrespondant && emploiCorrespondant) {
      setSelectedTeacher({
        enseignant: coursCorrespondant.enseignant,
        emploi: emploiCorrespondant,
        module: coursCorrespondant.filiere_module.module.nom,
        classe: `${coursCorrespondant.filiere_module.filiere.niveau} ${coursCorrespondant.filiere_module.filiere.nom}`
      });
    }
  };

  const handleEnregistrer = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Préparer les absences à enregistrer
      const absencesToCreate = selectedRows.map(id_emploi => {
        const id_enseignant = rows.find(r => r.id === id_emploi)?.id_enseignant;
        if (typeof id_enseignant !== "number") {
          throw new Error("id_enseignant introuvable pour l'emploi sélectionné.");
        }
        return {
          id_emploi,
          date: selectedDate,
          id_enseignant,
          justifiee: false
        };
      });

      const response = await fetch('/api/absences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ absences: absencesToCreate })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');

      // Mettre à jour les absences localement
      const newAbsences = absencesToCreate.map(absence => ({
        ...absence,
        id_absence: Math.floor(Math.random() * 10000), // Temporaire en attendant la réponse du serveur
      }));

      setAbsences(prev => [...prev, ...newAbsences]);
      setSelectedRows([]);
      
      alert(`${absencesToCreate.length} absence(s) enregistrée(s).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "prenom", headerName: "Prénom", width: 130 },
    { field: "nom", headerName: "Nom", width: 130 },
    { field: "heure", headerName: "Heure", width: 130 },
    { field: "module", headerName: "Module", width: 130 },
    { field: "classe", headerName: "Classe", width: 130 },
    { 
      field: "present", 
      headerName: "Présent", 
      width: 100,
      type: 'boolean',
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {params.value ? 'Oui' : 'Non'}
        </span>
      )
    },
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
            e.stopPropagation();
            handleOpenModal(params.row);
          }}
        >
          Historique
        </button>
      ),
    },
  ];

  return (
    <div className="ml-0 px-1 py-5 text-xl">
      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Filtres et date */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm"
        />
        
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-3 border rounded-lg text-sm"
        />
        
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm"
        >
          <option value="">Tous les modules</option>
          {[...new Set(cours.map(c => c.filiere_module.module.nom))].map((module) => (
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
          <option value="">Toutes les classes</option>
          {[...new Set(cours.map(c => 
            `${c.filiere_module.filiere.niveau} ${c.filiere_module.filiere.nom}`
          ))].map((classe) => (
            <option key={classe} value={classe}>
              {classe}
            </option>
          ))}
        </select>
      </div>

      {/* Jour et bouton Enregistrer */}
      <div className="flex justify-between items-center min-w-[200px] p-3 border rounded-lg text-sm mb-4">
        <div className="flex items-center text-ml text-green-600">
          <span>Jour :</span>
          <span className="ml-2 font-medium capitalize">{dayName}</span>
        </div>
        
        <button
          onClick={handleEnregistrer}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={selectedRows.length === 0 || loading}
        >
          {loading ? 'Enregistrement...' : `Enregistrer (${selectedRows.length})`}
        </button>
      </div>

      {/* Tableau */}
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection as unknown as number[]);
          }}
          getRowId={(row) => row.id}
          loading={loading}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>

      {/* Modal d'historique */}
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
                {selectedTeacher.enseignant.utilisateur.prenom} {selectedTeacher.enseignant.utilisateur.nom}
              </h2>
              <p className="text-gray-500 text-sm">
                Module: {selectedTeacher.module}
              </p>
              <p className="text-gray-500 text-sm">
                Classe: {selectedTeacher.classe}
              </p>
            </div>

            {/* Liste d'absences */}
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-4 text-center">Historique des Absences</h3>
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border text-left">Date</th>
                      <th className="p-2 border text-left">Séance</th>
                      <th className="p-2 border text-left">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absences
                      .filter(a => a.id_enseignant === selectedTeacher.enseignant.id_enseignant)
                      .map((absence) => {
                        const emploi = cours
                          .flatMap(c => c.emplois ?? [])
                          .find((e) => e && e.id_emploi === absence.id_emploi);
                        
                        return (
                          <tr key={absence.id_absence} className="border-b">
                            <td className="p-2 border">{format(parseISO(absence.date), 'dd/MM/yyyy')}</td>
                            <td className="p-2 border">
                              {emploi ? `${format(parseISO(emploi.heure_debut), 'HH:mm')}-${format(parseISO(emploi.heure_fin), 'HH:mm')}` : 'N/A'}
                            </td>
                            <td className="p-2 border">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                absence.justifiee 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {absence.justifiee ? 'Justifiée' : 'Non justifiée'}
                              </span>
                              {absence.motif && (
                                <div className="text-xs text-gray-500 mt-1">{absence.motif}</div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}