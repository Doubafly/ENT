import React, { useState, useEffect } from "react";

interface Emploi {
  id_emploi: number;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  salle: string;
  cours: {
    id_cours: number;
    filiere_module: {
      filiere: {
        id_filiere: number;
        nom: string;
        niveau: string;
      };
      module: {
        id_module: number;
        nom: string;
      };
    };
    enseignant: {
      id_enseignant: number;
      utilisateur: {
        id_utilisateur: number;
        nom: string;
        prenom: string;
      };
    };
  };
}

const heures = ["08:00-10:00", "10:30-12:30", "12:30-14:30", "17:00-20:00"];
const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const creerTableauVide = () => {
  const tableau: Record<
    string,
    Record<
      string,
      {
        matiere: string;
        enseignant: string;
        salle: string;
      } | null
    >
  > = {};

  heures.forEach((h) => {
    tableau[h] = {};
    jours.forEach((j) => {
      tableau[h][j] = null;
    });
  });
  return tableau;
};

const EmploiDuTempsEtudiant = () => {
  const [emplois, setEmplois] = useState<Emploi[]>([]);
  const [classeEtudiant, setClasseEtudiant] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [idEtudiant, setIdEtudiant] = useState<number | null>(null);

  useEffect(() => {
    const getUserData = () => {
      try {
        const userDataString = localStorage.getItem("user");
        if (!userDataString) {
          throw new Error(
            "Aucune donnée utilisateur trouvée dans le localStorage"
          );
        }

        const userData = JSON.parse(userDataString);
        console.log("Données complètes du localStorage:", userData);

        // Vérification approfondie de la structure
        if (userData?.user?.etudiant?.id) {
          console.log("ID étudiant trouvé:", userData.user.etudiant.id);
          setIdEtudiant(userData.user.etudiant.id);
        } else if (userData?.user?.id) {
          console.log("ID utilisateur trouvé:", userData.user.id);
          setIdEtudiant(userData.user.id);
        } else {
          throw new Error("Structure des données utilisateur inattendue");
        }
      } catch (err) {
        console.error("Erreur de lecture du localStorage:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (!idEtudiant) return;

    const fetchEmploiDuTemps = async () => {
      try {
        setLoading(true);

        // 1. Récupérer les données étudiant
        const response = await fetch(
          `/api/utilisateurs/etudiants/${idEtudiant}`
        );
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const data = await response.json();
        console.log("Réponse API étudiant:", data.etudiants[0].filiere.id_filiere);

        if (!data.etudiants?.[0]?.filiere) {
          throw new Error("Données de filière manquantes");
        }

        const filiere = data.etudiants[0].filiere;
        setClasseEtudiant(`${filiere.niveau} ${filiere.nom}`);

        // 2. Récupérer TOUS les emplois du temps
        const emploiResponse = await fetch("/api/emploisDuTemps");
        if (!emploiResponse.ok)
          throw new Error("Erreur de chargement des emplois");

        const emploiData = await emploiResponse.json();
        console.log("Tous les emplois:", emploiData);

        // 3. Filtrer côté client pour ne garder que ceux de la filière
        const emploisFiltres = emploiData.emploisDuTemps.filter(
          (emploi: Emploi) => {
            return (
              emploi.cours?.filiere_module?.filiere?.id_filiere ===data.etudiants[0].filiere.id_filiere
            );
          }
        );

        console.log("Emplois filtrés:", emploisFiltres);
        setEmplois(emploisFiltres);
      } catch (err) {
        console.error("Erreur fetch:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchEmploiDuTemps();
  }, [idEtudiant]);

  const formatHeureAffichage = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      console.warn("Format de date invalide:", dateTime);
      return "00:00";
    }
  };

  // Préparer les données pour l'affichage
  const emploiDuTemps = creerTableauVide();

  emplois.forEach((emploi) => {
    try {
      const heureDebut = formatHeureAffichage(emploi.heure_debut);
      const heureFin = formatHeureAffichage(emploi.heure_fin);
      const heureKey = `${heureDebut}-${heureFin}`;

      if (emploiDuTemps[heureKey]?.[emploi.jour] !== undefined) {
        emploiDuTemps[heureKey][emploi.jour] = {
          matiere: emploi.cours.filiere_module.module.nom,
          enseignant: `${emploi.cours.enseignant.utilisateur.prenom} ${emploi.cours.enseignant.utilisateur.nom}`,
          salle: emploi.salle,
        };
      }
    } catch (err) {
      console.error("Erreur de traitement de l'emploi:", emploi, err);
    }
  });

  if (loading) {
    return <div className="p-4 text-center">Chargement en cours...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold">Erreur</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Mon Emploi du Temps {classeEtudiant && `- ${classeEtudiant}`}
      </h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left min-w-[120px]">Heure</th>
              {jours.map((jour) => (
                <th key={jour} className="p-3 text-center min-w-[150px]">
                  {jour}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heures.map((heure) => (
              <tr key={heure} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{heure}</td>
                {jours.map((jour) => {
                  const seance = emploiDuTemps[heure]?.[jour];
                  return (
                    <td key={jour} className="p-3">
                      {seance ? (
                        <div className="flex flex-col items-center text-center">
                          <span className="font-medium text-gray-800">
                            {seance.matiere}
                          </span>
                          <span className="text-sm text-gray-600">
                            {seance.enseignant}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {seance.salle}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmploiDuTempsEtudiant;
