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
  Chip,
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
  id_etudiant: number;
}

interface EtudiantInfo {
  id: number; // id_etudiant
  matricule: string;
  filiere?: {
    nom: string;
    niveau: string;
    montant_annuel: Decimal | number;
  };
}

const ITEMS_PER_PAGE = 5;

export default function EtudiantPaiement() {
  const [paymentHistory, setPaymentHistory] = useState<Paiement[]>([]);
  const [User,setUser]= useState<any>();
  const [etudiantInfo, setEtudiantInfo] = useState<EtudiantInfo | null>(null);
  const [loading, setLoading] = useState({
    initial: true,
    session: true,
    recu: false
  });
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Vérification de la session
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch("/api/auth/session");

        if (!response.ok) throw new Error("Erreur de session");

        const { user } = await response.json();
        setUser(user)
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

  // Récupérer les données
  useEffect(() => {
    if (loading.session || !currentUserId) return;

    const fetchData = async () => {
      setError(null);
      try {
        const etudiantId = User?.etudiant?.id;
        
        if (!etudiantId) throw new Error("ID étudiant introuvable");

        // 2. Récupérer les paiements avec l'id_etudiant
        const paymentsResponse = await fetch(`/api/finance/etudiant/${etudiantId}`);
        if (!paymentsResponse.ok) throw new Error("Erreur de chargement des paiements");
         const paymentsData = await paymentsResponse.json();
         console.log(paymentsData);
        const montant = paymentsData.transactions[0].etudiant.filiere
        setEtudiantInfo({
          id: User?.etudiant?.id,
          matricule: User?.etudiant?.matricule,
          filiere: montant,
        });


       
        setPaymentHistory(paymentsData.transactions || []);

        // Pagination
        setTotalPages(Math.ceil(paymentsData.transactions.length / ITEMS_PER_PAGE));
      } catch (err) {
        console.error("Erreur:", err);
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(prev => ({...prev, initial: false}));
      }
    };

    fetchData();
  }, [loading.session, currentUserId]);

  // Calculs financiers
  const calculatePayments = () => {
    if (!etudiantInfo?.filiere) return { total: 0, paid: 0, remaining: 0 };

    const total = Number(etudiantInfo.filiere.montant_annuel);
    const paid = paymentHistory.reduce((sum, p) => sum + Number(p.montant), 0);
    const remaining = Math.max(0, total - paid);

    return { total, paid, remaining };
  };

  const { total, paid, remaining } = calculatePayments();

  // Pagination
  const paginatedPayments = paymentHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Génération de reçu
  const generateReceipt = async (paiementId: number) => {
    setLoading(prev => ({...prev, recu: true}));
    setSelectedReceipt(paiementId);
    
    try {
      const paiement = paymentHistory.find(p => p.id_finance === paiementId);
      if (!paiement || !etudiantInfo) throw new Error("Données manquantes");

      const receiptContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reçu de paiement</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; }
            .details { margin: 15px 0; }
            .signature { margin-top: 50px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">REÇU DE PAIEMENT</div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="details">
            <div><strong>Matricule:</strong> ${etudiantInfo.matricule}</div>
            ${etudiantInfo.filiere ? `
            <div><strong>Filière:</strong> ${etudiantInfo.filiere.nom} (${etudiantInfo.filiere.niveau})</div>
            ` : ''}
            <div><strong>Type:</strong> ${paiement.type_transaction}</div>
            <div><strong>Montant:</strong> ${Number(paiement.montant).toLocaleString()} FCFA</div>
            <div><strong>Date:</strong> ${dayjs(paiement.date_transaction).format("DD/MM/YYYY")}</div>
          </div>
          
          <div class="signature">
            <div>Signature</div>
            <div style="margin-top: 50px;">_________________________</div>
          </div>
        </body>
        </html>
      `;

      const win = window.open("", "_blank");
      if (win) {
        win.document.write(receiptContent);
        win.document.close();
        win.onload = () => win.print();
      }
    } catch (err) {
      setError("Erreur lors de la génération du reçu");
    } finally {
      setLoading(prev => ({...prev, recu: false}));
    }
  };

  if (loading.initial || loading.session) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Mes Paiements</Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {etudiantInfo?.filiere && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Situation Financière</Typography>
          
          <Box display="flex" justifyContent="space-around" flexWrap="wrap">
            <Box textAlign="center">
              <Typography>Frais annuels</Typography>
              <Typography variant="h6">{total.toLocaleString()} FCFA</Typography>
            </Box>
            <Box textAlign="center">
              <Typography>Payé</Typography>
              <Typography variant="h6" color="success.main">{paid.toLocaleString()} FCFA</Typography>
            </Box>
            <Box textAlign="center">
              <Typography>Reste</Typography>
              <Typography variant="h6" color={remaining > 0 ? "error.main" : "success.main"}>
                {remaining.toLocaleString()} FCFA
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Historique des paiements</Typography>
        
        {paymentHistory.length === 0 ? (
          <Alert severity="info">Aucun paiement enregistré</Alert>
        ) : (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPayments.map((p) => (
                  <TableRow key={p.id_finance}>
                    <TableCell>{dayjs(p.date_transaction).format("DD/MM/YYYY")}</TableCell>
                    <TableCell>{p.type_transaction}</TableCell>
                    <TableCell>{Number(p.montant).toLocaleString()} FCFA</TableCell>
                    <TableCell>{p.mode_paiement}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => generateReceipt(p.id_finance)} size="small">
                        <ReceiptIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}