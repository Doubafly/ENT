import React, { useState, useEffect } from "react";
import AnnonceCard from "@/components/annonces/AnnonceCard";
import AnnonceDetail from "@/components/annonces/AnnonceDetail";

type Annonce = {
  id_annonce: number;
  titre: string;
  contenu: string;
  date_creation: string;
  admin: {
    id_admin: number; // Ajout de l'id_admin
    utilisateur: {
      nom: string;
      prenom: string;
      email: string;
    };
  };
};

const AnnonceList: React.FC = () => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]); // Initialisation avec un tableau vide
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les annonces dynamiquement
  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/annonce");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des annonces");
      }
      const data = await response.json();
      console.log("Données récupérées :", data); 
      setAnnonces(data.annonces); // <<< CORRIGÉ ICI
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchAnnonces();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        📢 Annonces
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Chargement des annonces...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : selectedAnnonce ? (
        <div>
          <button
            onClick={() => setSelectedAnnonce(null)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ← Retour aux annonces
          </button>
          <AnnonceDetail
            titre={selectedAnnonce.titre}
            contenu={selectedAnnonce.contenu}
            date_creation={selectedAnnonce.date_creation}
            id_annonce={selectedAnnonce.id_annonce}
            admin={selectedAnnonce.admin} // Accès à l'utilisateur
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded shadow-md">
            {Array.isArray(annonces) && annonces.length > 0 ? (
              annonces.map((annonce) => (
                <div key={annonce.id_annonce} className="cursor-pointer p-4">
                  <AnnonceCard
                    id_annonce={annonce.id_annonce}
                    titre={annonce.titre}
                    contenu={annonce.contenu}
                    date_creation={annonce.date_creation}
                    admin={annonce.admin} // Accès à l'utilisateur
                  />
                  <div className="flex justify-end space-x-4 mt-2">
                    <a
                      href="#"
                      onClick={() => setSelectedAnnonce(annonce)}
                      className="text-blue-600 underline"
                    >
                      Voir plus
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Aucune annonce disponible.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AnnonceList;