import React, { useState, useEffect } from 'react';
import Modal from './modal/Modal';

// Données simulées
const heures = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00'];
const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const classes = ['L1 AP', 'L1 IG', 'L1 FC', 'L2 AP', 'L2 IG', 'L2 FC'];

const emploisSimules: Record<string, { jour: string; heure: string; matiere: string; enseignant: string; salle: string }[]> = {
  'L1 AP': [
    { jour: 'Lundi', heure: '08:00-09:00', matiere: 'Maths', enseignant: 'M. Dupont', salle: 'Salle 101' },
    { jour: 'Mardi', heure: '09:00-10:00', matiere: 'Français', enseignant: 'Mme Martin', salle: 'Salle 102' },
    { jour: 'Mercredi', heure: '10:00-11:00', matiere: 'Histoire', enseignant: 'M. Durand', salle: 'Salle 103' },
    { jour: 'Jeudi', heure: '11:00-12:00', matiere: 'SVT', enseignant: 'Mme Martin', salle: 'Salle 101' },
    { jour: 'Vendredi', heure: '08:00-09:00', matiere: 'Anglais', enseignant: 'M. Dupont', salle: 'Salle 102' },
  ],
  'L1 IG': [
    { jour: 'Mercredi', heure: '10:00-11:00', matiere: 'SVT', enseignant: 'Mme Martin', salle: 'Salle 101' },
    { jour: 'Jeudi', heure: '11:00-12:00', matiere: 'Anglais', enseignant: 'M. Dupont', salle: 'Salle 102' },
  ],
};

const creerTableauVide = (): Record<string, Record<string, { matiere: string; enseignant: string; salle: string } | null>> => {
  const tableau: Record<string, Record<string, { matiere: string; enseignant: string; salle: string } | null>> = {};
  heures.forEach(h => {
    tableau[h] = {};
    jours.forEach(j => {
      tableau[h][j] = null;
    });
  });
  return tableau;
};

const EmploiDuTemps = () => {
  const [classe, setClasse] = useState('');
  const [emploiDuTemps, setEmploiDuTemps] = useState(() => creerTableauVide());
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [matiere, setMatiere] = useState('');
  const [enseignant, setEnseignant] = useState('');
  const [salle, setSalle] = useState('');
  const [jour, setJour] = useState('');
  const [heure, setHeure] = useState('');
  const [selectedCell, setSelectedCell] = useState<{
    jour: string;
    heure: string;
  } | null>(null);
  


  
  // Ouverture du modal de modification
  const handleCellClick = (jour: string, heure: string) => {
    const seance = emploiDuTemps[heure]?.[jour];
    if (seance) {
      setJour(jour);
      setHeure(heure);
      setMatiere(seance.matiere);
      setEnseignant(seance.enseignant);
      setSalle(seance.salle);
    } else {
      setJour(jour);
      setHeure(heure);
      setMatiere('');
      setEnseignant('');
      setSalle('');
    }
    setSelectedCell({ jour, heure });
    setShowForm(true);
  };
  
  // Suppression d'une séance
  const supprimerSeance = () => {
    if (!classe || !selectedCell) return;
    emploisSimules[classe] = emploisSimules[classe]?.filter(
      (s) =>
        !(s.jour === selectedCell.jour && s.heure === selectedCell.heure)
    );
    chargerEmploiDuTemps(classe);
    setShowForm(false);
    setSelectedCell(null);
  };
  

  

  useEffect(() => {
    setEmploiDuTemps(creerTableauVide());
  }, []);

  const chargerEmploiDuTemps = (classeSelectionnee: string) => {
    const edt = creerTableauVide();
    const seances = emploisSimules[classeSelectionnee] || [];

    seances.forEach(({ jour, heure, matiere, enseignant, salle }) => {
      edt[heure][jour] = { matiere, enseignant, salle };
    });

    setEmploiDuTemps(edt);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClasse = e.target.value;
    setClasse(selectedClasse);
    chargerEmploiDuTemps(selectedClasse);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classe) return;

    const nouvelleSeance = { jour, heure, matiere, enseignant, salle };
    emploisSimules[classe] = emploisSimules[classe] || [];
    emploisSimules[classe].push(nouvelleSeance);
    chargerEmploiDuTemps(classe);
    setShowForm(false);

    // Reset form
    setJour('');
    setHeure('');
    setMatiere('');
    setEnseignant('');
    setSalle('');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Emploi du Temps</h1>

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
        >
          <option value="">Sélectionner une classe</option>
          {classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button
          onClick={() => setShowForm(true)}
          className="w-1/10 p-3 border rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 transition duration-200"
        >
          + Ajouter
        </button>
      </div>

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
            {heures.map((heure) => (
              <tr key={heure}>
                <td className="border p-2 font-medium">{heure}</td>
                {jours.map((jour) => {
                  const seance = emploiDuTemps[heure]?.[jour];
                  const match = searchTerm
                    ? seance?.enseignant?.toLowerCase().includes(searchTerm.toLowerCase())
                    : true;

                  return (
                    <td key={jour} className="border p-2 text-center text-sm"   onClick={() => handleCellClick(jour, heure)}>
                      {seance && match ? (
                        <>
                          <div className="font-medium">{seance.matiere}</div>
                          <div className="text-gray-600 text-xs">{seance.enseignant}</div>
                          <div className="text-gray-500 text-xs italic">{seance.salle}</div>
                        </>
                      ) : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
            <h2 className="text-lg font-bold mb-4">Ajouter une séance</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Jour</label>
                <select value={jour} onChange={(e) => setJour(e.target.value)} className="w-full p-2 border rounded-lg">
                  <option value="">Sélectionner un jour</option>
                  {jours.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Heure</label>
                <select value={heure} onChange={(e) => setHeure(e.target.value)} className="w-full p-2 border rounded-lg">
                  <option value="">Sélectionner une heure</option>
                  {heures.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Matière</label>
                <input
                  type="text"
                  value={matiere}
                  onChange={(e) => setMatiere(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ex: Maths"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Enseignant</label>
                <input
                  type="text"
                  value={enseignant}
                  onChange={(e) => setEnseignant(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ex: M. Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Salle</label>
                <input
                  type="text"
                  value={salle}
                  onChange={(e) => setSalle(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ex: Salle 101"
                />
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Ajouter
              </button>
              {selectedCell && (
  <button
    type="button"
    onClick={supprimerSeance}
    className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 mt-2"
  >
    Supprimer la séance
  </button>
)}

            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmploiDuTemps;
