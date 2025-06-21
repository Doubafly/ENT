"use client";
import React, { useState, useEffect } from "react";
import { FaTrash, FaUndo, FaSpinner, FaFilter, FaCalendarAlt } from "react-icons/fa";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface Annonce {
  id_annonce: number;
  titre: string;
  contenu: string;
  date_creation: string;
  admin: {
    id_admin: number;
    utilisateur: {
      nom: string;
      prenom: string;
    };
  };
}

const API_BASE_URL = "/api/annonce";

const Corbeille: React.FC = () => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState<Annonce[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Filtres
  const [dateDebut, setDateDebut] = useState<string>("");
  const [dateFin, setDateFin] = useState<string>("");
  const [anciennete, setAnciennete] = useState<string>("");

  // Récupération des annonces
  const fetchAnnonces = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error("Échec du chargement");

      const data = await response.json();
      setAnnonces(data.annonces || []);
      setFilteredAnnonces(data.annonces || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  // Appliquer les filtres
  const applyFilters = () => {
    let filtered = [...annonces];

    // Filtre par date
    if (dateDebut && dateFin) {
      filtered = filtered.filter(annonce => {
        const annonceDate = new Date(annonce.date_creation);
        return annonceDate >= new Date(dateDebut) && annonceDate <= new Date(dateFin);
      });
    }

    // Filtre par ancienneté
    if (anciennete) {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch(anciennete) {
        case "1mois":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "3mois":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "6mois":
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case "1an":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(annonce => {
        return new Date(annonce.date_creation) < cutoffDate;
      });
    }

    setFilteredAnnonces(filtered);
  };

  // Gestion de la sélection
  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredAnnonces.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAnnonces.map(a => a.id_annonce));
    }
  };

  // Suppression des annonces sélectionnées
const handleDeleteSelected = async () => {
  if (selectedIds.length === 0) return;
  setIsProcessing(true);

  try {
    // Utilisation de l'endpoint DELETE standard avec les IDs dans le body
    const response = await fetch(API_BASE_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedIds }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Échec de la suppression");
    }

    await fetchAnnonces();
    setSelectedIds([]);
    setSuccessMessage(`${selectedIds.length} annonce(s) supprimée(s) avec succès`);
  } catch (err) {
    console.error("Erreur suppression:", err);
    setError(err instanceof Error ? err.message : "Erreur inconnue");
  } finally {
    setIsProcessing(false);
    setShowDeleteConfirm(false);
    setTimeout(() => setSuccessMessage(null), 3000);
  }
};

  // Restaurer une annonce
  const handleRestore = async (id: number) => {
    setIsProcessing(true);
    try {
      // Implémentez la logique de restauration si nécessaire
      // Pour l'exemple, nous allons simplement la supprimer de la corbeille
      await fetchAnnonces();
      setSuccessMessage("Annonce restaurée avec succès");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Effacer tous les filtres
  const clearFilters = () => {
    setDateDebut("");
    setDateFin("");
    setAnciennete("");
    setFilteredAnnonces(annonces);
  };

  // Chargement initial
  useEffect(() => {
    fetchAnnonces();
  }, []);

  // Application des filtres quand ils changent
  useEffect(() => {
    applyFilters();
  }, [dateDebut, dateFin, anciennete, annonces]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
       Corbeille des Annonces
      </h1>

      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchAnnonces}
            className="mt-2 px-3 py-1 bg-red-200 rounded text-sm"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h3 className="font-medium flex items-center gap-2">
            <FaFilter /> Filtres
          </h3>
          
          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>Date :</span>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="border p-1 rounded"
            />
            <span>à</span>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="border p-1 rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <span>Ancienneté :</span>
            <select
              value={anciennete}
              onChange={(e) => setAnciennete(e.target.value)}
              className="border p-1 rounded"
            >
              <option value="">Toutes</option>
              <option value="1mois">Plus d'1 mois</option>
              <option value="3mois">Plus de 3 mois</option>
              <option value="6mois">Plus de 6 mois</option>
              <option value="1an">Plus d'1 an</option>
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="ml-auto px-3 py-1 bg-gray-200 rounded text-sm flex items-center gap-1"
          >
            <FaUndo size={12} /> Effacer
          </button>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex justify-between items-center bg-yellow-50 p-3 rounded border border-yellow-200">
            <span>{selectedIds.length} annonce(s) sélectionnée(s)</span>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm flex items-center gap-1"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaTrash size={12} />
              )}
              Supprimer la sélection
            </button>
          </div>
        )}
      </div>

      {/* Liste des annonces */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : filteredAnnonces.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border text-center text-gray-500">
          Aucune annonce à afficher
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredAnnonces.length && filteredAnnonces.length > 0}
                    onChange={selectAll}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-mediumuppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Auteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAnnonces.map((annonce) => (
                <tr key={annonce.id_annonce} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(annonce.id_annonce)}
                      onChange={() => toggleSelect(annonce.id_annonce)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{annonce.titre}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {annonce.contenu}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(annonce.date_creation).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {annonce.admin.utilisateur.prenom} {annonce.admin.utilisateur.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestore(annonce.id_annonce)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        disabled={isProcessing}
                      >
                        <FaUndo size={12} /> Restaurer
                      </button>
                      <button
                        onClick={() => {
                          setSelectedIds([annonce.id_annonce]);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        disabled={isProcessing}
                      >
                        <FaTrash size={12} /> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer ${selectedIds.length} annonce(s) ? Cette action est irréversible.`}
        onConfirm={handleDeleteSelected}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText={isProcessing ? "Suppression en cours..." : "Confirmer"}
        cancelText="Annuler"
      />
    </div>
  );
};

export default Corbeille;