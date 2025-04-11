import { Add, Delete, ExpandLess } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Enseignant {
  id: number;
  nom: string;
  prenom: string;
  specialite: string;
}

interface Module {
  id_module: number;
  nom: string;
}

interface Session {
  id_sessions: number;
  annee_academique: string;
}

interface Cours {
  id_cours: number;
  semestre: "Semestre1" | "Semestre2";
  sessions: Session;
  enseignant: Enseignant;
}

interface FiliereModule {
  id_filiere_module: number;
  module: Module;
  coefficient: number;
  volume_horaire?: number;
  code_module: string;
  enseignants: Enseignant[];
  cours?: Cours[];
}

interface FiliereData {
  filiere: {
    id: number;
    nom: string;
    niveau: string;
  };
  modules: FiliereModule[];
  enseignants: Enseignant[];
}

export default function Configuration({ filiereId }: { filiereId: number }) {
  const [data, setData] = useState<FiliereData | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState({
    main: true,
    sessions: true,
  });
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [selectedModule, setSelectedModule] = useState<FiliereModule | null>(
    null
  );
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedEnseignant, setSelectedEnseignant] =
    useState<Enseignant | null>(null);
  const [semestre, setSemestre] = useState<"Semestre1" | "Semestre2">(
    "Semestre1"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading({ main: true, sessions: true });

        const [filiereResponse, sessionsResponse] = await Promise.all([
          fetch(`/api/filieres/${filiereId}/modules`),
          fetch("/api/sessions"),
        ]);

        if (!filiereResponse.ok)
          throw new Error("Erreur de chargement des données de la filière");
        if (!sessionsResponse.ok)
          throw new Error("Erreur de chargement des sessions");

        const [filiereData, sessionsData] = await Promise.all([
          filiereResponse.json(),
          sessionsResponse.json(),
        ]);

        setData(filiereData.data);
        setSessions(sessionsData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading({ main: false, sessions: false });
      }
    };

    fetchData();
  }, [filiereId]);

  const handleCreateCours = async () => {
    if (!selectedModule || !selectedSession || !selectedEnseignant) {
      setError("Veuillez sélectionner un module, une session et un enseignant");
      return;
    }

    try {
      const response = await fetch("/api/cours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_filiere_module: selectedModule.id_filiere_module,
          id_professeur: selectedEnseignant.id,
          id_sessions: selectedSession.id_sessions,
          semestre,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la création du cours");

      // Rechargement des données
      const filiereResponse = await fetch(`/api/filieres/${filiereId}/modules`);
      const filiereData = await filiereResponse.json();
      setData(filiereData.data);

      // Réinitialisation
      setShowForm(false);
      setSelectedModule(null);
      setSelectedSession(null);
      setSelectedEnseignant(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création"
      );
    }
  };

  const handleDeleteCours = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return;

    try {
      const response = await fetch(`/api/cours/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erreur lors de la suppression");

      // Mise à jour optimisée
      setData((prev) =>
        prev
          ? {
              ...prev,
              modules: prev.modules.map((m) => ({
                ...m,
                cours: m.cours?.filter((c) => c.id_cours !== id),
              })),
            }
          : null
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  if (loading.main)
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box p={2}>
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Box>
    );
  if (!data)
    return (
      <Box p={2}>
        <Alert severity="warning">Aucune donnée disponible</Alert>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Gestion des Cours - {data.filiere.nom}
      </Typography>

      <Box mb={3}>
        <Button
          variant="contained"
          startIcon={showForm ? <ExpandLess /> : <Add />}
          onClick={() => setShowForm(!showForm)}
          sx={{ mb: 2 }}
        >
          {showForm ? "Masquer le formulaire" : "Créer un nouveau cours"}
        </Button>

        <Collapse in={showForm}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nouveau cours
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <Autocomplete
                options={data.modules}
                getOptionLabel={(option) =>
                  `${option.module.nom} (${option.code_module})`
                }
                value={selectedModule}
                onChange={(_, newValue) => setSelectedModule(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Module" required />
                )}
                fullWidth
              />

              <Autocomplete
                options={sessions}
                getOptionLabel={(option) => option.annee_academique}
                value={selectedSession}
                onChange={(_, newValue) => setSelectedSession(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Session académique" required />
                )}
                fullWidth
                loading={loading.sessions}
              />
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <Select
                value={semestre}
                onChange={(e) =>
                  setSemestre(e.target.value as "Semestre1" | "Semestre2")
                }
                fullWidth
              >
                <MenuItem value="Semestre1">Semestre 1</MenuItem>
                <MenuItem value="Semestre2">Semestre 2</MenuItem>
              </Select>

              <Autocomplete
                options={data.enseignants}
                getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
                value={selectedEnseignant}
                onChange={(_, newValue) => setSelectedEnseignant(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Enseignant" required />
                )}
                fullWidth
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleCreateCours}
                disabled={
                  !selectedModule || !selectedSession || !selectedEnseignant
                }
              >
                Créer
              </Button>
              <Button variant="outlined" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
            </Box>
          </Paper>
        </Collapse>
      </Box>

      <Typography variant="h6" gutterBottom>
        Liste des cours
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Module</TableCell>
              <TableCell>Session</TableCell>
              <TableCell>Semestre</TableCell>
              <TableCell>Enseignant</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.modules.flatMap(
              (module) =>
                module.cours?.map((cours) => (
                  <TableRow key={cours.id_cours}>
                    <TableCell>{module.module.nom}</TableCell>
                    <TableCell>{cours.sessions.annee_academique}</TableCell>
                    <TableCell>{cours.semestre}</TableCell>
                    <TableCell>
                      {cours.enseignant.nom} {cours.enseignant.prenom}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteCours(cours.id_cours)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )) || []
            )}

            {data.modules.every((m) => !m.cours || m.cours.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    Aucun cours programmé
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
