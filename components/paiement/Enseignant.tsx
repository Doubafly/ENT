"use client";
import { 
  Box, 
  MenuItem, 
  Select, 
  TextField, 
  CircularProgress, 
  Alert, 
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Decimal } from "@prisma/client/runtime/library";
import { Receipt as ReceiptIcon } from "@mui/icons-material";

interface Enseignant {
  id: number;
  matricule: string;
  utilisateur: {
    nom: string;
    prenom: string;
  };
  specialite: string;
  cours?: {
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

type FinanceTypeTransaction = 'Salaire'| 'Autre';
type FinanceModePaiement = 'Espèces' | 'Chèque'|'Virement';

const paymentTypes: FinanceTypeTransaction[] = ['Salaire', 'Autre'];
const paymentModes: FinanceModePaiement[] = ['Espèces', 'Chèque','Virement'];
// const SESSION_API_URL = "/api/auth/session";

export default function Enseignant() {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<FinanceTypeTransaction>("Salaire");
  const [paymentMode, setPaymentMode] = useState<FinanceModePaiement>("Espèces");
  const [paymentDescription, setPaymentDescription] = useState<string>("");
  const [paymentHistory, setPaymentHistory] = useState<Paiement[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState({
    initial: true,
    envoi: false,
    session: true,
    recu: false
  });
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<number | null>(null);

  // Vérification de la session
  useEffect(() => {
    const checkUserSession = async () => {
      try {

const userDataString = localStorage.getItem("user");
        if (!userDataString) {
          throw new Error("Aucune session utilisateur trouvée");
        }

        const userData = JSON.parse(userDataString);
        // console.log("Données utilisateur:", userData);
        // Vérification plus robuste de la structure des données
        if (userData?.user?.id) {
          setCurrentUserId(userData.user.id);
        } else if (userData?.id) {
          setCurrentUserId(userData.id);
        } else {
          throw new Error("Données utilisateur incomplètes");
        }
      } catch (err) {
        console.error("Erreur vérification session:", err);
        setError(err instanceof Error ? err.message : "Erreur de session");
      } finally {
        setLoading(prev => ({...prev, session: false}));
      }
    };

    checkUserSession();
  }, []);

  // Récupérer les données initiales
  useEffect(() => {
    if (loading.session) return;

    const fetchInitialData = async () => {
      setError(null);
      try {
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
          if (cours.filiere_module?.module) {
            const module = cours.filiere_module.module;
            if (!acc.some(m => m.id_module === module.id_module)) {
              acc.push({
                id_module: module.id_module,
                nom: module.nom
              });
            }
          }
          return acc;
        }, []) || [];
        setModules(modulesUniques);

        // Traitement des enseignants avec leurs cours
        const enseignantsAvecCours = enseignantsData.utilisateurs?.map((enseignant: any) => {
          const coursEnseignant = modulesData.cours?.filter((c: any) => 
            c.enseignant?.id === enseignant.id
          ) || [];
          
          return {
            ...enseignant,
            cours: coursEnseignant
          };
        }) || [];
        
        setEnseignants(enseignantsAvecCours);
        setPaymentHistory(paiementsData.finances || []);

      } catch (err) {
        console.error("Erreur initiale:", err);
        setError("Impossible de charger les données initiales");
      } finally {
        setLoading(prev => ({...prev, initial: false}));
      }
    };
    fetchInitialData();
  }, [loading.session]);


  // Filtrer les enseignants
  const filteredEnseignants = enseignants.filter(enseignant => {
    const matchesSearch = searchTerm 
      ? `${enseignant.utilisateur.nom} ${enseignant.utilisateur.prenom} ${enseignant.matricule} ${enseignant.specialite}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;
    
    const matchesModule = selectedModule
      ? (enseignant.cours?.some(c => 
          c.filiere_module?.module?.id_module === parseInt(selectedModule)) || false)
      : true;
    
    return matchesSearch && matchesModule;
  });

  // Filtrer l'historique des paiements
  const filteredPaymentHistory = selectedEnseignant
    ? paymentHistory.filter(p => p.id_enseignant === parseInt(selectedEnseignant))
    : paymentHistory.filter(p => p.id_enseignant);

  // Enregistrer un paiement
  const handlePayment = async () => {
    if (!selectedEnseignant || !paymentAmount) {
      setError("Sélectionnez un enseignant et entrez un montant");
      return;
    }

    if (!currentUserId) {
      setError("Vous devez être connecté pour effectuer un paiement");
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
          id_utilisateur: currentUserId,
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

  // Générer un reçu
  const generateReceipt = async (paiementId: number) => {
    setLoading(prev => ({...prev, recu: true}));
    setSelectedReceipt(paiementId);
    setError(null);
    
    try {
      const paiement = paymentHistory.find(p => p.id_finance === paiementId);
      if (!paiement) throw new Error("Paiement introuvable");

      const enseignant = enseignants.find(e => e.id === paiement.id_enseignant) || paiement.enseignant;
      if (!enseignant) throw new Error("Enseignant introuvable");

      // Créer le contenu du reçu
      const receiptContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reçu de paiement</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; }
            .receipt-info { margin: 20px 0; }
            .details { margin: 15px 0; }
            .signature { margin-top: 50px; }
            .border { border-top: 1px dashed #000; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">REÇU DE PAIEMENT</div>
            <div>École Supérieure</div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="border"></div>
          
          <div class="receipt-info">
            <div><strong>Enseignant:</strong> ${enseignant.utilisateur.nom} ${enseignant.utilisateur.prenom}</div>
            <div><strong>Matricule:</strong> ${enseignant.matricule}</div>
          </div>
          
          <div class="details">
            <div><strong>Type:</strong> ${paiement.type_transaction}</div>
            <div><strong>Montant:</strong> ${Number(paiement.montant).toLocaleString()} FCFA</div>
            <div><strong>Mode de paiement:</strong> ${paiement.mode_paiement}</div>
            <div><strong>Date:</strong> ${new Date(paiement.date_transaction).toLocaleDateString()}</div>
            <div><strong>Description:</strong> ${paiement.description}</div>
          </div>
          
          <div class="border"></div>
          
          <div class="signature">
            <div>Signature</div>
            <div style="margin-top: 50px;">_________________________</div>
          </div>
        </body>
        </html>
      `;

      // Ouvrir une nouvelle fenêtre avec le reçu
      const receiptWindow = window.open('', '_blank');
      if (receiptWindow) {
        receiptWindow.document.write(receiptContent);
        receiptWindow.document.close();
        
        // Attendre que le contenu soit chargé avant d'imprimer
        receiptWindow.onload = () => {
          receiptWindow.print();
        };
      } else {
        throw new Error("Impossible d'ouvrir la fenêtre d'impression");
      }
    } catch (err) {
      console.error("Erreur génération reçu:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de la génération du reçu");
    } finally {
      setLoading(prev => ({...prev, recu: false}));
      setSelectedReceipt(null);
    }
  };

  if (loading.initial || loading.session) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" component="h1" gutterBottom>
        Paiements Enseignants
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={3}>
        {/* Filtres */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" gap={2} mb={2}>
            <Select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setSelectedEnseignant("");
              }}
              displayEmpty
              fullWidth
              size="small"
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
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          <Select
            value={selectedEnseignant}
            onChange={(e) => setSelectedEnseignant(e.target.value)}
            displayEmpty
            fullWidth
            size="small"
            disabled={!modules.length || !enseignants.length}
          >
            <MenuItem value="" disabled>
              {modules.length && enseignants.length ? "Sélectionner un enseignant" : "Chargement..."}
            </MenuItem>
            {filteredEnseignants.map((enseignant) => (
              <MenuItem key={enseignant.id} value={enseignant.id.toString()}>
                {enseignant.utilisateur.nom} {enseignant.utilisateur.prenom} - {enseignant.specialite}
              </MenuItem>
            ))}
          </Select>
        </Paper>

        {/* Formulaire de paiement */}
        {currentUserId && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nouveau Paiement
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" gap={2}>
                <Select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as FinanceTypeTransaction)}
                  fullWidth
                  size="small"
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
                  size="small"
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
                  size="small"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  disabled={!selectedEnseignant}
                />

                <Button
                  variant="contained"
                  onClick={handlePayment}
                  disabled={!selectedEnseignant || !paymentAmount || loading.envoi}
                  sx={{ height: '40px' }}
                >
                  {loading.envoi ? <CircularProgress size={24} color="inherit" /> : "Enregistrer"}
                </Button>
              </Box>

              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                size="small"
                value={paymentDescription}
                onChange={(e) => setPaymentDescription(e.target.value)}
                placeholder="Détails du paiement..."
              />
            </Box>
          </Paper>
        )}

        {/* Historique des paiements */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Historique des paiements
            {selectedEnseignant && ` pour l'enseignant sélectionné`}
          </Typography>
          
          {filteredPaymentHistory.length === 0 ? (
            <Alert severity="info">Aucun paiement enregistré</Alert>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#0080FF' }}>
                    <TableCell sx={{ color: '#FFFFFF' }}>Enseignant</TableCell>
                    <TableCell sx={{ color: '#FFFFFF' }}>Date</TableCell>
                    <TableCell sx={{ color: '#FFFFFF' }}>Type</TableCell>
                    <TableCell sx={{ color: '#FFFFFF' }}>Montant</TableCell>
                    <TableCell sx={{ color: '#FFFFFF' }}>Mode</TableCell>
                    <TableCell sx={{ color: '#FFFFFF' }}>Description</TableCell>
                    <TableCell sx={{ color: '#FFFFFF' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPaymentHistory.map((paiement) => {
                    const enseignant = enseignants.find(e => e.id === paiement.id_enseignant) || 
                                     paiement.enseignant;
                    const nomEnseignant = enseignant 
                      ? `${enseignant.utilisateur?.nom || ''} ${enseignant.utilisateur?.prenom || ''}`
                      : `ID: ${paiement.id_enseignant}`;

                    return (
                      <TableRow key={paiement.id_finance}>
                        <TableCell>{nomEnseignant}</TableCell>
                        <TableCell>
                          {new Date(paiement.date_transaction).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>{paiement.type_transaction}</TableCell>
                        <TableCell>{Number(paiement.montant).toLocaleString()} FCFA</TableCell>
                        <TableCell>{paiement.mode_paiement}</TableCell>
                        <TableCell>{paiement.description}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => generateReceipt(paiement.id_finance)}
                            disabled={loading.recu && selectedReceipt === paiement.id_finance}
                          >
                            {loading.recu && selectedReceipt === paiement.id_finance ? (
                              <CircularProgress size={20} />
                            ) : (
                              <ReceiptIcon fontSize="small" />
                            )}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      </Box>
    </div>
  );
}