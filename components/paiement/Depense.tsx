"use client";
import { Box, MenuItem, Select, TextField, CircularProgress, Alert, Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Decimal } from "@prisma/client/runtime/library";
import { Delete, Edit } from "@mui/icons-material";

interface Depense {
  id_finance: number;
  date_transaction: string;
  montant: Decimal | number;
  type_transaction: string;
  statut: string;
  description: string;
  mode_paiement: string;
  utilisateur?: {
    nom: string;
    prenom: string;
  };
}

type FinanceModePaiement = 'Espèces' | 'Chèque' | 'Virement' | 'Carte Bancaire';

const paymentModes: FinanceModePaiement[] = ['Espèces', 'Chèque', 'Virement', 'Carte Bancaire'];

const SESSION_API_URL = "/api/auth/session";

export default function Depense() {
  // États pour les données
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [montant, setMontant] = useState<string>("");
  const [modePaiement, setModePaiement] = useState<FinanceModePaiement>("Virement");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState({
    initial: true,
    envoi: false,
    session: true,
    suppression: false
  });
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<number | null>(null);

  // Vérification de la session
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch(SESSION_API_URL, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Erreur de session");

        const { user } = await response.json();
        if (user?.id_utilisateur) {
          setCurrentUserId(user.id_utilisateur);
        }
      } catch (err) {
        console.error("Erreur vérification session:", err);
        setError("Vous devez être connecté pour gérer les dépenses");
      } finally {
        setLoading(prev => ({...prev, session: false}));
      }
    };

    checkUserSession();
  }, []);

  // Récupérer les dépenses
  useEffect(() => {
    if (loading.session) return;

    const fetchDepenses = async () => {
      setError(null);
      try {
        const response = await fetch('/api/finance?type_transaction=Dépense');
        if (!response.ok) throw new Error("Erreur de chargement des dépenses");

        const data = await response.json();
        setDepenses(data.finances || []);
      } catch (err) {
        console.error("Erreur:", err);
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(prev => ({...prev, initial: false}));
      }
    };

    fetchDepenses();
  }, [loading.session]);

  // Gestion des dépenses
  const handleSubmit = async () => {
    if (!montant) {
      setError("Veuillez entrer un montant");
      return;
    }

    setLoading(prev => ({...prev, envoi: true}));
    setError(null);
    
    try {
      const montantNumber = parseFloat(montant);
      if (isNaN(montantNumber)) throw new Error("Montant invalide");

      const endpoint = editMode ? `/api/finance/${editMode}` : '/api/finance';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          type_transaction: "Depense",
          montant: montantNumber,
          description: description || "Dépense diverses",
          mode_paiement: modePaiement,
          id_utilisateur: currentUserId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur serveur");
      }

      const result = await response.json();
      
      if (editMode) {
        setDepenses(prev => prev.map(d => 
          d.id_finance === editMode ? result.transaction : d
        ));
        setEditMode(null);
      } else {
        setDepenses(prev => [result.transaction, ...prev]);
      }

      setMontant("");
      setDescription("");
    } catch (err) {
      console.error("Erreur:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de l'opération");
    } finally {
      setLoading(prev => ({...prev, envoi: false}));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette dépense ?")) return;
    
    setLoading(prev => ({...prev, suppression: true}));
    setError(null);
    
    try {
      const response = await fetch(`/api/finance/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur serveur");
      }

      setDepenses(prev => prev.filter(d => d.id_finance !== id));
    } catch (err) {
      console.error("Erreur suppression:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setLoading(prev => ({...prev, suppression: false}));
    }
  };

  const handleEdit = (depense: Depense) => {
    setEditMode(depense.id_finance);
    setMontant(Number(depense.montant).toString());
    setModePaiement(depense.mode_paiement as FinanceModePaiement);
    setDescription(depense.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading.session || (loading.initial && !error)) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="container mx-auto p-4">
        <Alert severity="error">
          Vous devez être connecté pour accéder à cette fonctionnalité
        </Alert>
      </div>
    );
  }

  // Calcul du total des dépenses
  const totalDepenses = depenses.reduce(
    (sum, depense) => sum + Number(depense.montant), 0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des Dépenses</h1>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Formulaire */}
      <Box display="flex" flexDirection="column" gap={3} mb={6}>
        <h2 className="text-xl font-semibold">
          {editMode ? "Modifier une dépense" : "Ajouter une dépense"}
        </h2>
        
        <Box display="flex" gap={2}>
          <Select
            value={modePaiement}
            onChange={(e) => setModePaiement(e.target.value as FinanceModePaiement)}
            fullWidth
          >
            {paymentModes.map((mode) => (
              <MenuItem key={mode} value={mode}>
                {mode}
              </MenuItem>
            ))}
          </Select>

          <TextField
            type="number"
            label="Montant (FCFA)"
            variant="outlined"
            fullWidth
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            InputProps={{
              inputProps: { min: 0, step: 100 }
            }}
          />
        </Box>

        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Détails de la dépense..."
        />

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!montant || loading.envoi}
            sx={{ flex: 1 }}
          >
            {loading.envoi ? (
              <CircularProgress size={24} color="inherit" />
            ) : editMode ? (
              "Mettre à jour"
            ) : (
              "Enregistrer"
            )}
          </Button>

          {editMode && (
            <Button
              variant="outlined"
              onClick={() => {
                setEditMode(null);
                setMontant("");
                setDescription("");
              }}
              sx={{ flex: 1 }}
            >
              Annuler
            </Button>
          )}
        </Box>
      </Box>

      {/* Résumé */}
      <Box mb={4} p={3} bgcolor="#f5f5f5" borderRadius={2}>
        <h2 className="text-xl font-semibold mb-2">Résumé des Dépenses</h2>
        <Box display="flex" justifyContent="space-between">
          <div>
            <span className="font-medium">Total des dépenses: </span>
            <span className="text-lg font-bold">{totalDepenses.toLocaleString()} FCFA</span>
          </div>
          <div>
            <span className="font-medium">Nombre de dépenses: </span>
            <span className="text-lg font-bold">{depenses.length}</span>
          </div>
        </Box>
      </Box>

      {/* Historique */}
      <Box>
        <h2 className="text-xl font-semibold mb-3">Historique des Dépenses</h2>
        
        {depenses.length === 0 ? (
          <Alert severity="info">Aucune dépense enregistrée</Alert>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">Montant</th>
                  <th className="border p-2 text-left">Mode</th>
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-left">Statut</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {depenses.map((depense) => (
                  <tr key={depense.id_finance}>
                    <td className="border p-2">
                      {new Date(depense.date_transaction).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="border p-2 font-medium">
                      {Number(depense.montant).toLocaleString()} FCFA
                    </td>
                    <td className="border p-2">{depense.mode_paiement}</td>
                    <td className="border p-2">{depense.description}</td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded ${
                        depense.statut === 'Validé' ? 'bg-green-100 text-green-800' :
                        depense.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {depense.statut}
                      </span>
                    </td>
                    <td className="border p-2">
                      <Box display="flex" gap={1}>
                        {/* Edit paiement 
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(depense)}
                          color="primary"
                          disabled={loading.suppression}
                        >
                          <Edit fontSize="small" />
                        </IconButton> */}
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(depense.id_finance)}
                          color="error"
                          disabled={loading.suppression}
                        >
                          {loading.suppression ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Delete fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Box>
    </div>
  );
}