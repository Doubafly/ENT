"use client";
import { Box, MenuItem, Select, TextField, CircularProgress, Alert } from "@mui/material";
import { useEffect, useState } from "react";

interface Enseignant {
  id: number;
  matricule: string;
  utilisateur: {
    nom: string;
    prenom: string;
  };
  specialite: string;
}

interface Paiement {
  id_finance: number;
  date_transaction: string;
  montant: number;
  type_transaction: string;
  statut: string;
  description: string;
  id_enseignant: number;
  enseignant?: {
    matricule: string;
    utilisateur: {
      nom: string;
      prenom: string;
    };
  };
}

export default function Enseignant() {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("Salaire");
  const [paymentDescription, setPaymentDescription] = useState<string>("");
  const [paymentHistory, setPaymentHistory] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState({
    enseignants: false,
    paiements: false,
    envoi: false
  });
  const [error, setError] = useState<string | null>(null);

  // Récupérer la liste des enseignants et tous les paiements au chargement
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(prev => ({...prev, enseignants: true, paiements: true}));
      setError(null);
      try {
        // Charger les enseignants
        const enseignantsResponse = await fetch('/api/enseignants');
        if (!enseignantsResponse.ok) throw new Error("Erreur de chargement des enseignants");
        const enseignantsData = await enseignantsResponse.json();
        setEnseignants(enseignantsData.enseignants || []);

        // Charger tous les paiements des enseignants
        const paiementsResponse = await fetch('/api/finance?type_transaction=Salaire');
        if (!paiementsResponse.ok) throw new Error("Erreur de chargement des paiements");
        const paiementsData = await paiementsResponse.json();
        setPaymentHistory(paiementsData.finances || []);

      } catch (err) {
        console.error("Erreur initiale:", err);
        setError("Impossible de charger les données initiales");
      } finally {
        setLoading(prev => ({...prev, enseignants: false, paiements: false}));
      }
    };
    fetchInitialData();
  }, []);

  // Filtrer l'historique quand un enseignant est sélectionné
  const filteredPaymentHistory = selectedEnseignant
    ? paymentHistory.filter(p => p.id_enseignant === parseInt(selectedEnseignant))
    : paymentHistory;

  const handlePayment = async () => {
    if (!selectedEnseignant || !paymentAmount) {
      setError("Sélectionnez un enseignant et entrez un montant");
      return;
    }

    setLoading(prev => ({...prev, envoi: true}));
    setError(null);
    try {
      const enseignant = enseignants.find(e => e.id === parseInt(selectedEnseignant));
      if (!enseignant) throw new Error("Enseignant introuvable");

      const montant = parseFloat(paymentAmount);
      if (isNaN(montant)) throw new Error("Montant invalide");

      const description = paymentDescription || 
        `Paiement ${paymentType} pour ${enseignant.utilisateur.nom} ${enseignant.utilisateur.prenom}`;

      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          type_transaction: paymentType,
          montant: montant,
          description: description,
          mode_paiement: "Virement",
          id_utilisateur: 1, // À remplacer par l'ID de l'utilisateur connecté
          id_enseignant: enseignant.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur serveur");
      }

      const newPayment = await response.json();
      setPaymentHistory(prev => [newPayment.transaction, ...prev]);
      setPaymentAmount("");
      setPaymentDescription("");
    } catch (err) {
      console.error("Erreur paiement:", err);
      setError(err instanceof Error ? err.message : "Erreur lors du paiement");
    } finally {
      setLoading(prev => ({...prev, envoi: false}));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Paiements Enseignants</h1>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={3}>
        {/* Sélection de l'enseignant */}
        <Box display="flex" gap={2}>
          <Select
            value={selectedEnseignant}
            onChange={(e) => setSelectedEnseignant(e.target.value)}
            displayEmpty
            fullWidth
            disabled={loading.enseignants}
          >
            <MenuItem value="">Tous les enseignants</MenuItem>
            {enseignants.map((enseignant) => (
              <MenuItem key={enseignant.id} value={enseignant.id.toString()}>
                {enseignant.utilisateur.nom} {enseignant.utilisateur.prenom} - {enseignant.specialite}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Formulaire de paiement (visible seulement si un enseignant est sélectionné) */}
        {selectedEnseignant && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={2}>
              <Select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                fullWidth
              >
                <MenuItem value="Salaire">Salaire</MenuItem>
                <MenuItem value="Prime">Prime</MenuItem>
                <MenuItem value="Remboursement">Remboursement</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
              </Select>

              <TextField
                type="number"
                label="Montant (FCFA)"
                variant="outlined"
                fullWidth
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </Box>

            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={paymentDescription}
              onChange={(e) => setPaymentDescription(e.target.value)}
              placeholder="Détails du paiement..."
            />

            <button
              onClick={handlePayment}
              disabled={!paymentAmount || loading.envoi}
              className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading.envoi ? <CircularProgress size={24} color="inherit" /> : "Enregistrer le paiement"}
            </button>
          </Box>
        )}

        {/* Historique des paiements */}
        <Box mt={4}>
          <h2 className="text-xl font-semibold mb-3">
            Historique des paiements
            {selectedEnseignant && " pour l'enseignant sélectionné"}
          </h2>
          
          {loading.paiements ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : paymentHistory.length === 0 ? (
            <p>Aucun paiement enregistré</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Enseignant</th>
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Montant</th>
                    <th className="border p-2 text-left">Statut</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaymentHistory.map((paiement) => {
                    const enseignant = enseignants.find(e => e.id === paiement.id_enseignant);
                    const nomEnseignant = enseignant 
                      ? `${enseignant.utilisateur.nom} ${enseignant.utilisateur.prenom}`
                      : `ID: ${paiement.id_enseignant}`;

                    return (
                      <tr key={paiement.id_finance}>
                        <td className="border p-2">{nomEnseignant}</td>
                        <td className="border p-2">
                          {new Date(paiement.date_transaction).toLocaleDateString()}
                        </td>
                        <td className="border p-2">{paiement.type_transaction}</td>
                        <td className="border p-2">{paiement.montant} FCFA</td>
                        <td className="border p-2">{paiement.statut}</td>
                        <td className="border p-2">{paiement.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Box>
      </Box>
    </div>
  );
}