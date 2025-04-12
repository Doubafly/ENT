import React, { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  type: "Etudiant" | "Enseignant" | "Admin";
  profil: string;
}

const ProfilePage = ({ user }: { user: User }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour la modal
  const [formData, setFormData] = useState({
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
  });

  useEffect(() => {
    // Fonction pour récupérer l'image de profil
    const fetchProfileImage = async () => {
      try {
        if (user.profil) {
          setProfileImage(user.profil);
        } else {
          setProfileImage("/profils/default.jpg");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, [user.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données soumises :", formData, profileImage);
    // Ajouter ici la logique pour envoyer les données mises à jour au serveur
    setIsModalOpen(false); // Fermer la modal après soumission
  };

  return (
    <div className="flex bg-gray-100  xl:ml-5 mr-1">
      <div className="flex-1 overflow-y-auto">
        {/* Bannière de profil */}
        <div className="h-32 bg-blue-500  float">
          {/* Photo de profil */}
          <div className="relative -bottom-16 ">
            <img
              src={profileImage || "/profils/default.jpg"}
              alt="Photo de profil"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <label
              htmlFor="upload-button"
              className="absolute bottom-2 left-24  bg-gray-200 text-gray-700 rounded-full p-2 cursor-pointer"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
            >
              <i className="fas fa-camera"></i>
            </label>
            <input
              type="file"
              id="upload-button"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfileImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>

        {/* Informations de l'utilisateur */}
        <div className="px-8 pt-20 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">
                {user.prenom} {user.nom}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-500 text-sm mt-1">
                {user.type === "Etudiant"
                  ? "Étudiant en Informatique"
                  : user.type === "Enseignant"
                  ? "Professeur de Mathématiques"
                  : "Administrateur de l'université"}
              </p>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
              onClick={() => setIsModalOpen(true)} // Ouvrir la modal
            >
              Modifier le profil
            </button>
          </div>

          {/* Statistiques */}
          <div className="flex space-x-6 mt-4">
            {user.type === "Etudiant" && (
              <>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <span className="font-bold text-lg">85%</span>
                  <p className="text-gray-600 text-sm">Moyenne générale</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <span className="font-bold text-lg">12</span>
                  <p className="text-gray-600 text-sm">Cours suivis</p>
                </div>
              </>
            )}
            {user.type === "Enseignant" && (
              <>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <span className="font-bold text-lg">5</span>
                  <p className="text-gray-600 text-sm">Cours enseignés</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <span className="font-bold text-lg">120</span>
                  <p className="text-gray-600 text-sm">Étudiants encadrés</p>
                </div>
              </>
            )}
            {user.type === "Admin" && (
              <>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <span className="font-bold text-lg">1,250</span>
                  <p className="text-gray-600 text-sm">Étudiants</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <span className="font-bold text-lg">85</span>
                  <p className="text-gray-600 text-sm">Professeurs</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Modifier le profil</h2>
              <form onSubmit={handleSubmit}>
                {/* Image de profil */}
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={profileImage || "/profils/default.jpg"}
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
                    onChange={handleProfileImageChange}
                  />
                </div>

                {/* Inputs pour les informations utilisateur */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={user.prenom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={user.nom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                    onClick={() => setIsModalOpen(false)} // Fermer la modal
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
          </div>
        )}
        {/* Onglets de navigation */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-8">
            <button className="py-2 border-b-2 border-blue-500 font-semibold">
              Tableau de bord
            </button>
            <button className="py-2 text-gray-500 hover:text-gray-700">
              Emploi du temps
            </button>
            <button className="py-2 text-gray-500 hover:text-gray-700">
              Résultats
            </button>
            <button className="py-2 text-gray-500 hover:text-gray-700">
              Paramètres
            </button>
          </div>
        </div>

        {/* Contenu dynamique en fonction du type d'utilisateur */}
        <div className="p-8">
          {user.type === "Etudiant" && <StudentContent />}
          {user.type === "Enseignant" && <ProfessorContent />}
          {user.type === "Admin" && <AdminContent />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// Contenu spécifique à chaque type d'utilisateur
const StudentContent = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Emploi du temps</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between items-center p-4 border-b">
            <p className="font-medium">Lundi</p>
            <p>9h00 - 12h00 : Algorithmique</p>
          </div>
          <div className="flex justify-between items-center p-4 border-b">
            <p className="font-medium">Mardi</p>
            <p>14h00 - 17h00 : Base de données</p>
          </div>
          <div className="flex justify-between items-center p-4 border-b">
            <p className="font-medium">Mercredi</p>
            <p>10h00 - 13h00 : Développement Web</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfessorContent = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cours enseignés</h2>
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="font-medium">Algèbre linéaire - Licence 2</p>
          <p className="text-sm text-gray-500 mt-2">25 étudiants inscrits</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="font-medium">Analyse numérique - Master 1</p>
          <p className="text-sm text-gray-500 mt-2">18 étudiants inscrits</p>
        </div>
      </div>
    </div>
  );
};

const AdminContent = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Statistiques de l'université</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <span className="font-bold text-2xl">1,250</span>
          <p className="text-gray-600 text-sm">Étudiants</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <span className="font-bold text-2xl">85</span>
          <p className="text-gray-600 text-sm">Professeurs</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <span className="font-bold text-2xl">120</span>
          <p className="text-gray-600 text-sm">Cours disponibles</p>
        </div>
      </div>
    </div>
  );
};
