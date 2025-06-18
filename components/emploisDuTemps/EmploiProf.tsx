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
    Record<string, { matiere: string; salle: string } | null>
  > = {};
  heures.forEach((h) => {
    tableau[h] = {};
    jours.forEach((j) => {
      tableau[h][j] = null;
    });
  });
  return tableau;
};

const EmploiDuTempsEnseignant = ({
  enseignantId,
}: {
  enseignantId: number;
}) => {
  const [emplois, setEmplois] = useState<Emploi[]>([]);
  const [classeSelectionnee, setClasseSelectionnee] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmplois = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/emploisDuTemps?enseignantId=${enseignantId}`
        );
        if (!response.ok) throw new Error("Erreur de chargement des emplois");

        const data = await response.json();
        setEmplois(data.emploisDuTemps || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchEmplois();
  }, [enseignantId]);

  // Extraire les classes uniques enseignées avec leurs IDs
  const classesEnseignees = emplois.reduce((acc, emploi) => {
    const filiere = emploi.cours.filiere_module.filiere;
    const classeKey = `${filiere.niveau} ${filiere.nom}`;
    const classeExistante = acc.find((c) => c.id === filiere.id_filiere);

    if (!classeExistante) {
      acc.push({
        id: filiere.id_filiere,
        nom: classeKey,
      });
    }

    return acc;
  }, [] as { id: number; nom: string }[]);

  // Filtrer les emplois par classe sélectionnée
  const emploisFiltres = classeSelectionnee
    ? emplois.filter(
        (emploi) =>
          `${emploi.cours.filiere_module.filiere.niveau} ${emploi.cours.filiere_module.filiere.nom}` ===
          classeSelectionnee
      )
    : emplois;

  // Créer le tableau d'emploi du temps
  const emploiDuTemps = creerTableauVide();
  emploisFiltres.forEach((emploi) => {
    const heureDebut = new Date(emploi.heure_debut).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const heureFin = new Date(emploi.heure_fin).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const heureKey = `${heureDebut}-${heureFin}`;

    if (emploiDuTemps[heureKey]?.[emploi.jour] !== undefined) {
      emploiDuTemps[heureKey][emploi.jour] = {
        matiere: emploi.cours.filiere_module.module.nom,
        salle: emploi.salle,
      };
    }
  });

  if (loading) return <div className="p-4">Chargement en cours...</div>;
  if (error) return <div className="p-4 text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Mon Emploi du Temps Enseignant</h1>
          <select
            className="flex-1 min-w-[350px] p-3 border rounded-lg text-sm"
            value={classeSelectionnee}
            onChange={(e) => setClasseSelectionnee(e.target.value)}
            disabled={loading}
          >
            <option value="">Toutes mes classes</option>
            {classesEnseignees.map((classe) => (
              <option key={classe.id} value={classe.nom}>
                {classe.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Heure</th>
              {jours.map((jour) => (
                <th key={jour} className="border p-2">
                  {jour}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heures.map((heure) => (
              <tr key={heure} className="hover:bg-gray-50">
                <td className="border p-2 font-medium">{heure}</td>
                {jours.map((jour) => {
                  const seance = emploiDuTemps[heure]?.[jour];
                  return (
                    <td key={jour} className="border p-2 text-center text-sm">
                      {seance ? (
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{seance.matiere}</span>
                          <span className="text-gray-500 text-xs">
                            {seance.salle}
                          </span>
                        </div>
                      ) : null}
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
