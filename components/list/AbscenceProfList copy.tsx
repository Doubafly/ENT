import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Modal from "../modal/Modal";

// Interfaces
interface Prof {
  id: number;
  idCours: number;
  firstName: string;
  lastName: string;
  Heure: string;
  module?: string;
  justifier?: string;
  classe_id?: string;
  classe: string;
}

const prepareAbsenceDataParJour = (data: any, jour: string): Prof[] => {
  const rows: Prof[] = [];
  data.cours.forEach((cours: any) => {
    const moduleNom = cours.filiere_module?.module?.nom || "Inconnu";
    const idCours = cours.id_cours || "Inconnu";
    const classeNom = cours.filiere_module?.filiere?.nom || "Inconnue";
    const prof = cours.enseignant || [];
    const emplois = cours.emplois_du_temps || [];

    emplois.forEach((emploi: any) => {
      if (emploi.jour.toLowerCase() === jour.toLowerCase()) {
        const heure_debut = new Date(emploi.heure_debut)
          .toISOString()
          .substr(11, 5);
        const heure_fin = new Date(emploi.heure_fin)
          .toISOString()
          .substr(11, 5);
        const heure = `${heure_debut}H-${heure_fin}H`;

          rows.push({
            idCours: idCours,
            id: prof.utilisateur.id_utilisateur,
            firstName: prof.utilisateur.prenom,
            lastName: prof.utilisateur.nom,
            Heure: heure,
            module: moduleNom,
            classe: classeNom,
          });
      }
    });
  });

  return rows;
};

export default function AbsenceEtudiantList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Prof | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [allRows, setAllRows] = useState<Prof[]>([]);
  const [filteredClasse, setFilteredClasse] = useState("");

  const getCurrentHourRange = (): string => {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 10) return "08H-10H";
    if (hours < 12) return "10H-12H";
    if (hours < 14) return "12H-14H";
    if (hours < 16) return "14H-16H";
    return "16H-18H";
  };

  const [filteredHeure, setFilteredHeure] = useState(getCurrentHourRange());
  useEffect(() => {
    const fetchCours = async () => {
      try {
        const res = await fetch("/api/cours");
        const data = await res.json();
        console.log(data);
        
        setData(data);

      } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
      }
    };
    fetchCours();
  }, []);

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

  useEffect(() => {
    if (!data) {
      console.error("Aucune donnée de cours disponible");
      return;
    }
    const rows = prepareAbsenceDataParJour(data, dayName);
    setAllRows(rows);
    console.log("All rows prepared:", allRows);
  }, [data]);

  const filteredRows = allRows.filter((row) => {
    const matchClasse = filteredClasse ? row.classe === filteredClasse : true;
    const matchHeure = filteredHeure ? row.Heure === filteredHeure : true;
    return matchClasse && matchHeure;
  });

  const paginationModel = { page: 0, pageSize: 5 };

  const classesDisponibles = Array.from(
    new Set(allRows.map((row) => row.classe))
  );

  const handleOpenModal = async (Prof: Prof) => {
    setSelectedTeacher(Prof);
    try {
      const response = await fetch(`/api/absences/${Prof.id}`);
      if (response.ok) {
        const etudiantSelect = await response.json();
        etudiantSelect.absence.map((abs: { date_absence: string | number | Date; })=>{
        
          const date = new Date(abs.date_absence) ;
         
          
        })
        
      }
    } catch (error) {
      alert("pgf");
    }
  };

  const handleEnregistrer = async () => {
    const enseignantsSelectionnes = allRows.filter((row) =>
      selectedRows.includes(row.id)
    );
    const abs = filteredRows.filter(
      (et) => !enseignantsSelectionnes.some((sel) => sel.id === et.id)
    );
    abs.map( async (a) => {
      console.log(a.id);
      const payload = {
        id_etudiant:a.id, 
        id_cours:a.idCours, 
        date:new Date().getDay(), 
        justification:"cvv"
      };
      try {
        const response = await fetch("/api/absences/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert("ok")
          console.log(response.json());
          
        }
      } catch (error) {
        alert("pgf");
      }
    });
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "Nom", width: 130 },
    { field: "lastName", headerName: "Prenom", width: 130 },
    { field: "Heure", headerName: "Heure", width: 130 },
    { field: "classe", headerName: "Classe", width: 130 },
    { field: "module", headerName: "module", width: 130 },
    {
      field: "action",
      headerName: "Action",
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

  const heuresDisponibles = Array.from(
    new Set(allRows.map((row) => row.Heure))
  );

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
          value={filteredClasse}
          onChange={(e) => setFilteredClasse(e.target.value)}
          className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm"
        >
          <option value="">Filtrer par Classe</option>
          {classesDisponibles.map((classe) => (
            <option key={classe} value={classe}>
              {classe}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setFilteredHeure(e.target.value)}
          value={filteredHeure}
          className="flex-1 min-w-[200px] p-3 border rounded-lg text-sm"
        >
          <option value="">Filtrer par heures</option>
          {heuresDisponibles.map((heure) => (
            <option key={heure} value={heure}>
              {heure}
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
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => {
            // Extraire les IDs de l'objet `newSelection` et les convertir en tableau
            const selectedIds = Array.from((newSelection as any).ids || []);
            setSelectedRows(selectedIds as number[]);
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
                src="/img/man2.jpg"
                alt="Profile"
                className="object-cover w-[120px] h-[120px] rounded-full border"
              />
              <h2 className="text-lg font-bold mt-2">
                {selectedTeacher.firstName} {selectedTeacher.lastName}
              </h2>
              <p className="text-gray-500 text-sm">
                Classe: {selectedTeacher.classe_id}
              </p>
              <p className="text-green-500 text-sm font-bold">
                Justification: {selectedTeacher.justifier}
              </p>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-md font-semibold mb-4">
                Liste des Absences :
              </h3>
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
