"use client";
import { 
  Box, 
  CircularProgress, 
  Alert, 
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Pagination
} from "@mui/material";
import { useEffect, useState } from "react";
import { Decimal } from "@prisma/client/runtime/library";
import { Receipt as ReceiptIcon } from "@mui/icons-material";
import dayjs from "dayjs";

interface Paiement {
  id_finance: number;
  date_transaction: string;
  montant: Decimal | number;
  type_transaction: string;
  statut: string;
  description: string;
  mode_paiement: string;
  id_enseignant: number;
}

const SESSION_API_URL = "/api/auth/session";
const ITEMS_PER_PAGE = 5;

export default function EnseignantPaiement() {
  const [paymentHistory, setPaymentHistory] = useState<Paiement[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState({
    initial: true,
    session: true,
    recu: false
  });
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<number | null>(null);
  
  // Filtres
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [modeFilter, setModeFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  // Récupérer les paiements de l'enseignant
  useEffect(() => {
    if (loading.session || !currentUserId) return;

    const fetchPaymentData = async () => {
      setError(null);
      try {
        const response = await fetch(`/api/finance/enseignant/${currentUserId}`);
        
        if (!response.ok) throw new Error("Erreur de chargement des paiements");

        const data = await response.json();
        setPaymentHistory(data.transactions || []);
        applyFilters(data.transactions || []);

      } catch (err) {
        console.error("Erreur chargement paiements:", err);
        setError("Impossible de charger vos paiements");
      } finally {
        setLoading(prev => ({...prev, initial: false}));
      }
    };
    
    fetchPaymentData();
  }, [loading.session, currentUserId]);

  // Appliquer les filtres
  const applyFilters = (payments: Paiement[]) => {
    let filtered = [...payments];

    // Filtre par type
    if (typeFilter) {
      filtered = filtered.filter(p => p.type_transaction === typeFilter);
    }

    // Filtre par mode de paiement
    if (modeFilter) {
      filtered = filtered.filter(p => p.mode_paiement === modeFilter);
    }

    // Filtre par date
    if (dateFilter) {
      filtered = filtered.filter(p => 
        dayjs(p.date_transaction).format("YYYY-MM") === dateFilter
      );
    }

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.description.toLowerCase().includes(term) ||
        p.type_transaction.toLowerCase().includes(term) ||
        p.mode_paiement.toLowerCase().includes(term) ||
        p.montant.toString().includes(term)
      );
    }

    // Calculer la pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    setTotalPages(totalPages);
    
    // Si la page actuelle est supérieure au nombre total de pages, revenir à la première page
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }

    // Appliquer la pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPayments = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    setFilteredPayments(paginatedPayments);
  };

  // Réappliquer les filtres quand ils changent
  useEffect(() => {
    applyFilters(paymentHistory);
  }, [typeFilter, modeFilter, dateFilter, searchTerm, currentPage, paymentHistory]);

  // Générer un reçu (identique à votre version précédente)
  const generateReceipt = async (paiementId: number) => {
    setLoading(prev => ({...prev, recu: true}));
    setSelectedReceipt(paiementId);
    setError(null);
    
    try {
      const paiement = paymentHistory.find(p => p.id_finance === paiementId);
      if (!paiement) throw new Error("Paiement introuvable");

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
        Mes Paiements
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtres
        </Typography>
        
        <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as string);
                setCurrentPage(1);
              }}
              label="Type"
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="Salaire">Salaire</MenuItem>
              <MenuItem value="Prime">Prime</MenuItem>
              <MenuItem value="Avance">Avance</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Mode</InputLabel>
            <Select
              value={modeFilter}
              onChange={(e) => {
                setModeFilter(e.target.value as string);
                setCurrentPage(1);
              }}
              label="Mode"
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="Virement">Virement</MenuItem>
              <MenuItem value="Chèque">Chèque</MenuItem>
              <MenuItem value="Espèces">Espèces</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Mois/Année"
            type="month"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
          />

          <TextField
            label="Recherche"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            sx={{ flexGrow: 1 }}
          />
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Historique des paiements
        </Typography>
        
        {filteredPayments.length === 0 ? (
          <Alert severity="info">Aucun paiement trouvé avec ces critères</Alert>
        ) : (
          <>
            <Box sx={{ overflowX: 'auto', mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Montant</TableCell>
                    <TableCell>Mode</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayments.map((paiement) => (
                    <TableRow key={paiement.id_finance}>
                      <TableCell>
                        {dayjs(paiement.date_transaction).format("DD/MM/YYYY")}
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
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        )}
      </Paper>
    </div>
  );
}