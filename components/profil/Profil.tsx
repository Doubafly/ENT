import React, { useEffect, useState } from "react";
import EtudiantProfil from "./EtudiantProfil";
import AdminProfil from "./AdminProfil";

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



  return (
    <div className="flex bg-gray-100  xl:ml-5 mr-1 h-screen">
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
        
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)} // Fermer la modal en cliquant à l'extérieur
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              onClick={(e) => e.stopPropagation()} // Empêcher la fermeture en cliquant sur le contenu
            >
              {user.type === "Etudiant" && <EtudiantProfil user={user} />}
              {user.type === "Enseignant" && <EtudiantProfil user={user} />}
              {user.type === "Admin" && <AdminProfil user={user} />}
            </div>
          </div>
        )}
   
      </div>
    </div>
  );
};

export default ProfilePage;

