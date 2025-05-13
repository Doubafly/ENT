"use client";
import { Box, MenuItem, Select, TextField, CircularProgress, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { Decimal } from "@prisma/client/runtime/library";

interface Etudiant {
  id: number;
  matricule: string;
  utilisateur: {
    nom: string;
    prenom: string;
  };
}

interface Filiere {
  id_filiere: number;
  nom: string;
  niveau: string;
}

interface Paiement {
  id_finance: number;
  date_transaction: string;
  montant: Decimal | number;
  type_transaction: string;
  statut: string;
  description: string;
  mode_paiement: string;
  id_etudiant: number;
  etudiant?: {
    matricule: string;
    utilisateur: {
      nom: string;
      prenom: string;
    };
  };
}

type FinanceTypeTransaction = 'Inscription' | 'Scolarite' | 'Remboursement' | 'Autre';
type FinanceModePaiement = 'Espèces' | 'Chèque' | 'Virement' | 'Carte Bancaire';

const paymentTypes: FinanceTypeTransaction[] = ['Inscription', 'Scolarite', 'Remboursement', 'Autre'];
const paymentModes: FinanceModePaiement[] = ['Espèces', 'Chèque', 'Virement', 'Carte Bancaire'];

export default function Etudiant() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [selectedFiliere, setSelectedFiliere] = useState<string>("");
  const [selectedNiveau, setSelectedNiveau] = useState<string>("");
  const [selectedEtudiant, setSelectedEtudiant] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<FinanceTypeTransaction>("Scolarite");
  const [paymentMode, setPaymentMode] = useState<FinanceModePaiement>("Virement");
  const [paymentDescription, setPaymentDescription] = useState<string>("");
  const [paymentHistory, setPaymentHistory] = useState<Paiement[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState({
    filieres: false,
    etudiants: false,
    paiements: false,
    envoi: false
  });
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(prev => ({...prev, filieres: true, paiements: true}));
      setError(null);
      try {
        // Charger les filières
        const filieresResponse = await fetch('/api/filieres');
        if (!filieresResponse.ok) throw new Error("Erreur de chargement des filières");
        const filieresData = await filieresResponse.json();
        setFilieres(filieresData.filieres || []);

        // Charger tous les paiements des étudiants
        const paiementsResponse = await fetch('/api/finance?type_entite=Etudiant');
        if (!paiementsResponse.ok) throw new Error("Erreur de chargement des paiements");
        const paiementsData = await paiementsResponse.json();
        setPaymentHistory(paiementsData.finances || []);

      } catch (err) {
        console.error("Erreur initiale:", err);
        setError("Impossible de charger les données initiales");
      } finally {
        setLoading(prev => ({...prev, filieres: false, paiements: false}));
      }
    };
    fetchInitialData();
  }, []);

  // Récupérer les étudiants filtrés
  useEffect(() => {
    const fetchEtudiants = async () => {
      setLoading(prev => ({...prev, etudiants: true}));
      setError(null);
      try {
        let url = '/api/utilisateurs/etudiants?';
        if (selectedFiliere) url += `filiere=${selectedFiliere}&`;
        if (selectedNiveau) url += `niveau=${selectedNiveau}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erreur de chargement des étudiants");
        const data = await response.json();
        setEtudiants(data.etudiants || []);
      } catch (err) {
        console.error("Erreur étudiants:", err);
        setError("Impossible de charger les étudiants");
      } finally {
        setLoading(prev => ({...prev, etudiants: false}));
      }
    };
    fetchEtudiants();
  }, [selectedFiliere, selectedNiveau]);

  // Filtrer les étudiants par recherche
  const filteredEtudiants = etudiants.filter(etudiant =>
    `${etudiant.utilisateur.nom} ${etudiant.utilisateur.prenom} ${etudiant.matricule}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Niveaux disponibles pour la filière sélectionnée
  const niveauxDisponibles = Array.from(
    new Set(
      filieres
        .filter(f => selectedFiliere ? f.id_filiere === parseInt(selectedFiliere) : true)
        .map(f => f.niveau)
    )
  );

  // Filtrer l'historique pour l'étudiant sélectionné
  const filteredPaymentHistory = selectedEtudiant
    ? paymentHistory.filter(p => p.id_etudiant === parseInt(selectedEtudiant))
    : paymentHistory.filter(p => p.id_etudiant); // Seulement les paiements avec id_etudiant

  const handlePayment = async () => {
    if (!selectedEtudiant || !paymentAmount) {
      setError("Sélectionnez un étudiant et entrez un montant");
      return;
    }

    setLoading(prev => ({...prev, envoi: true}));
    setError(null);
    try {
      const etudiant = etudiants.find(e => e.id === parseInt(selectedEtudiant));
      if (!etudiant) throw new Error("Étudiant introuvable");

      const montant = parseFloat(paymentAmount);
      if (isNaN(montant)) throw new Error("Montant invalide");

      const description = paymentDescription || 
        `Paiement ${paymentType} pour ${etudiant.utilisateur.nom} ${etudiant.utilisateur.prenom}`;

      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          type_transaction: paymentType,
          montant: montant,
          description: description,
          mode_paiement: paymentMode,
          id_utilisateur: 1, // À remplacer par l'ID de l'utilisateur connecté
          id_etudiant: etudiant.id
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
      <h1 className="text-2xl font-bold mb-6">Paiements Étudiants</h1>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={3}>
        {/* Filtres Filière → Niveau → Étudiant */}
        <Box display="flex" gap={2}>
          <Select
            value={selectedFiliere}
            onChange={(e) => {
              setSelectedFiliere(e.target.value);
              setSelectedNiveau("");
              setSelectedEtudiant("");
            }}
            displayEmpty
            fullWidth
            disabled={loading.filieres}
          >
            <MenuItem value="">Toutes les filières</MenuItem>
            {filieres.map((filiere) => (
              <MenuItem key={filiere.id_filiere} value={filiere.id_filiere.toString()}>
                {filiere.nom}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={selectedNiveau}
            onChange={(e) => {
              setSelectedNiveau(e.target.value);
              setSelectedEtudiant("");
            }}
            displayEmpty
            fullWidth
            disabled={!selectedFiliere || loading.filieres}
          >
            <MenuItem value="">Tous les niveaux</MenuItem>
            {niveauxDisponibles.map((niveau, index) => (
              <MenuItem key={index} value={niveau}>
                {niveau}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Recherche étudiant */}
        <Box display="flex" gap={2}>
          <TextField
            label="Rechercher un étudiant"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={selectedEtudiant}
            onChange={(e) => setSelectedEtudiant(e.target.value)}
            displayEmpty
            fullWidth
            disabled={loading.etudiants}
          >
            <MenuItem value="" disabled>
              {loading.etudiants ? <CircularProgress size={20} /> : "Sélectionner un étudiant"}
            </MenuItem>
            {filteredEtudiants.map((etudiant) => (
              <MenuItem key={etudiant.id} value={etudiant.id.toString()}>
                {etudiant.utilisateur.nom} {etudiant.utilisateur.prenom} - {etudiant.matricule}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Formulaire de paiement */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={2}>
            <Select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as FinanceTypeTransaction)}
              fullWidth
            >
              {paymentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as FinanceModePaiement)}
              fullWidth
            >
              {paymentModes.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box display="flex" gap={2} alignItems="center">
            <TextField
              type="number"
              label="Montant (FCFA)"
              variant="outlined"
              fullWidth
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              disabled={!selectedEtudiant}
            />

            <button
              onClick={handlePayment}
              disabled={!selectedEtudiant || !paymentAmount || loading.envoi}
              className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading.envoi ? <CircularProgress size={24} color="inherit" /> : "Enregistrer le paiement"}
            </button>
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
        </Box>

        {/* Historique des paiements */}
        <Box mt={4}>
          <h2 className="text-xl font-semibold mb-3">
            Historique des paiements
            {selectedEtudiant && ` pour l'étudiant sélectionné`}
          </h2>
          
          {loading.paiements ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : filteredPaymentHistory.length === 0 ? (
            <p>Aucun paiement enregistré</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Étudiant</th>
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Montant</th>
                    <th className="border p-2 text-left">Mode</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaymentHistory.map((paiement) => {
                    const etudiant = etudiants.find(e => e.id === paiement.id_etudiant) || 
                                   paiement.etudiant;
                    const nomEtudiant = etudiant 
                      ? `${etudiant.utilisateur?.nom || ''} ${etudiant.utilisateur?.prenom || ''} (${etudiant.matricule})`
                      : `ID: ${paiement.id_etudiant}`;

                    return (
                      <tr key={paiement.id_finance}>
                        <td className="border p-2">{nomEtudiant}</td>
                        <td className="border p-2">
                          {new Date(paiement.date_transaction).toLocaleDateString()}
                        </td>
                        <td className="border p-2">{paiement.type_transaction}</td>
                        <td className="border p-2">{Number(paiement.montant)} FCFA</td>
                        <td className="border p-2">{paiement.mode_paiement}</td>
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