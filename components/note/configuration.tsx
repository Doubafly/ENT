import { Add, Delete, Edit, ExpandLess } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  semestre: string;
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
  const [semestre, setSemestre] = useState<string>("Semestre1");
  const [moduleConfig, setModuleConfig] = useState({
    coefficient: 1,
    volume_horaire: 30,
    code_module: "",
  });

  const [editingCours, setEditingCours] = useState<Cours | null>(null);
  const [editingFiliereModule, setEditingFiliereModule] =
    useState<FiliereModule | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id_filiere_module: number;
    id_cours?: number;
  } | null>(null);

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

  const handleEdit = (filiereModule: FiliereModule, cours?: Cours) => {
    setShowForm(true);
    setSelectedModule(filiereModule.module);

    if (cours) {
      setSelectedFiliereModule(filiereModule);
      setSelectedSession(cours.sessions);
      setSelectedEnseignant(cours.enseignant);
      setSemestre(cours.semestre);
      setEditingCours(cours);
      setStep("createCours");
    } else {
      setSelectedFiliereModule(filiereModule);
      setModuleConfig({
        coefficient: filiereModule.coefficient,
        volume_horaire: filiereModule.volume_horaire || 30,
        code_module: filiereModule.code_module || "",
      });
      setEditingFiliereModule(filiereModule);
      setStep("configureModule");
    }
  };

  const handleDelete = (id_filiere_module: number, id_cours?: number) => {
    setItemToDelete({ id_filiere_module, id_cours });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      // Suppression du cours si spécifié, sinon suppression du module et de ses cours
      if (itemToDelete.id_cours && itemToDelete.id_filiere_module) {
        await fetch(`/api/cours/${itemToDelete.id_cours}`, {
          method: "DELETE",
        });
        await fetch(`/api/filiereModule/${itemToDelete.id_filiere_module}`, {
          method: "DELETE",
        });
      }

      // Mise à jour de l'état local
      setData((prev) => {
        if (!prev) return null;

        if (itemToDelete.id_cours && itemToDelete.id_filiere_module) {
          // Suppression d'un cours spécifique
          return {
            ...prev,
            modules: prev.modules.filter(
              (m) => m.id_filiere_module !== itemToDelete.id_filiere_module
            ),
          };
        } else {
          // Suppression de tout le module
          return {
            ...prev,
            modules: prev.modules.filter(
              (m) => m.id_filiere_module !== itemToDelete.id_filiere_module
            ),
          };
        }
      });

      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  const handleSelectModule = (module: Module | null) => {
    setSelectedModule(module);
    if (!module) {
      setSelectedFiliereModule(null);
      return;
    }

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
      const method = editingFiliereModule ? "PUT" : "POST";
      const url = editingFiliereModule
        ? `/api/filiereModule/${editingFiliereModule.id_filiere_module}`
        : "/api/filiereModule";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_module: selectedModule.id_module,
          id_filiere: filiereId,
          volume_horaire: moduleConfig.volume_horaire,
          code_module: moduleConfig.code_module,
          coefficient: moduleConfig.coefficient,
          ...(editingFiliereModule && {
            id_filiere_module: editingFiliereModule.id_filiere_module,
          }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Erreur lors de la création/mise à jour de l'association"
        );
      }

      const { data: updatedFiliereModule } = await response.json();

      if (data) {
        const updatedModules = editingFiliereModule
          ? data.modules.map((m) =>
              m.id_filiere_module === editingFiliereModule.id_filiere_module
                ? {
                    ...updatedFiliereModule,
                    module: selectedModule,
                    cours: m.cours,
                  }
                : m
            )
          : [
              ...data.modules,
              { ...updatedFiliereModule, module: selectedModule, cours: [] },
            ];

        setData({
          ...data,
          modules: updatedModules,
        });

        setSelectedFiliereModule({
          ...updatedFiliereModule,
          module: selectedModule,
          cours: editingFiliereModule ? selectedFiliereModule?.cours : [],
        });

        setStep("createCours");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création/mise à jour"
      );
    }
  };

  const handleCreateCours = async () => {
    if (!selectedFiliereModule || !selectedSession || !selectedEnseignant) {
      setError("Veuillez sélectionner une session et un enseignant");
      return;
    }

    try {
      const method = editingCours ? "PUT" : "POST";
      const url = editingCours
        ? `/api/cours/${editingCours.id_cours}`
        : "/api/cours";

      const response = await fetch(url, {
        method,
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
          errorData.message || "Erreur lors de la création/mise à jour du cours"
        );
      }

      const updatedCours = await response.json();

      if (data) {
        const updatedModules = data.modules.map((m) => {
          if (m.id_filiere_module === selectedFiliereModule.id_filiere_module) {
            const cours = m.cours || [];

            if (editingCours) {
              return {
                ...m,
                cours: cours.map((c) =>
                  c.id_cours === editingCours.id_cours
                    ? {
                        ...updatedCours,
                        sessions: selectedSession,
                        enseignant: selectedEnseignant,
                      }
                    : c
                ),
              };
            } else {
              return {
                ...m,
                cours: [
                  ...cours,
                  {
                    ...updatedCours,
                    sessions: selectedSession,
                    enseignant: selectedEnseignant,
                  },
                ],
              };
            }
          }
          return m;
        });

        setData({
          ...data,
          modules: updatedModules,
        });
      }

      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création/mise à jour"
      );
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setStep("selectModule");
    setSelectedModule(null);
    setSelectedFiliereModule(null);
    setSelectedSession(null);
    setSelectedEnseignant(null);
    setEditingCours(null);
    setEditingFiliereModule(null);
    setModuleConfig({
      coefficient: 1,
      volume_horaire: 30,
      code_module: "",
    });
  };

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (loading.main) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
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
            resetForm();
            setShowForm(!showForm);
          }}
          sx={{ mb: 2 }}
        >
          {showForm ? "Masquer le formulaire" : "Créer un nouveau cours"}
        </Button>

        <Collapse in={showForm}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {editingCours
                ? "Modifier un cours"
                : editingFiliereModule
                ? "Modifier un module"
                : "Nouveau cours"}{" "}
              - Étape{" "}
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
                  {editingFiliereModule ? "Modification" : "Configuration"} du
                  module {selectedModule.nom} pour la filière {data.filiere.nom}
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
                    onClick={() => {
                      setStep("selectModule");
                      setEditingFiliereModule(null);
                    }}
                  >
                    Retour
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCreateFiliereModule}
                  >
                    {editingFiliereModule
                      ? "Mettre à jour le module"
                      : "Associer le module et continuer"}
                  </Button>
                </Box>
              </Box>
            )}

            {step === "createCours" && selectedFiliereModule && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  {editingCours ? "Modification" : "Création"} du cours pour le
                  module {selectedFiliereModule.module.nom}
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
                    onClick={() => {
                      setStep(
                        selectedFiliereModule
                          ? "selectModule"
                          : "configureModule"
                      );
                      setEditingCours(null);
                    }}
                  >
                    Retour
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCreateCours}
                    disabled={!selectedSession || !selectedEnseignant}
                  >
                    {editingCours ? "Mettre à jour le cours" : "Créer le cours"}
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
              <TableCell>Coefficient</TableCell>
              <TableCell>Volume Horaire</TableCell>
              <TableCell>Session</TableCell>
              <TableCell>Semestre</TableCell>
              <TableCell>Enseignant</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.modules.flatMap((module) =>
              module.cours?.length ? (
                module.cours.map((cours) => (
                  <TableRow key={`cours-${cours.id_cours}`}>
                    <TableCell>{module.module.nom}</TableCell>
                    <TableCell>{module.code_module}</TableCell>
                    <TableCell>{module.coefficient}</TableCell>
                    <TableCell>{module.volume_horaire}</TableCell>
                    <TableCell>{cours.sessions.annee_academique}</TableCell>
                    <TableCell>{cours.semestre}</TableCell>
                    <TableCell>
                      {cours.enseignant.nom} {cours.enseignant.prenom}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(module, cours)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDelete(module.id_filiere_module, cours.id_cours)
                        }
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow key={`module-${module.id_filiere_module}`}>
                  <TableCell>{module.module.nom}</TableCell>
                  <TableCell>{module.code_module}</TableCell>
                  <TableCell>{module.coefficient}</TableCell>
                  <TableCell>{module.volume_horaire}</TableCell>
                  <TableCell colSpan={3}>Aucun cours programmé</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(module)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(module.id_filiere_module)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          {itemToDelete?.id_cours ? (
            <Typography>
              Êtes-vous sûr de vouloir supprimer ce cours ?
            </Typography>
          ) : (
            <Typography>
              Êtes-vous sûr de vouloir supprimer ce module et tous ses cours
              associés ?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
