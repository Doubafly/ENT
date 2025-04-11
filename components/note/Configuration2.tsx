import { Add, Delete, Edit, ExpandLess } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
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

interface FiliereModule {
  id_filiere_module: number;
  module: Module;
  coefficient: number;
  volume_horaire?: number;
  code_module: string;
  enseignants: Enseignant[];
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

interface ConfigurationProps {
  filiereId: number;
}

const Configuration = ({ filiereId }: ConfigurationProps) => {
  // États pour la gestion des données
  const [data, setData] = useState<FiliereData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // États pour le formulaire
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [selectedEnseignants, setSelectedEnseignants] = useState<Enseignant[]>(
    []
  );
  const [coefficient, setCoefficient] = useState(1);
  const [volumeHoraire, setVolumeHoraire] = useState<number | undefined>();
  const [codeModule, setCodeModule] = useState("");

  // États pour l'édition
  const [editOpen, setEditOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<FiliereModule | null>(null);

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/filieres/${filiereId}/modules`);

        if (!response.ok) {
          throw new Error("Erreur de chargement des données");
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filiereId]);

  // Gestion de l'ajout d'un module
  const handleAddModule = async () => {
    if (!moduleName || !data) return;

    try {
      const response = await fetch(`/api/filieres/${filiereId}/modules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: moduleName,
          description: moduleDescription,
          coefficient,
          volume_horaire: volumeHoraire,
          code_module: codeModule,
          enseignants: selectedEnseignants.map((e) => e.id),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du module");
      }

      const result = await response.json();

      // Mise à jour de l'état local
      setData((prev) =>
        prev
          ? {
              ...prev,
              modules: [...prev.modules, result.data],
              enseignants: [
                ...new Set([...prev.enseignants, ...selectedEnseignants]),
              ],
            }
          : null
      );

      // Réinitialisation du formulaire
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setModuleName("");
    setModuleDescription("");
    setSelectedEnseignants([]);
    setCoefficient(1);
    setVolumeHoraire(undefined);
    setCodeModule("");
  };

  // Gestion de l'édition d'un module
  const handleEditModule = async () => {
    if (!currentEdit || !data) return;

    try {
      const response = await fetch(
        `/api/filieres/${filiereId}/modules/${currentEdit.id_filiere_module}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coefficient,
            volume_horaire: volumeHoraire,
            code_module: codeModule,
            enseignants: selectedEnseignants.map((e) => e.id),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la modification");
      }

      const result = await response.json();

      // Mise à jour de l'état local
      setData((prev) =>
        prev
          ? {
              ...prev,
              modules: prev.modules.map((m) =>
                m.id_filiere_module === currentEdit.id_filiere_module
                  ? result.data
                  : m
              ),
            }
          : null
      );

      setEditOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la modification"
      );
    }
  };

  // Gestion de la suppression d'un module
  const handleDeleteModule = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce module ?")) return;

    try {
      const response = await fetch(`/api/filieres/${filiereId}/modules/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // Mise à jour de l'état local
      setData((prev) =>
        prev
          ? {
              ...prev,
              modules: prev.modules.filter((m) => m.id_filiere_module !== id),
            }
          : null
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  // Ouvrir la modale d'édition
  const openEditModal = (module: FiliereModule) => {
    setCurrentEdit(module);
    setModuleName(module.module.nom);
    setModuleDescription(module.module.description || "");
    setCoefficient(module.coefficient);
    setVolumeHoraire(module.volume_horaire || undefined);
    setCodeModule(module.code_module);
    setSelectedEnseignants(module.enseignants);
    setEditOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
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
        Configuration des Modules - {data.filiere.nom}
      </Typography>

      {/* Bouton pour afficher/masquer le formulaire */}
      <Box mb={3}>
        <Button
          variant="contained"
          startIcon={showForm ? <ExpandLess /> : <Add />}
          onClick={() => setShowForm(!showForm)}
          sx={{ mb: 2 }}
        >
          {showForm ? "Masquer le formulaire" : "Ajouter une matière"}
        </Button>

        {/* Formulaire d'ajout */}
        <Collapse in={showForm}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nouvelle matière
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <TextField
                label="Nom du module"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Description"
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <TextField
                label="Code Module"
                value={codeModule}
                onChange={(e) => setCodeModule(e.target.value)}
                required
              />

              <TextField
                label="Coefficient"
                type="number"
                value={coefficient}
                onChange={(e) => setCoefficient(Number(e.target.value))}
                inputProps={{ min: 1 }}
                required
              />

              <TextField
                label="Volume Horaire"
                type="number"
                value={volumeHoraire || ""}
                onChange={(e) =>
                  setVolumeHoraire(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                inputProps={{ min: 1 }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Enseignants responsables
              </Typography>
              <Autocomplete
                multiple
                options={data.enseignants}
                getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
                value={selectedEnseignants}
                onChange={(_, newValue) => setSelectedEnseignants(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sélectionner les enseignants"
                    placeholder="Enseignants"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={`${option.nom} ${option.prenom}`}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleAddModule}
                disabled={!moduleName || !codeModule}
              >
                Enregistrer
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Annuler
              </Button>
            </Box>
          </Paper>
        </Collapse>
      </Box>

      {/* Liste des modules */}
      <Typography variant="h6" gutterBottom>
        Matières configurées ({data.modules.length})
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Matière</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Coefficient</TableCell>
              <TableCell>Volume Horaire</TableCell>
              <TableCell>Enseignants</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.modules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    Pas encore de matière pour cette classe
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.modules.map((module) => (
                <TableRow key={module.id_filiere_module}>
                  <TableCell>{module.module.nom}</TableCell>
                  <TableCell>{module.code_module}</TableCell>
                  <TableCell>{module.coefficient}</TableCell>
                  <TableCell>{module.volume_horaire || "-"}</TableCell>
                  <TableCell>
                    {(module.enseignants || []).map((enseignant) => (
                      <Chip
                        key={enseignant.id}
                        label={`${enseignant.nom} ${enseignant.prenom}`}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => openEditModal(module)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDeleteModule(module.id_filiere_module)
                      }
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modale d'édition */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Modifier la matière</DialogTitle>
        <DialogContent>
          {currentEdit && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {currentEdit.module.nom}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  label="Code Module"
                  value={codeModule}
                  onChange={(e) => setCodeModule(e.target.value)}
                  fullWidth
                  required
                />

                <TextField
                  label="Coefficient"
                  type="number"
                  value={coefficient}
                  onChange={(e) => setCoefficient(Number(e.target.value))}
                  inputProps={{ min: 1 }}
                  required
                />

                <TextField
                  label="Volume Horaire"
                  type="number"
                  value={volumeHoraire || ""}
                  onChange={(e) =>
                    setVolumeHoraire(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  inputProps={{ min: 1 }}
                />
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Enseignants responsables
              </Typography>
              <Autocomplete
                multiple
                options={data.enseignants}
                getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
                value={selectedEnseignants}
                onChange={(_, newValue) => setSelectedEnseignants(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sélectionner les enseignants"
                    placeholder="Enseignants"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      label={`${option.nom} ${option.prenom}`}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleEditModule}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Configuration;
