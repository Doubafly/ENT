import React, { useState, useEffect } from "react";
import AnnonceCard from "@/components/annonces/AnnonceCard";
import AnnonceDetail from "@/components/annonces/AnnonceDetail";
import { FaSpinner, FaLock, FaSignInAlt } from "react-icons/fa";
import { ConfirmDialog } from "../ConfirmDialog";
import { log } from "util";

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
      email: string;
    };
  };
}

const API_BASE_URL = "/api/annonce";

const AnnonceList: React.FC = () => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [formData, setFormData] = useState({
    titre: "",
    contenu: "",
    id_admin: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [annonceToDelete, setAnnonceToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Vérification de la session via localStorage
  useEffect(() => {
    const checkAdminSession = () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          setSessionChecked(true);
          return;
        }

        const parsedData = JSON.parse(userData);
        if (parsedData?.user?.admin) {
          setCurrentAdminId(parsedData.user.admin.id_admin);
          setFormData((prev) => ({ ...prev, id_admin: parsedData.user.admin.id_admin }));
        }
      } catch (error) {
        console.error("Erreur vérification session:", error);
      } finally {
        setSessionChecked(true);
      }
    };

    checkAdminSession();
  }, []);

  // Récupération des annonces
  const fetchAnnonces = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok) throw new Error("Échec du chargement");

      const data = await response.json();
      // Trier les annonces par date de création décroissante
      const sortedAnnonces = (data.annonces || []).sort(
        (a: Annonce, b: Annonce) =>
          new Date(b.date_creation).getTime() -
          new Date(a.date_creation).getTime()
      );
      setAnnonces(sortedAnnonces);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de la création/modification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentAdminId) {
      setError("Vous devez être connecté en tant qu'admin");
      return;
    }

    setIsLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;

      // Récupérer le token du localStorage
      const userData = localStorage.getItem("user");
      const token = userData ? JSON.parse(userData).token : null;

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          id_admin: currentAdminId,
        }),
      });
      
      if (!response.ok) throw new Error(await response.text());

      await fetchAnnonces();
      resetForm();
      setSuccessMessage(
        `Annonce ${editingId ? "modifiée" : "créée"} avec succès`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleDeleteClick = (id: number, adminId: number) => {
    if (adminId !== currentAdminId) {
      setError("Vous ne pouvez pas supprimer une annonce qui ne vous appartient pas.");
      return;
    }
    setAnnonceToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Gestion de la suppression
  const handleDelete = async () => {
    if (!annonceToDelete || !currentAdminId) return;

    setIsProcessing(true);

    try {
      // Récupérer le token du localStorage
      const userData = localStorage.getItem("user");
      const token = userData ? JSON.parse(userData).token : null;
      console.log(`Token récupéré: ${token}`);
      
      const response = await fetch(`${API_BASE_URL}/${annonceToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Échec de la suppression");

      await fetchAnnonces();
      setSuccessMessage("Annonce supprimée avec succès");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Reset du formulaire
  const resetForm = () => {
    setFormData({ titre: "", contenu: "", id_admin: currentAdminId || 0 });
    setIsFormOpen(false);
    setEditingId(null);
  };

  // Préparation du formulaire d'édition
  const setupEditForm = (annonce: Annonce) => {
    if (annonce.admin.id_admin !== currentAdminId) {
      setError("Vous ne pouvez pas modifier une annonce qui ne vous appartient pas.");
      return;
    }
    setFormData({
      titre: annonce.titre,
      contenu: annonce.contenu,
      id_admin: currentAdminId || 0,
    });
    setEditingId(annonce.id_annonce);
    setIsFormOpen(true);
    setSelectedAnnonce(null);
  };

  // Chargement initial
  useEffect(() => {
    if (sessionChecked) fetchAnnonces();
  }, [sessionChecked]);

  // Affichages de chargement
  if (!sessionChecked || (isLoading && !annonces.length)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-2xl text-blue-500" />
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="bg-red-100 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchAnnonces}
            className="mt-2 px-3 py-1 bg-red-200 rounded text-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-6"> Annonces</h1>

      {!currentAdminId && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 flex items-center gap-3">
          <FaLock className="text-blue-500 text-xl" />
          <div>
            <h3 className="font-medium text-blue-800">Accès restreint</h3>
            <p className="text-blue-600">
              Veuillez vous
              <a
                href="/login"
                className="ml-1 text-blue-700 underline flex items-center"
              >
                connecter <FaSignInAlt className="ml-1" />
              </a>
              pour gérer les annonces
            </p>
          </div>
        </div>
      )}

      {selectedAnnonce ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setSelectedAnnonce(null)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              ← Retour aux annonces
            </button>
            {currentAdminId && (
              <div className="space-x-2">
                <button
                  onClick={() => setupEditForm(selectedAnnonce)}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteClick(selectedAnnonce.id_annonce, selectedAnnonce.admin.id_admin)}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm"
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
          <AnnonceDetail {...selectedAnnonce} />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Liste des annonces</h2>
            {currentAdminId && (
              <button
                onClick={() => {
                  resetForm();
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                + Nouvelle annonce
              </button>
            )}
          </div>

          {isFormOpen && currentAdminId && (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow-md mb-6"
            >
              <h2 className="text-xl font-semibold mb-4">
                {editingId
                  ? "Modifier l'annonce"
                  : "Créer une nouvelle annonce"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Titre *
                  </label>
                  <input
                    value={formData.titre}
                    onChange={(e) =>
                      setFormData({ ...formData, titre: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contenu *
                  </label>
                  <textarea
                    value={formData.contenu}
                    onChange={(e) =>
                      setFormData({ ...formData, contenu: e.target.value })
                    }
                    rows={5}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border rounded bg-red-500 text-white hover:bg-grey-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.titre || !formData.contenu || isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {isLoading
                      ? "Envoi..."
                      : editingId
                      ? "Mettre à jour"
                      : "Publier"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {annonces.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border text-center text-gray-500">
              Aucune annonce à afficher
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {annonces.map((annonce) => (
                <div
                  key={annonce.id_annonce}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <AnnonceCard
                    {...annonce}
                    onViewMore={
                      currentAdminId
                        ? undefined
                        : () => setSelectedAnnonce(annonce)
                    }
                  />
                  {currentAdminId && (
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
                          handleDeleteClick(annonce.id_annonce, annonce.admin.id_admin);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Confirmer la suppression"
        message="Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette annonce ?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText={isProcessing ? "Suppression en cours..." : "Confirmer"}
        cancelText="Annuler"
      />
    </div>
  );
};

export default AnnonceList;