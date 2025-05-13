import React, { useState, useEffect } from 'react';

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
        nom: string;
        niveau: string;
      };
      module: {
        nom: string;
      };
    };
    enseignant: {
      id_enseignant: number;
      utilisateur: {
        nom: string;
        prenom: string;
      };
    };
  };
}

const heures = ['08:00-10:00', '10:30-12:30', '12:30-14:30', '17:00-20:00'];
const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const creerTableauVide = () => {
  const tableau: Record<string, Record<string, { matiere: string; enseignant: string; salle: string } | null>> = {};
  heures.forEach(h => {
    tableau[h] = {};
    jours.forEach(j => {
      tableau[h][j] = null;
    });
  });
  return tableau;
};

const EmploiDuTempsEtudiant = ({ classeEtudiant }: { classeEtudiant: string }) => {
  const [emplois, setEmplois] = useState<Emploi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/emploisDuTemps');
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        setEmplois(data.emploisDuTemps);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Formater pour l'affichage
  const formatHeureAffichage = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '00:00';
    }
  };

  // Filtrer et organiser les emplois pour cette classe
  const [niveau, nomFiliere] = classeEtudiant.split(' ');
  const emploiDuTemps = creerTableauVide();
  
  emplois
    .filter(emploi => 
      emploi.cours.filiere_module.filiere.niveau === niveau &&
      emploi.cours.filiere_module.filiere.nom === nomFiliere
    )
    .forEach((emploi) => {
      const heureDebut = formatHeureAffichage(emploi.heure_debut);
      const heureFin = formatHeureAffichage(emploi.heure_fin);
      const heureKey = `${heureDebut}-${heureFin}`;

      if (emploiDuTemps[heureKey]?.[emploi.jour] !== undefined) {
        emploiDuTemps[heureKey][emploi.jour] = {
          matiere: emploi.cours.filiere_module.module.nom,
          enseignant: `${emploi.cours.enseignant.utilisateur.prenom} ${emploi.cours.enseignant.utilisateur.nom}`,
          salle: emploi.salle
        };
      }
    });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Mon Emploi du Temps - {classeEtudiant}</h1>
      </div>

      <div className="overflow-auto">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr>
              <th className="border p-2">Heure</th>
              {jours.map(jour => (
                <th key={jour} className="border p-2">{jour}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heures.map(heure => (
              <tr key={heure}>
                <td className="border p-2 font-medium">{heure}</td>
                {jours.map(jour => {
                  const seance = emploiDuTemps[heure]?.[jour];
                  return (
                    <td key={jour} className="border p-2 text-center text-sm">
                      {seance ? (
                        <>
                          <div className="font-medium">{seance.matiere}</div>
                          <div className="text-gray-600 text-xs">
                            {seance.enseignant}
                          </div>
                          <div className="text-gray-500 text-xs italic">
                            {seance.salle}
                          </div>
                        </>
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

export default EmploiDuTempsEtudiant;