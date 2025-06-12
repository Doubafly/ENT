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
  const [cours, setCours] = useState<Cours[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<{
    enseignant: Cours['enseignant'];
    emploi: NonNullable<Cours['emplois']>[0];
    module: string;
    classe: string;
  } | null>(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursResponse, absencesResponse] = await Promise.all([
        fetch('/api/cours'),
        fetch('/api/absences')
      ]);

      if (!coursResponse.ok) throw new Error('Erreur de chargement des cours');
      if (!absencesResponse.ok) throw new Error('Erreur de chargement des absences');

      const [coursData, absencesData] = await Promise.all([
        coursResponse.json(),
        absencesResponse.json()
      ]);

      setCours(coursData.cours || []);
      setAbsences(absencesData.absences || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const dayOfWeek = format(parseISO(selectedDate), 'EEEE', { locale: fr }).toLowerCase();

  const rows = React.useMemo(() => {
    return cours.flatMap(c => {
      if (!c.emplois || !Array.isArray(c.emplois)) return [];
      return c.emplois
        .filter(e => e.jour.toLowerCase() === dayOfWeek)
        .map(e => ({
          id: e.id_emploi,
          id_enseignant: c.enseignant.id_enseignant,
          nom: c.enseignant.utilisateur.nom,
          prenom: c.enseignant.utilisateur.prenom,
          heure: `${e.heure_debut}-${e.heure_fin}`,
          module: c.filiere_module.module.nom,
          classe: `${c.filiere_module.filiere.niveau} ${c.filiere_module.filiere.nom}`,
          salle: e.salle,
          present: !absences.some(a => a.id_emploi === e.id_emploi && a.date === selectedDate)
        }));
    });
  }, [cours, absences, selectedDate, dayOfWeek]);
console.log("rows",rows);

  const filteredRows = React.useMemo(() => {
    return rows.filter(row => {
      const matchesSearch = `${row.prenom} ${row.nom}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = classFilter ? row.classe === classFilter : true;
      return matchesSearch && matchesClass;
    });
  }, [rows, searchTerm, classFilter]);

  const handleOpenModal = (row: typeof rows[0]) => {
    const coursCorrespondant = cours.find(c => c.enseignant.id_enseignant === row.id_enseignant);
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
      const absencesToCreate = selectedRows.map(id_emploi => {
        const row = rows.find(r => r.id === id_emploi);
        if (!row) throw new Error("Séance introuvable");
        return {
          id_emploi,
          date: selectedDate,
          id_enseignant: row.id_enseignant,
          justifiee: false
        };
      });

      const response = await fetch('/api/absences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ absences: absencesToCreate })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');
      await fetchInitialData();
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
        <span className={`px-2 py-1 rounded-full text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
        <button className="text-blue-500 hover:underline" onClick={(e) => { e.stopPropagation(); handleOpenModal(params.row); }}>
          Historique
        </button>
      )
    }
  ];

  return (
    <div className="ml-0 px-1 py-5 text-xl">
      {error && <div className="p-4 mb-4 text-red-500 bg-red-50 rounded-lg">{error}</div>}

      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <input type="text" placeholder="Rechercher un enseignant..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm" />
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="p-3 border rounded-lg text-sm" />
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm" disabled={loading}>
          <option value="">Toutes les classes</option>
          {[...new Set(cours.map(c => `${c.filiere_module.filiere.niveau} ${c.filiere_module.filiere.nom}`))].map(cl => (
            <option key={cl} value={cl}>{cl}</option>
          ))}
        </select>
      </div>

      <div className="h-[500px]">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(ids) => setSelectedRows(ids as unknown as number[])}
          loading={loading}
        />
      </div>

      {selectedRows.length > 0 && (
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleEnregistrer}>
          Enregistrer les absences
        </button>
      )}

      {selectedTeacher && (
        <Modal onClose={() => setSelectedTeacher(null)}>
          <div>
            <h2 className="text-xl font-semibold mb-2">Historique d'absences</h2>
            <p>Enseignant : {selectedTeacher.enseignant.utilisateur.prenom} {selectedTeacher.enseignant.utilisateur.nom}</p>
            <p>Module : {selectedTeacher.module}</p>
            <p>Classe : {selectedTeacher.classe}</p>
            {/* Tu peux afficher ici les détails d'absences de cet enseignant */}
          </div>
        </Modal>
      )}
    </div>
  );
}
