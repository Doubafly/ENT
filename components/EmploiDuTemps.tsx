import React, { useState, useEffect } from 'react';
import Modal from './modal/Modal';

type Seance = {
  id_emploi?: number;
  matiere: string;
  enseignant: string;
  salle: string;
};

type EmploiDuTempsType = Record<string, Record<string, Seance | null>>;

const heures = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00'];
const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const creerTableauVide = (): EmploiDuTempsType => {
  const tableau: EmploiDuTempsType = {};
  heures.forEach(h => {
    tableau[h] = {};
    jours.forEach(j => {
      tableau[h][j] = null;
    });
  });
  return tableau;
};

const EmploiDuTemps = () => {
  const [emploiDuTemps, setEmploiDuTemps] = useState<EmploiDuTempsType>(creerTableauVide);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [matiere, setMatiere] = useState('');
  const [enseignant, setEnseignant] = useState('');
  const [salle, setSalle] = useState('');
  const [jour, setJour] = useState('');
  const [heure, setHeure] = useState('');
  const [selectedCell, setSelectedCell] = useState<{ jour: string; heure: string; id_emploi?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [classe, setClasse] = useState('');

  useEffect(() => {
    const chargerDonneesInitiales = async () => {
      setLoading(true);
      try {
        const classesResponse = await fetch('/api/cours');
        if (!classesResponse.ok) throw new Error('Erreur de chargement des classes');
        const classesData = await classesResponse.json();
        setClasses(classesData.classes);
      } catch (err: unknown) {
        setError("Erreur lors du chargement initial des données");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    chargerDonneesInitiales();
  }, []);

  useEffect(() => {
    if (classe) {
      chargerEmploiDuTemps(classe);
    }
  }, [classe]);

  const chargerEmploiDuTemps = async (classeSelectionnee: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/emploisDuTemps?classe=${classeSelectionnee}`);
      if (!response.ok) throw new Error('Erreur de chargement');

      const data = await response.json();
      const edt = creerTableauVide();

      data.emploisDuTemps.forEach((emploi: any) => {
        const heureDebut = new Date(emploi.heure_debut).toTimeString().substring(0, 5);
        const heureFin = new Date(emploi.heure_fin).toTimeString().substring(0, 5);
        const heureKey = `${heureDebut}-${heureFin}`;

        if (edt[heureKey]) {
          edt[heureKey][emploi.jour] = {
            id_emploi: emploi.id_emploi,
            matiere: emploi.cours.filiere_module.module.nom,
            enseignant: `${emploi.cours.enseignant.utilisateur.prenom} ${emploi.cours.enseignant.utilisateur.nom}`,
            salle: emploi.salle,
          };
        }
      });

      setEmploiDuTemps(edt);
    } catch (err: unknown) {
      setError("Erreur lors du chargement de l'emploi du temps");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClasse = e.target.value;
    setClasse(selectedClasse);
  };

  const handleCellClick = (jour: string, heure: string) => {
    const seance = emploiDuTemps[heure]?.[jour];
    setJour(jour);
    setHeure(heure);
    setMatiere(seance?.matiere || '');
    setEnseignant(seance?.enseignant || '');
    setSalle(seance?.salle || '');
    setSelectedCell({ jour, heure, id_emploi: seance?.id_emploi });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classe) return;

    try {
      setLoading(true);

      const [heureDebut, heureFin] = heure.split('-');
      const heure_debut = new Date(`1970-01-01T${heureDebut}:00`);
      const heure_fin = new Date(`1970-01-01T${heureFin}:00`);

      const payload = {
        id_cours: 1, // À remplacer
        jour,
        heure_debut,
        heure_fin,
        salle,
      };

      const url = selectedCell?.id_emploi
        ? `/api/emploisDuTemps/${selectedCell.id_emploi}`
        : '/api/emploisDuTemps';

      const method = selectedCell?.id_emploi ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      await chargerEmploiDuTemps(classe);
      setShowForm(false);
    } catch (err: unknown) {
      setError("Erreur lors de la sauvegarde des données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const supprimerSeance = async () => {
    if (!selectedCell?.id_emploi) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/emploisDuTemps/${selectedCell.id_emploi}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      await chargerEmploiDuTemps(classe);
      setShowForm(false);
      setSelectedCell(null);
    } catch (err: unknown) {
      setError("Erreur lors de la suppression");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Emploi du Temps</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-4 ml-6">
        <input
          type="text"
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 p-3 border rounded-lg text-sm"
        />

        <select
          className="w-1/3 p-3 border rounded-lg text-sm"
          value={classe}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">Sélectionner une classe</option>
          {classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button
          onClick={() => setShowForm(true)}
          disabled={loading}
          className="p-3 border rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
        >
          + Ajouter
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Chargement en cours...</p>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                <th className="border p-2">Heure</th>
                {jours.map((jour) => (
                  <th key={jour} className="border p-2">{jour}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heures.map((heureStr) => (
                <tr key={heureStr}>
                  <td className="border p-2 font-medium">{heureStr}</td>
                  {jours.map((jour) => {
                    const seance = emploiDuTemps[heureStr]?.[jour];
                    const match = searchTerm
                      ? seance?.enseignant?.toLowerCase().includes(searchTerm.toLowerCase())
                      : true;

                    return (
                      <td
                        key={`${jour}-${heureStr}`}
                        className="border p-2 text-center text-sm hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleCellClick(jour, heureStr)}
                      >
                        {match && seance ? (
                          <>
                            <div className="font-semibold">{seance.matiere}</div>
                            <div className="text-xs">{seance.enseignant}</div>
                            <div className="text-xs">{seance.salle}</div>
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
      )}

      {showForm && (
        <Modal
          matiere={matiere}
          enseignant={enseignant}
          salle={salle}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          onDelete={supprimerSeance}
          setMatiere={setMatiere}
          setEnseignant={setEnseignant}
          setSalle={setSalle}
          isEditing={!!selectedCell?.id_emploi}
        />
      )}
    </div>
  );
};

export default EmploiDuTemps;
