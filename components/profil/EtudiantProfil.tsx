import { useState } from "react";

export default function EtudiantProfil({ user, onClose, onUserUpdated }: any)
 {
  const [formData, setFormData] = useState({
    nom: user.nom || "",
    prenom: user.prenom || "",
    email: user.email || "",
    sexe: user.sexe || "",
    telephone: user.telephone || "",
    adresse: user.adresse || "",
    profil: user.profil || "/profils/default.jpg",
    matricule: user.etudiant?.matricule || "",
    date_naissance: user.etudiant?.date_naissance?.slice(0, 10) || "",
    date_inscription: user.etudiant?.date_inscription?.slice(0, 10) || "",
    id_filiere: user.etudiant?.id_filiere || "",
    nom_filiere: user.etudiant?.nom_filiere || "",
    mot_de_passe: "", // Vide par défaut
  });

    const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/utilisateurs/etudiants/${user.id_utilisateur}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          sexe: formData.sexe,
          mot_de_passe: formData.mot_de_passe.trim() !== "" ? formData.mot_de_passe : "",
          telephone: formData.telephone,
          adresse: formData.adresse,
          profil: formData.profil,
          matricule: formData.matricule,
          date_naissance: formData.date_naissance,
          date_inscription: formData.date_inscription,
          id_filiere: formData.id_filiere,
          nom_filiere: formData.nom_filiere,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Erreur : ${data.message}`);
        console.error("Champs manquants :", data.champsManquants);
      } else {
        // Recharger les nouvelles données
        const newUser = await fetch(`/api/utilisateurs/etudiants/${user.id_utilisateur}`).then((res) => res.json());

        // Envoyer au parent
        if (onUserUpdated) {
          
          onUserUpdated(newUser);
        }
        setIsModalOpen(true); // ouvrir le modal au lieu d’un alert
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Une erreur est survenue.");
    }
  };

  const handleCloseAll = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Modifier le profil</h2>
        <form onSubmit={handleSubmit}>
          {/* Image de profil */}
          {/* <div className="flex flex-col items-center mb-4">
            <img
              src={formData.profil}
              alt="Photo de profil"
              className="w-24 h-24 rounded-full border-2 border-gray-300 mb-2"
            />
            <label
              htmlFor="profile-image-upload"
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Modifier l'image de profil
            </label>
            <input
              type="file"
              id="profile-image-upload"
              style={{ display: "none" }}
              // onChange={handleProfileImageChange}
            />
          </div> */}

          {/* Champs deux à deux */}
          <div className="flex flex-wrap -mx-2">
            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 font-medium mb-2">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleInputChange}
                placeholder="Laisser vide pour ne pas modifier"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* <div className="w-1/2">
            <label className="block text-gray-700">Sexe:</label>
            <input
              type="text"
              name="sexe"
              value={formData.sexe}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Sexe"
              disabled
            />
          </div> */}

            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Téléphone
              </label>
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Adresse
              </label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Matricule
              </label>
              <input
                type="text"
                name="matricule"
                value={formData.matricule}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled// Matricule est désactivé
              />
            </div> */}

            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Date de naissance
              </label>
              <input
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Date d’inscription
              </label>
              <input
                type="date"
                name="date_inscription"
                value={formData.date_inscription}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div> */}

            {/* <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Filière (ID)
              </label>
              <input
                type="number"
                name="id_filiere"
                value={formData.id_filiere}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}
          </div>

          {/* Boutons */}
          <div className="flex justify-between mt-4">
  <button
    type="button"
    onClick={handleCloseAll}
    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
  >
    Annuler
  </button>

  <button
    type="submit"
    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  >
    Enregistrer
  </button>
</div>

        </form>
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
