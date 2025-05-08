import React, { useEffect, useState } from "react";

export default function EnseignantProfil({ user, onClose , onUserUpdate}: any) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    sexe: "",
    mot_de_passe: "",
    telephone: "",
    adresse: "",
    profil: "",
    matricule: "",
    specialite: "",
  });

    const [isModalOpen, setIsModalOpen] = useState(false); // état pour le modal


  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email || "",
        sexe: user.sexe || "",
        mot_de_passe: "",
        telephone: user.telephone || "",
        adresse: user.adresse || "",
        profil: user.profil || "",
        matricule: user.enseignant?.matricule || "",
        specialite: user.enseignant?.specialite || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/utilisateurs/enseignants/${user.id_utilisateur}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setIsModalOpen(true); // ouvrir le modal au lieu d’un alert
        onUserUpdate(data);
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleCloseAll = () => {
    setIsModalOpen(false);    // Fermer le modal de confirmation
    if (onClose) onClose();   // Fermer le modal principal
  };
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-[600px]">
        <h2 className="text-2xl font-bold mb-4 text-center">Profil Enseignant</h2>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Nom:</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Nom de l'enseignant"
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
              placeholder="Prénom de l'enseignant"
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
              placeholder="Email de l'enseignant"
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
              placeholder="Téléphone"
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
              placeholder="Adresse"
            />
          </div>
          {/* <div className="w-1/2">
            <label className="block text-gray-700">Sexe:</label>
            <input
              type="text"
              name="sexe"
              value={formData.sexe}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Sexe"
              disabled
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Matricule:</label>
            <input
              type="text"
              name="matricule"
              value={formData.matricule}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Matricule"
              disabled
            />
          </div> */}
          <div className="w-1/2">
          <label className="block text-gray-700">Mot de passe:</label>
          <input
            type="password"
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Laisser vide pour ne pas modifier"
          />
          </div>
          
        </div>

        {/* <div className="mb-4">
          <label className="block text-gray-700">Mot de passe:</label>
          <input
            type="password"
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Laisser vide pour ne pas modifier"
          />
        </div> */}

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
  {/* Modal de confirmation */}
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
