"use client";
import { Box, MenuItem, Select, TextField, CircularProgress, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { Decimal } from "@prisma/client/runtime/library";

interface Enseignant {
  id: number;
  matricule: string;
  utilisateur: {
    nom: string;
    prenom: string;
  };
  specialite: string;
  cours: {
    filiere_module: {
      module: {
        id_module: number;
        nom: string;
      };
    };
  }[];
}

interface Module {
  id_module: number;
  nom: string;
}

interface Paiement {
  id_finance: number;
  date_transaction: string;
  montant: Decimal | number;
  type_transaction: string;
  statut: string;
  description: string;
  mode_paiement: string;
  id_enseignant: number;
  enseignant?: {
    matricule: string;
    utilisateur: {
      nom: string;
      prenom: string;
    };
  };
}

type FinanceTypeTransaction = 'Salaire' | 'Prime' | 'Remboursement' | 'Autre';
type FinanceModePaiement = 'Espèces' | 'Chèque' | 'Virement' | 'Carte Bancaire';

const paymentTypes: FinanceTypeTransaction[] = ['Salaire', 'Prime', 'Remboursement', 'Autre'];
const paymentModes: FinanceModePaiement[] = ['Espèces', 'Chèque', 'Virement', 'Carte Bancaire'];

export default function Enseignant() {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<FinanceTypeTransaction>("Salaire");
  const [paymentMode, setPaymentMode] = useState<FinanceModePaiement>("Virement");
  const [paymentDescription, setPaymentDescription] = useState<string>("");
  const [paymentHistory, setPaymentHistory] = useState<Paiement[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState({
    initial: true,
    envoi: false
  });
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      setError(null);
      try {
        // Charger les modules et enseignants en parallèle
        const [modulesResponse, enseignantsResponse, paiementsResponse] = await Promise.all([
          fetch('/api/cours'),
          fetch('/api/utilisateurs/enseignants'),
          fetch('/api/finance?type_entite=Enseignant')
        ]);

        if (!modulesResponse.ok) throw new Error("Erreur de chargement des modules");
        if (!enseignantsResponse.ok) throw new Error("Erreur de chargement des enseignants");
        if (!paiementsResponse.ok) throw new Error("Erreur de chargement des paiements");

        const [modulesData, enseignantsData, paiementsData] = await Promise.all([
          modulesResponse.json(),
          enseignantsResponse.json(),
          paiementsResponse.json()
        ]);

        // Traitement des modules
        const modulesUniques = modulesData.cours?.reduce((acc: Module[], cours: any) => {
          const module = cours.filiere_module?.module;
          if (module && !acc.some(m => m.id_module === module.id_module)) {
            acc.push({
              id_module: module.id_module,
              nom: module.nom
            });
          }
          return acc;
        }, []) || [];
        setModules(modulesUniques);

        // Traitement des enseignants
        setEnseignants(enseignantsData.enseignants || []);

        // Traitement des paiements
        setPaymentHistory(paiementsData.finances || []);

      } catch (err) {
        console.error("Erreur initiale:", err);
        setError("Impossible de charger les données initiales");
      } finally {
        setLoading(prev => ({...prev, initial: false}));
      }
    };
    fetchInitialData();
  }, []);

  // Filtrer les enseignants par recherche et module
  const filteredEnseignants = enseignants.filter(enseignant => {
    const matchesSearch = searchTerm 
      ? `${enseignant.utilisateur.nom} ${enseignant.utilisateur.prenom} ${enseignant.matricule} ${enseignant.specialite}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;
    
    const matchesModule = selectedModule
      ? (enseignant.cours?.some(c => c.filiere_module?.module?.id_module === parseInt(selectedModule)) || false)
      : true;
    
    return matchesSearch && matchesModule;
  });

  // Filtrer l'historique pour l'enseignant sélectionné
  const filteredPaymentHistory = selectedEnseignant
    ? paymentHistory.filter(p => p.id_enseignant === parseInt(selectedEnseignant))
    : paymentHistory.filter(p => p.id_enseignant); // Seulement les paiements avec id_enseignant

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
          mode_paiement: paymentMode,
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

  if (loading.initial) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Paiements Enseignants</h1>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={3}>
        {/* Filtres Module → Enseignant */}
        <Box display="flex" gap={2}>
          <Select
            value={selectedModule}
            onChange={(e) => {
              setSelectedModule(e.target.value);
              setSelectedEnseignant("");
            }}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">Tous les modules</MenuItem>
            {modules.map((module) => (
              <MenuItem key={module.id_module} value={module.id_module.toString()}>
                {module.nom}
              </MenuItem>
            ))}
          </Select>

          <TextField
            label="Rechercher un enseignant"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={selectedEnseignant}
            onChange={(e) => setSelectedEnseignant(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Sélectionner un enseignant
            </MenuItem>
            {filteredEnseignants.map((enseignant) => (
              <MenuItem key={enseignant.id} value={enseignant.id.toString()}>
                {enseignant.utilisateur.nom} {enseignant.utilisateur.prenom} - {enseignant.specialite}
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
              disabled={!selectedEnseignant}
            />

            <button
              onClick={handlePayment}
              disabled={!selectedEnseignant || !paymentAmount || loading.envoi}
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
            {selectedEnseignant && ` pour l'enseignant sélectionné`}
          </h2>
          
          {filteredPaymentHistory.length === 0 ? (
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
                    <th className="border p-2 text-left">Mode</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaymentHistory.map((paiement) => {
                    const enseignant = enseignants.find(e => e.id === paiement.id_enseignant) || 
                                     paiement.enseignant;
                    const nomEnseignant = enseignant 
                      ? `${enseignant.utilisateur?.nom || ''} ${enseignant.utilisateur?.prenom || ''}`
                      : `ID: ${paiement.id_enseignant}`;

                    return (
                      <tr key={paiement.id_finance}>
                        <td className="border p-2">{nomEnseignant}</td>
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