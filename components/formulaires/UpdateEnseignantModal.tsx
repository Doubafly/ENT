"use client";

import { useState } from "react";

export default function UpdateEnseignantModal({
  enseignant,
  onClose,
  onUpdate,
}: {
  enseignant: any;
  onClose: () => void;
  onUpdate: (id_utilisateur: number, updatedData: any) => void;
}) {
  const [formData, setFormData] = useState({
    nom: enseignant.utilisateurs.nom || "",
    prenom: enseignant.utilisateurs.prenom || "",
    matricule: enseignant.matricule,
    email: enseignant.utilisateurs.email || "",
    telephone: enseignant.utilisateurs.telephone || "",
    adresse: enseignant.utilisateurs.adresse || "",
    profil: enseignant.utilisateurs.profil,
    sexe: enseignant.utilisateurs.sexe || "",
    date_inscription: enseignant.utilisateurs.date_inscription,
    mot_de_passe: enseignant.utilisateurs.mot_de_passe,
    specialite: enseignant.specialite || "",
    date_naissance: enseignant.utilisateurs.date_naissance || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profil: `${reader.result as string}`,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let profilPath = formData.profil;

      // Vérifiez si une nouvelle image a été sélectionnée
      if (formData.profil.startsWith("data:image")) {
        const formDataImage = new FormData();
        const blob = await fetch(formData.profil).then((res) => res.blob());
        const file = new File([blob], `${enseignant.id_utilisateur}.jpg`, {
          type: blob.type,
        });

        formDataImage.append("image", file);
        formDataImage.append("userId", enseignant.id_utilisateur.toString());

        // Envoyer l'image à l'API
        const response = await fetch("/api/files/uploads", {
          method: "POST",
          body: formDataImage,
        });

        if (!response.ok) {
          throw new Error("Erreur lors du téléchargement de l'image");
        }

        const data = await response.json();
        profilPath = `${data.filePath}?t=${new Date().getTime()}`; // Ajoutez un timestamp pour éviter le cache
      }

      // Préparer les données avant soumission
      const updatedData: Partial<typeof formData> = {
        ...formData,
        profil: profilPath, // Utiliser le chemin mis à jour
      };
      console.log(updatedData);
      // Soumettre les données mises à jour
      onUpdate(enseignant.id_utilisateur, updatedData);
      // Fermer la modal après mise à jour
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4 text-center">
          Modifier l'enseigants
        </h2>
        <form
          onSubmit={handleSubmit}
          className="text-sm"
          encType="multipart/form-data"
        >
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
            {/* specialite */}
            <div>
              <label className="block font-medium">Matricule</label>
              <input
                type="text"
                name="matricule"
                value={formData.specialite}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
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
                    checked={formData.sexe === "M"}
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
                    checked={formData.sexe === "F"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Femme
                </label>
              </div>
            </div>

            {/* Filière
            <div>
              <label className="block font-medium">Filière</label>
              <select
                title="filiere"
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
            </div> */}
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
