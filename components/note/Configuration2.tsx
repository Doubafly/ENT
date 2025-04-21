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
  const [loading, setLoading] = useState({
    main: true,
    sessions: true,
  });
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState<
    "selectModule" | "configureModule" | "createCours"
  >("selectModule");

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedFiliereModule, setSelectedFiliereModule] =
    useState<FiliereModule | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedEnseignant, setSelectedEnseignant] =
    useState<Enseignant | null>(null);
  const [semestre, setSemestre] = useState<"Semestre1" | "Semestre2">(
    "Semestre1"
  );
  const [moduleConfig, setModuleConfig] = useState({
    coefficient: 1,
    volume_horaire: 30,
    code_module: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading({ main: true, sessions: true });
        setError("");

        if (!filiereId) {
          throw new Error("Aucune filière sélectionnée");
        }

        const [filiereResponse, sessionsResponse] = await Promise.all([
          fetch(`/api/filieres/${filiereId}/modules`),
          fetch("/api/sessions"),
        ]);

        if (!filiereResponse.ok) {
          throw new Error("Erreur de chargement des données de la filière");
        }
        if (!sessionsResponse.ok) {
          throw new Error("Erreur de chargement des sessions");
        }

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

    if (filiereId) {
      fetchData();
    }
  }, [filiereId]);

  const handleSelectModule = (module: Module | null) => {
    setSelectedModule(module);
    if (!module) {
      setSelectedFiliereModule(null);
      return;
    }

    // Vérifier si le module est déjà associé à la filière
    const existingFiliereModule = data?.modules.find(
      (fm) => fm.module.id_module === module.id_module
    );

    if (existingFiliereModule) {
      setSelectedFiliereModule(existingFiliereModule);
      setStep("createCours");
    } else {
      setSelectedFiliereModule(null);
      setModuleConfig({
        coefficient: 1,
        volume_horaire: 30,
        code_module: `MOD-${module.id_module.toString().padStart(3, "0")}`,
      });
      setStep("configureModule");
    }
  };

  const handleCreateFiliereModule = async () => {
    if (!selectedModule || !filiereId) {
      setError("Module ou filière non sélectionné");
      return;
    }

    try {
      const response = await fetch("/api/filiereModule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_module: selectedModule.id_module,
          id_filiere: filiereId,
          volume_horaire: moduleConfig.volume_horaire,
          code_module: moduleConfig.code_module,
          coefficient: moduleConfig.coefficient,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la création de l'association"
        );
      }

      const { data: newFiliereModule } = await response.json();

      // Mettre à jour les données locales
      if (data) {
        const updatedModules = [
          ...data.modules,
          {
            ...newFiliereModule,
            module: selectedModule,
            cours: [],
          },
        ];

        setData({
          ...data,
          modules: updatedModules,
        });

        setSelectedFiliereModule({
          ...newFiliereModule,
          module: selectedModule,
          cours: [],
        });

        setStep("createCours");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création"
      );
    }
  };

  const handleCreateCours = async () => {
    if (!selectedFiliereModule || !selectedSession || !selectedEnseignant) {
      setError("Veuillez sélectionner une session et un enseignant");
      return;
    }

    try {
      const response = await fetch("/api/cours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_filiere_module: selectedFiliereModule.id_filiere_module,
          id_professeur: selectedEnseignant.id,
          id_sessions: selectedSession.id_sessions,
          semestre,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la création du cours"
        );
      }

      const newCours = await response.json();

      // Mise à jour optimiste des données locales
      if (data) {
        const updatedModules = data.modules.map((m) => {
          if (m.id_filiere_module === selectedFiliereModule.id_filiere_module) {
            const cours = m.cours || [];
            return {
              ...m,
              cours: [
                ...cours,
                {
                  ...newCours,
                  sessions: selectedSession,
                  enseignant: selectedEnseignant,
                },
              ],
            };
          }
          return m;
        });

        setData({
          ...data,
          modules: updatedModules,
        });
      }

      // Réinitialiser le formulaire
      setShowForm(false);
      setStep("selectModule");
      setSelectedModule(null);
      setSelectedFiliereModule(null);
      setSelectedSession(null);
      setSelectedEnseignant(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création"
      );
    }
  };

  const handleDeleteCours = async (id: number, idfm: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return;

    try {
      const response = await fetch(`/api/cours/${id}`, { method: "DELETE" });
      const reponse2 = await fetch(`/api/filiereModule/${idfm}`, {
        method: "DELETE",
      });
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
        <Alert severity="warning">Aucune donnée disponible</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Gestion des Cours - {data.filiere.nom}
      </Typography>

      <Box mb={3}>
        <Button
          variant="contained"
          startIcon={showForm ? <ExpandLess /> : <Add />}
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setStep("selectModule");
              setSelectedModule(null);
              setSelectedFiliereModule(null);
            }
          }}
          sx={{ mb: 2 }}
        >
          {showForm ? "Masquer le formulaire" : "Créer un nouveau cours"}
        </Button>

        <Collapse in={showForm}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nouveau cours - Étape{" "}
              {step === "selectModule" ? 1 : step === "configureModule" ? 2 : 3}{" "}
              sur 3
            </Typography>

            {step === "selectModule" && (
              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  options={data.allModules || []}
                  getOptionLabel={(option) => option.nom}
                  value={selectedModule}
                  onChange={(_, newValue) => handleSelectModule(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Module" required />
                  )}
                  fullWidth
                />
                <Box
                  sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    disabled={!selectedModule}
                    onClick={() => {
                      if (selectedFiliereModule) {
                        setStep("createCours");
                      } else {
                        setStep("configureModule");
                      }
                    }}
                  >
                    Suivant
                  </Button>
                </Box>
              </Box>
            )}

            {step === "configureModule" && selectedModule && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Configuration du module {selectedModule.nom} pour la filière{" "}
                  {data.filiere.nom}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    label="Code module"
                    value={moduleConfig.code_module}
                    onChange={(e) =>
                      setModuleConfig({
                        ...moduleConfig,
                        code_module: e.target.value,
                      })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    label="Coefficient"
                    type="number"
                    value={moduleConfig.coefficient}
                    onChange={(e) =>
                      setModuleConfig({
                        ...moduleConfig,
                        coefficient: parseInt(e.target.value) || 1,
                      })
                    }
                    fullWidth
                    required
                  />
                </Box>

                <TextField
                  label="Volume horaire (heures)"
                  type="number"
                  value={moduleConfig.volume_horaire}
                  onChange={(e) =>
                    setModuleConfig({
                      ...moduleConfig,
                      volume_horaire: parseInt(e.target.value) || 30,
                    })
                  }
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setStep("selectModule")}
                  >
                    Retour
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCreateFiliereModule}
                  >
                    Associer le module et continuer
                  </Button>
                </Box>
              </Box>
            )}

            {step === "createCours" && selectedFiliereModule && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Création du cours pour le module{" "}
                  {selectedFiliereModule.module.nom}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                  <Autocomplete
                    options={sessions}
                    getOptionLabel={(option) => option.annee_academique}
                    value={selectedSession}
                    onChange={(_, newValue) => setSelectedSession(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Session académique"
                        required
                      />
                    )}
                    fullWidth
                    loading={loading.sessions}
                  />

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
                    getOptionLabel={(option) =>
                      `${option.nom} ${option.prenom}`
                    }
                    value={selectedEnseignant}
                    onChange={(_, newValue) => setSelectedEnseignant(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Enseignant" required />
                    )}
                    fullWidth
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setStep(
                        selectedFiliereModule
                          ? "selectModule"
                          : "configureModule"
                      )
                    }
                  >
                    Retour
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCreateCours}
                    disabled={!selectedSession || !selectedEnseignant}
                  >
                    Créer le cours
                  </Button>
                </Box>
              </Box>
            )}
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
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDeleteCours(
                            cours.id_cours,
                            module.id_filiere_module
                          )
                        }
                      >
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
