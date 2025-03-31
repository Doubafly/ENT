"use client";

import { useState, useEffect } from "react";

type Filiere = {
  id_filiere: number;
  nom: string;
};

type UpdateEtudiantModalProps = {
  etudiant: {
    id: number;
    id_utilisateur: number;
    utilisateurs: {
      nom: string;
      prenom: string;
      email: string;
      sexe: string;
      telephone: string;
      adresse: string;
      profil: string;
    };
    matricule: string;
    date_naissance: string;
    date_inscription: string;
    filieres: {
      id_filiere: number;
      nom: string;
    };
  };
  onClose: () => void;
  onUpdate: (id_utilisateur: number, updatedData: any) => Promise<void>;
};

export default function UpdateEtudiantModal({
  etudiant,
  onClose,
  onUpdate,
}: UpdateEtudiantModalProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    sexe: "",
    telephone: "",
    adresse: "",
    profil: "/profils/default.jpg",
    matricule: "",
    date_naissance: "",
    date_inscription: "",
    id_filiere: 0,
    mot_de_passe: "",
  });

  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [idFiliere, setIdFiliere] = useState(0);

  // Fonction pour formater une date en yyyy-MM-dd (nécessaire pour l'input date)
  const formatDateToInput = (date: string) => {
    if (!date) return "";

    if (date.includes("-") && date.length === 10 && date[4] === "-") {
      return date; // Format déjà correct
    }

    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Mise à jour des données de l'étudiant à partir de la prop `etudiant`
    if (etudiant) {
      setFormData({
        nom: etudiant.utilisateurs.nom,
        prenom: etudiant.utilisateurs.prenom,
        email: etudiant.utilisateurs.email,
        sexe: etudiant.utilisateurs.sexe === "M" ? "Homme" : "Femme",
        telephone: etudiant.utilisateurs.telephone,
        adresse: etudiant.utilisateurs.adresse,
        profil: etudiant.utilisateurs.profil || "/profils/default.jpg",
        matricule: etudiant.matricule,
        date_naissance: formatDateToInput(etudiant.date_naissance),
        date_inscription: formatDateToInput(etudiant.date_inscription),
        id_filiere: etudiant.filieres?.id_filiere || 0,
        mot_de_passe: "",
      });
      setIdFiliere(etudiant.filieres?.id_filiere || 0);
    }
  }, [etudiant]);

  // Récupérer les filières
  useEffect(() => {
    const fetchFilieres = async () => {
      try {
        const response = await fetch("/api/filieres");
        const data = await response.json();
        setFilieres(data.filieres);
      } catch (error) {
        console.error("Erreur lors de la récupération des filières :", error);
      }
    };
    fetchFilieres();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "filiere" ? Number(value) : value, // Convertir la filière en nombre
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profil: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Préparer les données avant soumission
    const updatedData: Partial<typeof formData> = {
      ...formData,
      id_filiere: idFiliere, // Ajoute la filière sélectionnée
      sexe: formData.sexe === "Homme" ? "M" : "F",
      date_naissance: formData.date_naissance ? formatDateToInput(formData.date_naissance) : "", // Formatage de la date
      date_inscription: formData.date_inscription ? formatDateToInput(formData.date_inscription) : "", // Formatage de la date
    };

    // Soumettre les données mises à jour
    await onUpdate(etudiant.id, updatedData);

    // Fermer la modal après mise à jour
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4 text-center">Modifier l'étudiant</h2>
        <form onSubmit={handleSubmit} className="text-sm">
          {/* Image de Profil */}
          <div className="flex justify-center mb-4">
            <label htmlFor="profil" className="cursor-pointer">
              <img
                src={formData.profil}
                alt="Profil"
                className="w-24 h-24 rounded-full object-cover border"
              />
            </label>
            <input
              type="file"
              id="profil"
              name="profil"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Champs en grille */}
          <div className="grid grid-cols-2 gap-4">
            {/* Nom */}
            <div>
              <label className="block font-medium">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Prénom */}
            <div>
              <label className="block font-medium">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block font-medium">Mot de passe</label>
              <input
                type="password"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Laisser vide pour ne pas changer"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block font-medium">Téléphone</label>
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Adresse */}
            <div>
              <label className="block font-medium">Adresse</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Matricule */}
            <div>
              <label className="block font-medium">Matricule</label>
              <input
                type="text"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Date de Naissance */}
            <div>
              <label className="block font-medium">Date de Naissance</label>
              <input
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Date d'Inscription */}
            <div>
              <label className="block font-medium">Date d'Inscription</label>
              <input
                type="date"
                name="date_inscription"
                value={formData.date_inscription}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Sexe */}
            <div>
              <label className="block font-medium">Sexe</label>
              <div className="flex gap-2 mt-1">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sexe"
                    value="Homme"
                    checked={formData.sexe === "Homme"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Homme
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sexe"
                    value="Femme"
                    checked={formData.sexe === "Femme"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Femme
                </label>
              </div>
            </div>

            {/* Filière */}
            <div>
              <label className="block font-medium">Filière</label>
              <select
                name="filiere"
                value={idFiliere}
                onChange={(e) => setIdFiliere(Number(e.target.value))}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner une filière</option>
                {filieres.map((filiere) => (
                  <option key={filiere.id_filiere} value={filiere.id_filiere}>
                    {filiere.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


