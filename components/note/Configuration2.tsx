import { Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  description?: string;
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
  code_module?: string;
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
  allModules: Module[];
}

export default function Configuration({
  filiereId,
}: {
  filiereId: number | null;
}) {
  const [data, setData] = useState<FiliereData | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState({
    main: true,
    sessions: true,
    modules: true,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading({ main: true, sessions: true, modules: true });
        setError("");

        if (!filiereId) {
          throw new Error("Aucune filière sélectionnée");
        }

        const [filiereResponse, sessionsResponse, modulesResponse] =
          await Promise.all([
            fetch(`/api/filieres/${filiereId}/modules`),
            fetch("/api/sessions"),
            fetch("/api/modules"),
          ]);

        if (!filiereResponse.ok) {
          throw new Error("Erreur de chargement des données de la filière");
        }
        if (!sessionsResponse.ok) {
          throw new Error("Erreur de chargement des sessions");
        }
        if (!modulesResponse.ok) {
          throw new Error("Erreur de chargement des modules");
        }

        const [filiereData, sessionsData, modulesData] = await Promise.all([
          filiereResponse.json(),
          sessionsResponse.json(),
          modulesResponse.json(),
        ]);

        setData(filiereData.data);
        setSessions(sessionsData.data || []);
        setAllModules(modulesData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        console.error("Fetch error:", err);
      } finally {
        setLoading({ main: false, sessions: false, modules: false });
      }
    };

    if (filiereId) {
      fetchData();
    }
  }, [filiereId]);

  if (loading.main) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={2}>
        <Alert severity="warning">
          Aucune donnée disponible pour cette filière
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Mes matières enseignés - {data.filiere.nom}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Liste des cours programmés
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Module</TableCell>
              <TableCell>Code</TableCell>
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
                    <TableCell>{module.code_module}</TableCell>
                    <TableCell>{cours.sessions.annee_academique}</TableCell>
                    <TableCell>{cours.semestre}</TableCell>
                    <TableCell>
                      {cours.enseignant.nom} {cours.enseignant.prenom}
                    </TableCell>
                    <TableCell>
                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )) || []
            )}

            {data.modules.every((m) => !m.cours || m.cours.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    Aucun cours programmé pour cette filière
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
