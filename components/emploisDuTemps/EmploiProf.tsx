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
          throw new Error("Aucune donnée utilisateur trouvée dans le localStorage");
        }

        const userData = JSON.parse(userDataString);
        console.log("Données complètes du localStorage:", userData);

        if (userData?.user?.enseignant?.id) {
          console.log("ID enseignant trouvé:", userData.user.enseignant.id);
          setIdEnseignant(userData.user.enseignant.id);
        } else if (userData?.user?.id) {
          console.log("ID utilisateur trouvé:", userData.user.id);
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
        const response = await fetch(`/api/utilisateurs/enseignants/${idEnseignant}`);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const data = await response.json();
        console.log("Réponse API enseignant:", data.enseignant[0].id);

        // 2. Récupérer TOUS les emplois du temps
        const emploiResponse = await fetch("/api/emploisDuTemps");
        if (!emploiResponse.ok) {
          throw new Error("Erreur de chargement des emplois");
        }

        const emploiData = await emploiResponse.json();
        console.log("Tous les emplois:", emploiData);

        
        // 3. Filtrer côté client pour ne garder que ceux de l'enseignant
        const emploisFiltres = emploiData.emploisDuTemps.filter(
          (emploi: Emploi) => {
            return emploi.cours?.enseignant?.utilisateur.id_utilisateur === data.enseignant[0].id;
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
    
    if (!acc.some(c => c.id === filiere.id_filiere)) {
      acc.push({
        id: filiere.id_filiere,
        nom: classeKey
      });
    }
    return acc;
  },
   [] as { id: number; nom: string }[]);
   console.log("Classes enseignées:", classesEnseignees);
   

  // Filtrer les emplois par classe sélectionnée
  const emploisFiltres = classeSelectionnee
    ? emplois.filter(emploi => {
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
    <h1 className="text-3xl font-bold mb-6 text-center text-blue-800 underline decoration-blue-300 underline-offset-8">
  Emploi du Temps de la Semaine
</h1>


    <div className="mb-4">
  <select
    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={classeSelectionnee}
    onChange={(e) => setClasseSelectionnee(e.target.value)}
  >
    <option value="">Toutes mes classes</option>
    {classesEnseignees.map((classe) => (
      <option key={classe.id} value={classe.nom}>
        {classe.nom}
      </option>
    ))}
  </select>
</div>


    <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
  <table className="min-w-full table-auto text-base text-gray-700">
    <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-800 text-md uppercase">
      <tr>
        <th className="px-6 py-4 text-left border-r border-gray-300">Heure</th>
        {jours.map((jour) => (
          <th key={jour} className="px-6 py-4 text-center border-r border-gray-300">
            {jour}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {heures.map((heure) => (
        <tr key={heure} className="border-t border-gray-200 hover:bg-gray-50 transition">
          <td className="px-6 py-4 font-bold text-blue-600 bg-gray-50 border-r border-gray-200 text-lg">
            {heure}
          </td>
          {jours.map((jour) => {
            const seance = emploiDuTemps[heure]?.[jour];
            return (
              <td key={jour} className="px-6 py-4 text-center align-top border-r border-gray-100">
                {seance ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-lg transition duration-200 ease-in-out">
                    <div className="text-blue-900 font-semibold text-lg mb-1">
                      {seance.matiere}
                    </div>
                    <div className="text-sm text-gray-700">{seance.enseignant}</div>
                    <div className="text-xs text-gray-500 italic mt-1">{seance.salle}</div>
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