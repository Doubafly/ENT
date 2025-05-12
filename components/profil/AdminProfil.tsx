

import { format } from "path";
import React, { useEffect, useState } from "react";

export default function AdminProfil({ user, onClose, onUserUpdate }: any) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    sexe: "",
    mot_de_passe: "", // Champ vide pour saisir un nouveau mot de passe
    telephone: "",
    adresse: "",
    profil: "",
    permissions: {
      admin: false,
      annonces: false,
      classes: false,
      emplois_du_temps: false,
      enseignants: false,
      etudiants: false,
      note: false,
      paiement: false,
      parametres: false,
    },
    passwordHash: "", // Ancien mot de passe (hashé)
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email || "",
        sexe: user.sexe || "",
        mot_de_passe: "",  // Champ vide pour modifier le mot de passe si nécessaire
        telephone: user.telephone || "",
        adresse: user.adresse || "",
        profil: user.profil || "",
        permissions: user.permissions || {
          admin: false,
          annonces: false,
          classes: false,
          emplois_du_temps: false,
          enseignants: false,
          etudiants: false,
          note: false,
          paiement: false,
          parametres: false,
        },
        passwordHash: user.mot_de_passe || "", // Ancien mot de passe
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Empêcher les modifications des permissions
    if (name.startsWith("permissions.")) return; // Ne rien faire si c'est une permission

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const permissionsArray = [
        formData.permissions.enseignants,
        formData.permissions.etudiants,
        formData.permissions.admin,
        formData.permissions.classes,
        formData.permissions.paiement,
        formData.permissions.note,
        formData.permissions.emplois_du_temps,
        formData.permissions.parametres,
        formData.permissions.annonces,
      ];

      // Vérifier si un mot de passe est saisi
      const mot_de_passe_final = formData.mot_de_passe.trim() !== "" ? formData.mot_de_passe : formData.passwordHash;

      // Préparer les données à envoyer
      const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        sexe: formData.sexe,
        mot_de_passe: mot_de_passe_final.trim() !== "" ? mot_de_passe_final : undefined, // Si mot de passe modifié, envoyer
        telephone: formData.telephone,
        adresse: formData.adresse,
        profil: formData.profil,
        permissions: permissionsArray,
      };

      // Requête PUT vers l'API
      const response = await fetch(`/api/utilisateurs/admin/${user.id_utilisateur}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setIsModalOpen(true);
        onUserUpdate(data);
      } else {
        alert("Erreur : " + data.message);
        console.error("Erreur lors de la mise à jour :", data.message);
        console.error("Réponse du serveur :", data);
      }
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const handleCloseAll = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-[600px]">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Profil Administrateur
        </h2>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Nom:</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Prénom:</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Téléphone:</label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Adresse:</label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Mot de passe:</label>
            <input
              type="password"
              name="mot_de_passe"
              value={formData.mot_de_passe} // Champ vide pour ne pas afficher l'ancien mot de passe
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Laisser vide pour ne pas modifier"
            />
          </div>
        </div>

        {/* Affichage des permissions sans possibilité de modification */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Permissions :</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.keys(formData.permissions).map((perm) => (
              <div key={perm} className="flex items-center gap-2 text-sm text-gray-700 capitalize">
                <input
                  type="checkbox"
                  name={`permissions.${perm}`}
                  checked={formData.permissions[perm as keyof typeof formData.permissions]}
                  disabled
                />
                {perm.replace(/_/g, " ")}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleCloseAll}
            className="bg-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="mb-4">Mise à jour réussie !</p>
            <button
              onClick={handleCloseAll}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
