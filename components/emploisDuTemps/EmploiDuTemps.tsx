import React, { useState, useEffect } from 'react';
import Modal from '../modal/Modal';

interface Emploi {
  id_emploi: number;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  salle: string;
  cours: {
    id_cours: number;
    semestre: string;
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

const EmploiDuTemps = () => {
  const [classe, setClasse] = useState('');
  const [emploiDuTemps, setEmploiDuTemps] = useState(creerTableauVide());
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    matiere: '',
    enseignant: '',
    salle: '',
    jour: '',
    heure: '',
    id_cours: '',
    id_emploi: null as number | null
  });
  const [selectedCell, setSelectedCell] = useState<{ jour: string; heure: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emplois, setEmplois] = useState<Emploi[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [coursOptions, setCoursOptions] = useState<{ id: number; label: string }[]>([]);
  const [mode, setMode] = useState<'create' | 'edit' | null>(null);

  // Charger les données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError('');

        const emploisResponse = await fetch('/api/emploisDuTemps');
        if (!emploisResponse.ok) throw new Error('Erreur de chargement des emplois');
        const emploisData = await emploisResponse.json();
        setEmplois(emploisData.emploisDuTemps);

        const filieres = new Set<string>();
        emploisData.emploisDuTemps.forEach((e: Emploi) => {
          const f = e.cours?.filiere_module?.filiere;
          if (f) filieres.add(`${f.niveau} ${f.nom}`);
        });
        setClasses(Array.from(filieres));

        const coursResponse = await fetch('/api/cours');
        if (coursResponse.ok) {
          const coursData = await coursResponse.json();
          if (Array.isArray(coursData?.cours)) {
            setCoursOptions(coursData.cours.map((c: any) => ({
              id: c.id_cours,
              label: `${c.filiere_module?.module?.nom || 'Inconnu'} - ${c.enseignant?.utilisateur?.prenom || ''} ${c.enseignant?.utilisateur?.nom || ''}`
            })));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    chargerEmploiDuTemps(classe);
  }, [emplois, classe]);

  const formatHeureAffichage = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '00:00';
    }
  };

  const chargerEmploiDuTemps = (classeSelectionnee: string) => {
    if (!classeSelectionnee) return setEmploiDuTemps(creerTableauVide());

    const [niveau, nomFiliere] = classeSelectionnee.split(' ');
    const edt = creerTableauVide();

    emplois.forEach((emploi) => {
      if (emploi.cours?.filiere_module?.filiere?.niveau === niveau &&
          emploi.cours?.filiere_module?.filiere?.nom === nomFiliere) {
        const heureDebut = formatHeureAffichage(emploi.heure_debut);
        const heureFin = formatHeureAffichage(emploi.heure_fin);
        const heureKey = `${heureDebut}-${heureFin}`;

        if (edt[heureKey]?.[emploi.jour] !== undefined) {
          edt[heureKey][emploi.jour] = {
            matiere: emploi.cours.filiere_module.module.nom,
            enseignant: `${emploi.cours.enseignant?.utilisateur?.prenom || ''} ${emploi.cours.enseignant?.utilisateur?.nom || ''}`,
            salle: emploi.salle
          };
        }
      }
    });

    setEmploiDuTemps(edt);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClasse = e.target.value;
    setClasse(selectedClasse);
  };

  const handleCellClick = (jour: string, heure: string) => {
    const seance = emploiDuTemps[heure]?.[jour];

    if (seance) {
      // Mode édition
      const [niveau, nomFiliere] = classe.split(' ');
      const [heureDebut] = heure.split('-');
      
      const emploiComplet = emplois.find(e => 
        e.jour === jour &&
        formatHeureAffichage(e.heure_debut) === heureDebut &&
        e.cours.filiere_module.filiere.niveau === niveau &&
        e.cours.filiere_module.filiere.nom === nomFiliere
      );

      setFormData({
        jour,
        heure,
        matiere: seance.matiere,
        enseignant: seance.enseignant,
        salle: seance.salle,
        id_cours: emploiComplet?.cours.id_cours.toString() || '',
        id_emploi: emploiComplet?.id_emploi || null
      });
      setMode('edit');
    } else {
      // Mode création
      setFormData({
        jour,
        heure,
        matiere: '',
        enseignant: '',
        salle: '',
        id_cours: '',
        id_emploi: null
      });
      setMode('create');
    }

    setSelectedCell({ jour, heure });
    setShowForm(true);
  };

  const handleAddClick = () => {
    if (!classe) {
      setError('Veuillez sélectionner une classe');
      return;
    }
    setFormData({
      jour: '',
      heure: '',
      matiere: '',
      enseignant: '',
      salle: '',
      id_cours: '',
      id_emploi: null
    });
    setMode('create');
    setSelectedCell(null);
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      if (!formData.jour || !formData.heure || !formData.matiere) {
        throw new Error('Tous les champs obligatoires doivent être remplis');
      }

      const [heureDebut, heureFin] = formData.heure.split('-');
      const coursSelectionne = coursOptions.find(c => c.label.includes(formData.matiere));
      if (!coursSelectionne) throw new Error('Cours non trouvé');

      const emploiData = {
        id_cours: coursSelectionne.id,
        jour: formData.jour,
        heure_debut: new Date(`1970-01-01T${heureDebut}:00`).toISOString(),
        heure_fin: new Date(`1970-01-01T${heureFin}:00`).toISOString(),
        salle: formData.salle
      };

      // Mise à jour optimiste de l'état local
      const newEmploi = {
        id_emploi: formData.id_emploi || Math.floor(Math.random() * 10000), // ID temporaire si création
        jour: formData.jour,
        heure_debut: emploiData.heure_debut,
        heure_fin: emploiData.heure_fin,
        salle: formData.salle,
        cours: {
          id_cours: coursSelectionne.id,
          semestre: '', // Ajoutez la valeur appropriée ici si disponible
          filiere_module: {
            filiere: {
              niveau: classe.split(' ')[0],
              nom: classe.split(' ')[1]
            },
            module: {
              nom: formData.matiere
            }
          },
          enseignant: {
            utilisateur: {
              nom: formData.enseignant.split(' ')[1] || '',
              prenom: formData.enseignant.split(' ')[0] || ''
            }
          }
        }
      };

      if (mode === 'edit' && formData.id_emploi) {
        setEmplois(prev => prev.map(e => 
          e.id_emploi === formData.id_emploi ? newEmploi : e
        ));
      } else {
        setEmplois(prev => [...prev, newEmploi]);
      }

      let response;
      if (mode === 'edit' && formData.id_emploi) {
        response = await fetch(`/api/emploisDuTemps/${formData.id_emploi}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emploiData)
        });
      } else {
        response = await fetch('/api/emploisDuTemps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emploiData)
        });
      }

      if (!response.ok) throw new Error('Erreur lors de la requête');

      // Recharger les données fraîches après la requête
      const emploisResponse = await fetch('/api/emploisDuTemps');
      const freshData = await emploisResponse.json();
      setEmplois(freshData.emploisDuTemps);

      setShowForm(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      // En cas d'erreur, recharger les données pour revenir à l'état précédent
      const emploisResponse = await fetch('/api/emploisDuTemps');
      setEmplois(await emploisResponse.json());
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id_emploi) {
      setError('ID de séance manquant pour la suppression');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Mise à jour optimiste
      setEmplois(prev => prev.filter(e => e.id_emploi !== formData.id_emploi));

      const response = await fetch(`/api/emploisDuTemps/${formData.id_emploi}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la suppression');
      }

      setShowForm(false);
      setFormData({
        matiere: '',
        enseignant: '',
        salle: '',
        jour: '',
        heure: '',
        id_cours: '',
        id_emploi: null
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      // En cas d'erreur, recharger les données
      const emploisResponse = await fetch('/api/emploisDuTemps');
      setEmplois(await emploisResponse.json());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Emploi du Temps</h1>

      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-50 rounded-lg">
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
          onClick={handleAddClick}
          className="w-1/10 p-3 border rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 transition duration-200"
          disabled={loading}
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
                    <td 
                      key={jour} 
                      className="border p-2 text-center text-sm hover:bg-gray-50 cursor-pointer" 
                      onClick={() => handleCellClick(jour, heure)}
                    >
                      {seance && match ? (
                        <>
                          <div className="font-medium">{seance.matiere}</div>
                          <div className="text-gray-600 text-xs">{seance.enseignant}</div>
                          <div className="text-gray-500 text-xs italic">{seance.salle}</div>
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

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
            <h2 className="text-lg font-bold mb-4">
              {mode === 'edit' ? "Modifier une séance" : "Ajouter une séance"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Jour *</label>
                <select 
                  name="jour"
                  value={formData.jour}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Sélectionner un jour</option>
                  {jours.map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Heure *</label>
                <select 
                  name="heure"
                  value={formData.heure}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Sélectionner une heure</option>
                  {heures.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Matière *</label>
                <input
                  type="text"
                  name="matiere"
                  value={formData.matiere}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ex: Maths"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Enseignant</label>
                <input
                  type="text"
                  name="enseignant"
                  value={formData.enseignant}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ex: M. Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Salle</label>
                <input
                  type="text"
                  name="salle"
                  value={formData.salle}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ex: Salle 101"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  disabled={loading}
                >
                  {loading ? 'En cours...' : mode === 'edit' ? 'Modifier' : 'Créer'}
                </button>

                {mode === 'edit' && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                    disabled={loading}
                  >
                    {loading ? 'En cours...' : 'Supprimer'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </Modal>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">Chargement...</div>
        </div>
      )}
    </div>
  );
};

export default EmploiDuTemps;