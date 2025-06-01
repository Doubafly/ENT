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
  Pagination,
  FormControl,
  InputLabel,
  Paper
} from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import { Decimal } from "@prisma/client/runtime/library";
import { Delete, FilterList, Clear } from "@mui/icons-material";

import { ConfirmDialog } from "../ConfirmDialog";

interface Transaction {
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
  etudiant?: {
    matricule: string;
    utilisateur: {
      nom: string;
      prenom: string;
    };
  };
}


type FinanceModePaiement = 'Espèces' | 'Chèque';
type TransactionType = 'Depense' | 'Scolarite' | 'Inscription' | 'Salaire' | 'Remboursement' | 'Autre';

const paymentModes: FinanceModePaiement[] = ['Espèces', 'Chèque'];
const transactionTypes: TransactionType[] = ['Depense', 'Scolarite', 'Inscription', 'Salaire', 'Remboursement', 'Autre'];

const ITEMS_PER_PAGE = 10;
const SESSION_API_URL = "/api/auth/session";

export default function GestionTransactions() {
  // États pour les données
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [montant, setMontant] = useState<string>("");
  const [modePaiement, setModePaiement] = useState<FinanceModePaiement>("Espèces");
  const [description, setDescription] = useState<string>("");
  const [typeTransaction, setTypeTransaction] = useState<TransactionType>("Depense");
  
  // États pour les filtres
  const [filterMode, setFilterMode] = useState<FinanceModePaiement | "Tous">("Tous");
  const [filterType, setFilterType] = useState<TransactionType | "Tous">("Tous");
  const [dateDebut, setDateDebut] = useState<string>("");
  const [dateFin, setDateFin] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // États pour la pagination et UI
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState({
    initial: true,
    envoi: false,
    session: true,
    suppression: false
  });
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [deleteOption, setDeleteOption] = useState<"all" | "filtered" | "date">("all");
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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
        setError("Vous devez être connecté pour gérer les transactions");
      } finally {
        setLoading(prev => ({...prev, session: false}));
      }
    };

    checkUserSession();
  }, []);

  // Récupérer les transactions
  useEffect(() => {
    if (loading.session) return;

    const fetchTransactions = async () => {
      setError(null);
      try {
        const response = await fetch('/api/finance');
        if (!response.ok) throw new Error("Erreur de chargement des transactions");

        const data = await response.json();
        setTransactions(data.finances || []);
        setFilteredTransactions(data.finances || []);
      } catch (err) {
        console.error("Erreur:", err);
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(prev => ({...prev, initial: false}));
      }
    };

    fetchTransactions();
  }, [loading.session]);

  // Filtrer les transactions selon les critères sélectionnés
  useEffect(() => {
    let filtered = [...transactions];
    
    if (filterMode !== "Tous") {
      filtered = filtered.filter(t => t.mode_paiement === filterMode);
    }
    
    if (filterType !== "Tous") {
      filtered = filtered.filter(t => t.type_transaction === filterType);
    }
    
    if (dateDebut) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date_transaction).toISOString().split('T')[0];
        return transactionDate >= dateDebut;
      });
    }
    
    if (dateFin) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date_transaction).toISOString().split('T')[0];
        return transactionDate <= dateFin;
      });
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(term) ||
        t.type_transaction.toLowerCase().includes(term) ||
        t.mode_paiement.toLowerCase().includes(term) ||
        (t.etudiant && (
          t.etudiant.matricule.toLowerCase().includes(term) ||
          t.etudiant.utilisateur.nom.toLowerCase().includes(term) ||
          t.etudiant.utilisateur.prenom.toLowerCase().includes(term)
        ))
      );
    }
    
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [filterMode, filterType, dateDebut, dateFin, searchTerm, transactions]);

  // Calcul des données paginées
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Gestion des transactions
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

      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          type_transaction: typeTransaction,
          montant: montantNumber,
          description: description || `${typeTransaction} diverses`,
          mode_paiement: modePaiement,
          id_utilisateur: currentUserId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur serveur");
      }

      const result = await response.json();
      setTransactions(prev => [result.transaction, ...prev]);
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
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

const confirmDelete = async () => {
  if (!itemToDelete) return;
  
  setLoading(prev => ({...prev, suppression: true}));
  setError(null);
  
  try {
    const response = await fetch(`/api/finance/${itemToDelete}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur serveur");
    }

    setTransactions(prev => prev.filter(t => t.id_finance !== itemToDelete));
  } catch (err) {
    console.error("Erreur suppression:", err);
    setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
  } finally {
    setLoading(prev => ({...prev, suppression: false}));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  }
};

  const confirmDeleteSelection = async () => {
  setLoading(prev => ({...prev, suppression: true}));
  setError(null);
  
  try {
    const params = new URLSearchParams();
    params.append('option', deleteOption);

    if (deleteOption === "filtered") {
      if (filterMode !== "Tous") params.append('filterMode', filterMode);
      if (filterType !== "Tous") params.append('filterType', filterType);
      if (dateDebut) params.append('dateDebut', dateDebut);
      if (dateFin) params.append('dateFin', dateFin);
    } else if (deleteOption === "date") {
      if (!dateDebut || !dateFin) throw new Error("Les dates sont requises");
      params.append('dateDebut', dateDebut);
      params.append('dateFin', dateFin);
    }

    const response = await fetch(`/api/finance?${params.toString()}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erreur serveur");
    }

    // Recharger les données
    const fetchResponse = await fetch('/api/finance');
    if (!fetchResponse.ok) throw new Error("Erreur de chargement");
    
    const data = await fetchResponse.json();
    setTransactions(data.finances || []);
  } catch (err) {
    console.error("Erreur suppression:", err);
    setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
  } finally {
    setLoading(prev => ({...prev, suppression: false}));
    setShowDeleteOptions(false);
  }
};

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setFilterMode("Tous");
    setFilterType("Tous");
    setDateDebut("");
    setDateFin("");
    setSearchTerm("");
  };

  // Calcul des totaux
  const totalTransactions = filteredTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.montant), 0
  );

  // Statistiques par type
  const statsByType = transactionTypes.map(type => {
    const transactionsOfType = filteredTransactions.filter(t => t.type_transaction === type);
    const total = transactionsOfType.reduce((sum, t) => sum + Number(t.montant), 0);
    return {
      type,
      count: transactionsOfType.length,
      total
    };
  }).filter(stat => stat.count > 0);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des Transactions Financières</h1>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filtres */}
      <Paper elevation={3} className="p-4 mb-6">
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <h2 className="text-xl font-semibold">Filtres</h2>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={resetFilters}
            disabled={filterMode === "Tous" && filterType === "Tous" && !dateDebut && !dateFin && !searchTerm}
          >
            Réinitialiser
          </Button>
        </Box>
        
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} mb={3}>
          <FormControl fullWidth>
            <InputLabel>Mode de paiement</InputLabel>
            <Select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as FinanceModePaiement | "Tous")}
              label="Mode de paiement"
            >
              <MenuItem value="Tous">Tous les modes</MenuItem>
              {paymentModes.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Type de transaction</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TransactionType | "Tous")}
              label="Type de transaction"
            >
              <MenuItem value="Tous">Tous les types</MenuItem>
              {transactionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} mb={3}>
          <div className="w-full">
            <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              id="dateDebut"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="w-full">
            <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              id="dateFin"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={dateDebut}
            />
          </div>
          
          <TextField
            label="Rechercher"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: <FilterList />
            }}
          />
        </Box>
      </Paper>

      {/* Statistiques */}
      <Paper elevation={3} className="p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Statistiques</h2>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <span className="font-medium">Total filtré: </span>
            <span className="text-lg font-bold">{totalTransactions.toLocaleString()} FCFA</span>
          </Box>
          <Box>
            <span className="font-medium">Nombre: </span>
            <span className="text-lg font-bold">{filteredTransactions.length}</span>
          </Box>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setShowDeleteOptions(true)}
            disabled={transactions.length === 0 || loading.suppression}
            startIcon={<Delete />}
          >
            Options de suppression
          </Button>
        </Box>
        
        {statsByType.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {statsByType.map(stat => (
              <div key={stat.type} className="border p-3 rounded-lg">
                <h3 className="font-medium">{stat.type}</h3>
                <div className="flex justify-between mt-2">
                  <span>Nombre:</span>
                  <span className="font-medium">{stat.count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">{stat.total.toLocaleString()} FCFA</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Paper>

      {/* Historique */}
      <Paper elevation={3} className="p-4">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <h2 className="text-xl font-semibold">Historique des Transactions</h2>
          <span className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages} ({filteredTransactions.length} résultats)
          </span>
        </Box>
        
        {filteredTransactions.length === 0 ? (
          <Alert severity="info">Aucune transaction trouvée avec ces critères</Alert>
        ) : (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Montant</th>
                    <th className="border p-2 text-left">Mode</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-left">Bénéficiaire</th>
                    <th className="border p-2 text-left">Statut</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id_finance}>
                      <td className="border p-2">
                        {new Date(transaction.date_transaction).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="border p-2">{transaction.type_transaction}</td>
                      <td className="border p-2 font-medium">
                        {Number(transaction.montant).toLocaleString()} FCFA
                      </td>
                      <td className="border p-2">{transaction.mode_paiement}</td>
                      <td className="border p-2">{transaction.description}</td>
                      <td className="border p-2">
                        {transaction.etudiant ? (
                          `${transaction.etudiant.utilisateur.nom} ${transaction.etudiant.utilisateur.prenom} (${transaction.etudiant.matricule})`
                        ) : transaction.utilisateur ? (
                          `${transaction.utilisateur.nom} ${transaction.utilisateur.prenom}`
                        ) : 'N/A'}
                      </td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded ${
                          transaction.statut === 'Validé' ? 'bg-green-100 text-green-800' :
                          transaction.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.statut}
                        </span>
                      </td>
                      <td className="border p-2">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(transaction.id_finance)}
                          color="error"
                          disabled={loading.suppression}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Dialogues de confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
        }}
        confirmText={loading.suppression ? "Suppression..." : "Confirmer"}
        cancelText="Annuler"
      />

      <ConfirmDialog
        isOpen={showDeleteOptions}
        title="Options de suppression"
        message={
          <div className="space-y-4">
            <div>Sélectionnez ce que vous voulez supprimer :</div>
            <div className="flex flex-col space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="deleteOption"
                  value="all"
                  checked={deleteOption === "all"}
                  onChange={() => setDeleteOption("all")}
                />
                <span className="ml-2">Toutes les transactions ({transactions.length})</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="deleteOption"
                  value="filtered"
                  checked={deleteOption === "filtered"}
                  onChange={() => setDeleteOption("filtered")}
                />
                <span className="ml-2">Les transactions filtrées ({filteredTransactions.length})</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="deleteOption"
                  value="date"
                  checked={deleteOption === "date"}
                  onChange={() => setDeleteOption("date")}
                  disabled={!dateDebut || !dateFin}
                />
                <span className="ml-2">
                  Transactions entre {dateDebut || '...'} et {dateFin || '...'}
                </span>
              </label>
            </div>
          </div>
        }
        onConfirm={confirmDeleteSelection}
        onCancel={() => setShowDeleteOptions(false)}
        confirmText={loading.suppression ? "Suppression..." : "Confirmer"}
        cancelText="Annuler"
        fullWidth
      />
    </div>
  );
}