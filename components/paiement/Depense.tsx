"use client";
import { 
  Box, 
  MenuItem, 
  Select, 
  TextField, 
  CircularProgress, 
  Alert, 
  Button,
  IconButton
} from "@mui/material";
import { useEffect, useState } from "react";
import { Decimal } from "@prisma/client/runtime/library";
import { Receipt as ReceiptIcon } from "@mui/icons-material";

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

type FinanceModePaiement = 'Espèces' | 'Chèque'|'Virement';

const paymentModes: FinanceModePaiement[] = ['Espèces', 'Chèque','Virement'];
const SESSION_API_URL = "/api/auth/session";

export default function Depense() {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [montant, setMontant] = useState<string>("");
  const [modePaiement, setModePaiement] = useState<FinanceModePaiement>("Espèces");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState({
    initial: true,
    envoi: false,
    session: true,
    recu: false
  });
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<number | null>(null);

  // Vérification de la session et récupération de l'ID utilisateur
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
        } else {
          throw new Error("Utilisateur non connecté");
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

  // Récupérer uniquement les dépenses (type_transaction = "Dépense")
  useEffect(() => {
    if (!currentUserId) return;

    const fetchDepenses = async () => {
      setError(null);
      try {
        const response = await fetch('/api/finance');
        if (!response.ok) throw new Error("Erreur de chargement des transactions");

        const data = await response.json();
        // Filtrer côté client pour ne garder que les dépenses
        const depensesData = data.finances.filter((f: any) => f.type_transaction === "Depense");
        setDepenses(depensesData || []);
      } catch (err) {
        console.error("Erreur initiale:", err);
        setError("Impossible de charger les dépenses");
      } finally {
        setLoading(prev => ({...prev, initial: false}));
      }
    };
    fetchDepenses();
  }, [currentUserId]);

  const ajouterDepense = async () => {
    if (!montant) {
      setError("Veuillez entrer un montant");
      return;
    }

    if (!currentUserId) {
      setError("Vous devez être connecté pour ajouter une dépense");
      return;
    }

    setLoading(prev => ({...prev, envoi: true}));
    setError(null);
    try {
      const montantNumber = parseFloat(montant);
      if (isNaN(montantNumber)) throw new Error("Montant invalide");

      const response = await fetch('/api/finance', {
        method: 'POST',
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

      const nouvelleDepense = await response.json();
      setDepenses(prev => [nouvelleDepense.transaction, ...prev]);
      setMontant("");
      setDescription("");
    } catch (err) {
      console.error("Erreur dépense:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout de la dépense");
    } finally {
      setLoading(prev => ({...prev, envoi: false}));
    }
  };

  const supprimerDepense = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette dépense ?")) return;
    
    setError("Fonctionnalité non implémentée - L'API ne supporte pas la suppression");
    return;
  };

  // Générer un reçu
  const generateReceipt = async (depenseId: number) => {
    setLoading(prev => ({...prev, recu: true}));
    setSelectedReceipt(depenseId);
    setError(null);
    
    try {
      const depense = depenses.find(d => d.id_finance === depenseId);
      if (!depense) throw new Error("Dépense introuvable");

      // Créer le contenu du reçu
      const receiptContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reçu de dépense</title>
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
            <div class="title">REÇU DE DÉPENSE</div>
            <div>École Supérieure</div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="border"></div>
          
          <div class="receipt-info">
            <div><strong>Type:</strong> ${depense.type_transaction}</div>
            ${depense.utilisateur ? `<div><strong>Enregistré par:</strong> ${depense.utilisateur.nom} ${depense.utilisateur.prenom}</div>` : ''}
          </div>
          
          <div class="details">
            <div><strong>Montant:</strong> ${Number(depense.montant).toLocaleString()} FCFA</div>
            <div><strong>Mode de paiement:</strong> ${depense.mode_paiement}</div>
            <div><strong>Date:</strong> ${new Date(depense.date_transaction).toLocaleDateString()}</div>
            <div><strong>Description:</strong> ${depense.description}</div>
            <div><strong>Statut:</strong> ${depense.statut}</div>
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

  if (loading.session || loading.initial) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="container mx-auto p-4">
        <Alert severity="error" className="mb-4">
          Vous devez être connecté pour accéder à cette fonctionnalité.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des Dépenses</h1>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={3}>
        {/* Formulaire d'ajout de dépense */}
        <Box display="flex" flexDirection="column" gap={2}>
          <h2 className="text-xl font-semibold">Ajouter une dépense</h2>
          
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
            />
          </Box>

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détails de la dépense..."
          />

          <Button
            variant="contained"
            onClick={ajouterDepense}
            disabled={!montant || loading.envoi || !currentUserId}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading.envoi ? <CircularProgress size={24} color="inherit" /> : "Enregistrer la dépense"}
          </Button>
        </Box>

        {/* Historique des dépenses */}
        <Box mt={4}>
          <h2 className="text-xl font-semibold mb-3">Historique des dépenses</h2>
          
          {depenses.length === 0 ? (
            <p>Aucune dépense enregistrée</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Montant</th>
                    <th className="border p-2 text-left">Mode de paiement</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-left">Statut</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {depenses.map((depense) => (
                    <tr key={depense.id_finance}>
                      <td className="border p-2">
                        {new Date(depense.date_transaction).toLocaleDateString()}
                      </td>
                      <td className="border p-2">{Number(depense.montant)} FCFA</td>
                      <td className="border p-2">{depense.mode_paiement}</td>
                      <td className="border p-2">{depense.description}</td>
                      <td className="border p-2">{depense.statut}</td>
                      <td className="border p-2">
                        <IconButton
                          size="small"
                          onClick={() => generateReceipt(depense.id_finance)}
                          disabled={loading.recu && selectedReceipt === depense.id_finance}
                        >
                          {loading.recu && selectedReceipt === depense.id_finance ? (
                            <CircularProgress size={20} />
                          ) : (
                            <ReceiptIcon fontSize="small" />
                          )}
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Box>
      </Box>
    </div>
  );
}