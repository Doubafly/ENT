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

const EmploiDuTempsEnseignant = () => {
  const [emplois, setEmplois] = useState<Emploi[]>([]);
  const [classeSelectionnee, setClasseSelectionnee] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [idEnseignant, setIdEnseignant] = useState<number | null>(null);

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

        if (userData?.user?.enseignant?.id) {
          setIdEnseignant(userData.user.id);
        } else if (userData?.user?.id) {
          setIdEnseignant(userData.user.id);
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
    if (!idEnseignant) return;

    const fetchEmploiDuTemps = async () => {
      try {
        setLoading(true);

        // 1. Récupérer les données enseignant
        const response = await fetch(
          `/api/utilisateurs/enseignants/${idEnseignant}`
        );
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const data = await response.json();

        // 2. Récupérer TOUS les emplois du temps
        const emploiResponse = await fetch("/api/emploisDuTemps");
        if (!emploiResponse.ok) {
          throw new Error("Erreur de chargement des emplois");
        }

        const emploiData = await emploiResponse.json();

        // 3. Filtrer côté client pour ne garder que ceux de l'enseignant
        const emploisFiltres = emploiData.emploisDuTemps.filter(
          (emploi: Emploi) => {
            return (
              emploi.cours?.enseignant?.utilisateur.id_utilisateur ===
              data.enseignant[0].id_utilisateur
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
  }, [idEnseignant]);

  // Extraire les classes uniques enseignées
  const classesEnseignees = emplois.reduce((acc, emploi) => {
    const filiere = emploi.cours.filiere_module.filiere;
    const classeKey = `${filiere.niveau} ${filiere.nom}`;

    if (!acc.some((c) => c.id === filiere.id_filiere)) {
      acc.push({
        id: filiere.id_filiere,
        nom: classeKey,
      });
    }
    return acc;
  }, [] as { id: number; nom: string }[]);

  // Filtrer les emplois par classe sélectionnée
  const emploisFiltres = classeSelectionnee
    ? emplois.filter((emploi) => {
        const filiere = emploi.cours.filiere_module.filiere;
        return `${filiere.niveau} ${filiere.nom}` === classeSelectionnee;
      })
    : emplois;

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

  emploisFiltres.forEach((emploi) => {
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
    <div className="p-4 max-w-7xl mx-auto">
      {/* Titre + Sélecteur en ligne */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-800 underline decoration-indigo-300 underline-offset-8 tracking-wide text-center sm:text-left flex-1 text-wrap">
          Emploi du Temps de la Semaine{" "}
          {classeSelectionnee && `- ${classeSelectionnee}`}
        </h1>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-blue-500 text-white">
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
              <tr
                key={heure}
                className="border-t border-gray-200 hover:bg-indigo-50 transition duration-300"
              >
                <td className="px-4 py-4 font-semibold text-indigo-600 bg-gray-50 border-r border-gray-200 text-md whitespace-nowrap">
                  {heure}
                </td>
                {jours.map((jour) => {
                  const seance = emploiDuTemps[heure]?.[jour];
                  return (
                    <td
                      key={jour}
                      className="px-2 sm:px-4 py-3 text-center align-top border-r border-gray-100"
                    >
                      {seance ? (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-3 py-2 shadow hover:shadow-md transition-all duration-200 ease-in-out">
                          <div className="text-indigo-900 font-bold text-sm sm:text-base mb-1">
                            {seance.matiere}
                          </div>
                          <div className="text-sm text-gray-700">
                            {seance.enseignant}
                          </div>
                          <div className="text-xs text-gray-500 italic mt-1">
                            {seance.salle}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-300 text-sm">–</div>
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

export default EmploiDuTempsEnseignant;
