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

interface Etudiant {
  id: number;
  matricule: string;
  utilisateur: {
    nom: string;
    prenom: string;
  };
  filiere?: {
    id_filiere: number;
    nom: string;
    niveau: string;
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
    filiere?: {
      nom: string;
      niveau: string;
    };
  };
}

type FinanceTypeTransaction = 'Inscription' | 'Scolarite' | 'Remboursement' | 'Autre';
type FinanceModePaiement = 'Espèces' | 'Chèque'| 'Virement';

const paymentTypes: FinanceTypeTransaction[] = ['Inscription', 'Scolarite', 'Remboursement', 'Autre'];
const paymentModes: FinanceModePaiement[] = ['Espèces', 'Chèque','Virement'];
const SESSION_API_URL = "/api/auth/session";

export default function PaiementEtudiant() {
  // États pour les données
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [selectedFiliere, setSelectedFiliere] = useState<string>("");
  const [selectedNiveau, setSelectedNiveau] = useState<string>("");
  const [selectedEtudiant, setSelectedEtudiant] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<FinanceTypeTransaction>("Scolarite");
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
        const [filieresResponse, paiementsResponse] = await Promise.all([
          fetch('/api/filieres'),
          fetch('/api/finance?type_entite=Etudiant')
        ]);

        if (!filieresResponse.ok) throw new Error("Erreur de chargement des filières");
        if (!paiementsResponse.ok) throw new Error("Erreur de chargement des paiements");

        const [filieresData, paiementsData] = await Promise.all([
          filieresResponse.json(),
          paiementsResponse.json()
        ]);

        setFilieres(filieresData.filieres || []);
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

  // Récupérer les étudiants
  useEffect(() => {
    const fetchEtudiants = async () => {
      setLoading(prev => ({...prev, initial: true}));
      setError(null);
      try {
        const response = await fetch('/api/utilisateurs/etudiants');
        if (!response.ok) throw new Error("Erreur de chargement des étudiants");
        
        const data = await response.json();
        setEtudiants(data.etudiants || []);
      } catch (err) {
        console.error("Erreur étudiants:", err);
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(prev => ({...prev, initial: false}));
      }
    };

    fetchEtudiants();
  }, []);

  // Filtrer les étudiants
  const filteredEtudiants = etudiants.filter(etudiant => {
    const matchesSearch = searchTerm 
      ? `${etudiant.utilisateur.nom} ${etudiant.utilisateur.prenom} ${etudiant.matricule}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;
    
    const matchesFiliere = selectedFiliere
      ? etudiant.filiere?.id_filiere === parseInt(selectedFiliere)
      : true;
    
    const matchesNiveau = selectedNiveau
      ? etudiant.filiere?.niveau === selectedNiveau
      : true;
    
    return matchesSearch && matchesFiliere && matchesNiveau;
  });

  // Niveaux disponibles pour la filière sélectionnée
  const niveauxDisponibles = Array.from(
    new Set(
      filieres
        .filter(f => selectedFiliere ? f.id_filiere === parseInt(selectedFiliere) : true)
        .map(f => f.niveau)
    )
  );

  // Filtrer l'historique des paiements
  const filteredPaymentHistory = selectedEtudiant
    ? paymentHistory.filter(p => p.id_etudiant === parseInt(selectedEtudiant))
    : paymentHistory.filter(p => p.id_etudiant);

  // Enregistrer un paiement
  const handlePayment = async () => {
    if (!selectedEtudiant || !paymentAmount) {
      setError("Sélectionnez un étudiant et entrez un montant");
      return;
    }

    if (!currentUserId) {
      setError("Vous devez être connecté pour effectuer un paiement");
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
          id_utilisateur: currentUserId,
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

  // Générer un reçu
  const generateReceipt = async (paiementId: number) => {
    setLoading(prev => ({...prev, recu: true}));
    setSelectedReceipt(paiementId);
    setError(null);
    
    try {
      const paiement = paymentHistory.find(p => p.id_finance === paiementId);
      if (!paiement) throw new Error("Paiement introuvable");

      const etudiant = etudiants.find(e => e.id === paiement.id_etudiant) || paiement.etudiant;
      if (!etudiant) throw new Error("Étudiant introuvable");

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
            <div><strong>Étudiant:</strong> ${etudiant.utilisateur.nom} ${etudiant.utilisateur.prenom}</div>
            <div><strong>Matricule:</strong> ${etudiant.matricule}</div>
            ${etudiant.filiere ? `<div><strong>Filière:</strong> ${etudiant.filiere.nom} (${etudiant.filiere.niveau})</div>` : ''}
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
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" component="h1" gutterBottom>
        Paiements Étudiants
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
              value={selectedFiliere}
              onChange={(e) => {
                setSelectedFiliere(e.target.value);
                setSelectedNiveau("");
                setSelectedEtudiant("");
              }}
              displayEmpty
              fullWidth
              size="small"
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
              size="small"
              disabled={!selectedFiliere}
            >
              <MenuItem value="">Tous les niveaux</MenuItem>
              {niveauxDisponibles.map((niveau, index) => (
                <MenuItem key={index} value={niveau}>
                  {niveau}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box display="flex" gap={2}>
            <TextField
              label="Rechercher un étudiant"
              variant="outlined"
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              value={selectedEtudiant}
              onChange={(e) => setSelectedEtudiant(e.target.value)}
              displayEmpty
              fullWidth
              size="small"
              disabled={loading.initial}
            >
              <MenuItem value="" disabled>
                {loading.initial ? "Chargement..." : "Sélectionner un étudiant"}
              </MenuItem>
              {filteredEtudiants.map((etudiant) => (
                <MenuItem key={etudiant.id} value={etudiant.id.toString()}>
                  {etudiant.utilisateur.nom} {etudiant.utilisateur.prenom} - {etudiant.matricule}
                </MenuItem>
              ))}
            </Select>
          </Box>
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
                  disabled={!selectedEtudiant}
                />

                <Button
                  variant="contained"
                  onClick={handlePayment}
                  disabled={!selectedEtudiant || !paymentAmount || loading.envoi}
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
            {selectedEtudiant && ` pour l'étudiant sélectionné`}
          </Typography>
          
          {filteredPaymentHistory.length === 0 ? (
            <Alert severity="info">Aucun paiement enregistré</Alert>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Étudiant</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Montant</TableCell>
                    <TableCell>Mode</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPaymentHistory.map((paiement) => {
                    const etudiant = etudiants.find(e => e.id === paiement.id_etudiant) || 
                                   paiement.etudiant;
                    const nomEtudiant = etudiant 
                      ? `${etudiant.utilisateur?.nom || ''} ${etudiant.utilisateur?.prenom || ''} (${etudiant.matricule})`
                      : `ID: ${paiement.id_etudiant}`;

                    return (
                      <TableRow key={paiement.id_finance}>
                        <TableCell>{nomEtudiant}</TableCell>
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