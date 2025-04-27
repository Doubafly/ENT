import React, { useState, useEffect } from 'react';
import AnnonceCard from '@/components/annonces/AnnonceCard';
import AnnonceDetail from '@/components/annonces/AnnonceDetail';
import { FaSpinner } from 'react-icons/fa';
import { ConfirmDialog } from '../ConfirmDialog';

interface Utilisateur {
  nom: string;
  prenom: string;
  email: string;
}

interface Admin {
  id_admin: number;
  utilisateur: Utilisateur;
}

interface Annonce {
  id_annonce: number;
  titre: string;
  contenu: string;
  date_creation: string;
  admin: Admin;
}

const API_BASE_URL = '/api/annonce';

const AnnonceList: React.FC = () => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    id_admin: 2
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [annonceToDelete, setAnnonceToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchAnnonces = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Erreur de chargement');
      const data = await response.json();
      setAnnonces(data.annonces || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Échec de la requête');
      
      await fetchAnnonces();
      resetForm();
      setSuccessMessage(`Annonce ${editingId ? 'modifiée' : 'créée'} avec succès`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const setupEditForm = (annonce: Annonce) => {
    setFormData({
      titre: annonce.titre,
      contenu: annonce.contenu,
      id_admin: annonce.admin.id_admin
    });
    setEditingId(annonce.id_annonce);
    setIsFormOpen(true);
    setSelectedAnnonce(null);
  };

  const handleDeleteClick = (id: number) => {
    setAnnonceToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!annonceToDelete) return;
    setIsProcessing(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/${annonceToDelete}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) throw new Error('Échec de la suppression');
      
      await fetchAnnonces();
      if (selectedAnnonce?.id_annonce === annonceToDelete) {
        setSelectedAnnonce(null);
      }
      setSuccessMessage('Annonce supprimée avec succès');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
      setAnnonceToDelete(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const resetForm = () => {
    setFormData({ titre: '', contenu: '', id_admin: 2 });
    setIsFormOpen(false);
    setEditingId(null);
  };

  useEffect(() => { fetchAnnonces(); }, []);

  if (isLoading && !annonces.length) {
    return <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin text-2xl text-blue-500" />
    </div>;
  }

  if (error) {
    return <div className="p-4 max-w-7xl mx-auto">
      <div className="bg-red-100 border-l-4 border-red-500 p-4">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={fetchAnnonces}
          className="mt-2 px-3 py-1 bg-red-200 rounded text-sm"
        >
          Réessayer
        </button>
      </div>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-6">📢 Annonces</h1>

      {selectedAnnonce ? (
        <div className="space-y-4">
          <div className="flex justify-between">
            <button 
              onClick={() => setSelectedAnnonce(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Retour
            </button>
            <div className="space-x-2">
              <button
                onClick={() => setupEditForm(selectedAnnonce)}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDeleteClick(selectedAnnonce.id_annonce)}
                className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
          <AnnonceDetail {...selectedAnnonce} />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Liste des annonces</h2>
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Ajouter
            </button>
          </div>

          {isFormOpen && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? "Modifier l'annonce" : "Nouvelle annonce"}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <input
                    value={formData.titre}
                    onChange={(e) => setFormData({...formData, titre: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Contenu *</label>
                  <textarea
                    value={formData.contenu}
                    onChange={(e) => setFormData({...formData, contenu: e.target.value})}
                    rows={5}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border rounded"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.titre || !formData.contenu || isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300"
                  >
                    {isLoading ? 'Envoi...' : editingId ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {annonces.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border text-center">
              <p>Aucune annonce disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {annonces.map((annonce) => (
                <div key={annonce.id_annonce} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <AnnonceCard {...annonce} />
                  <div className="p-4 flex justify-end space-x-3 border-t">
                    <button
                      onClick={() => setSelectedAnnonce(annonce)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Voir plus
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setupEditForm(annonce);
                      }}
                      className="text-yellow-600 hover:text-yellow-800 text-sm"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(annonce.id_annonce);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setAnnonceToDelete(null);
        }}
        confirmText={isProcessing ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
      />
    </div>
  );
};

export default AnnonceList;