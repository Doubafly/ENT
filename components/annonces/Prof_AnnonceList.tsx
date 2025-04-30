import React, { useState, useEffect } from "react";
import AnnonceCard from "@/components/annonces/AnnonceCard";
import AnnonceDetail from "@/components/annonces/AnnonceDetail";

type Annonce = {
  id_annonce: number;
  titre: string;
  contenu: string;
  date_creation: string;
  admin: {
    utilisateur: {
      nom: string;
      prenom: string;
      email: string;
    };
  };
};

const AnnonceList: React.FC = () => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/annonce");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des annonces");
      }
      const data = await response.json();
      console.log("Données récupérées :", data);
         // Trier les annonces par date de création décroissante
         const sortedAnnonces = (data.annonces || []).sort((a: Annonce, b: Annonce) => 
          new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime()
        );
        setAnnonces(sortedAnnonces);
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
    <div className="min-h-screen bg-white p-6">

      <div className="">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
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
              className="mb-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              ← Retour aux annonces
            </button>
            <AnnonceDetail
              titre={selectedAnnonce.titre}
              contenu={selectedAnnonce.contenu}
              date_creation={selectedAnnonce.date_creation}
              id_annonce={selectedAnnonce.id_annonce}
              admin={selectedAnnonce.admin}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(annonces) && annonces.length > 0 ? (
                annonces.map((annonce) => (
                  <div
                    key={annonce.id_annonce}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                  >
                    <AnnonceCard
                      id_annonce={annonce.id_annonce}
                      titre={annonce.titre}
                      contenu={annonce.contenu}
                      date_creation={annonce.date_creation}
                      admin={annonce.admin}
                    />
                    <div className="flex justify-center mt-4">
                      <a
                        
                        onClick={() => setSelectedAnnonce(annonce)}
                        className="text-white bg-blue-600 hover:bg-blue-700 transition duration-300 cursor-pointer px-4 py-2 rounded"
                        
                      >
                        Voir plus
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg">
                  Aucune annonce disponible.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnnonceList;