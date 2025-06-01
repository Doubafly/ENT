import React, { useEffect, useState } from "react";
import EtudiantProfil from "./EtudiantProfil";
import AdminProfil from "./AdminProfil";
import EnseigantProfil from "./EnseignantProfil";
import { log } from "console";


interface User {
  id_utilisateur: string; // Utilisé pour l'upload de l'image
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
  }, [user.id_utilisateur]);


console.log("User data:", user);
  function reload(e:any) {
    console.log(e);
    
  }
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
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
              
                const formData = new FormData();
                formData.append("image", file);
                formData.append("userId", user.id_utilisateur); // Assure-toi que `user.id` est une string
              
                try {
                  const res = await fetch("/api/files/uploads", {
                    method: "POST",
                    body: formData,
                  });
              
                  const data = await res.json();
              
                  if (res.ok) {
                    setProfileImage(data.filePath); // Utilise le vrai chemin renvoyé
                  } else {
                    console.error("Erreur :", data.message);
                  }
                } catch (err) {
                  console.error("Erreur lors de l’upload :", err);
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
                  ?  "Étudiant EN INFORMATIQUE"   
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
        {user.type === "Etudiant" && (
        <div className="mt-6">
        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <div className="bg-white shadow rounded-lg p-4 text-center">
              <i className="fas fa-file-alt text-2xl text-green-500 mb-2"></i>
              <p className="text-gray-500 text-sm">Modules suivis</p>
              <p className="text-xl font-bold">5</p>
            </div>

            <div className="bg-white shadow rounded-lg p-4 text-center">
              <i className="fas fa-user-clock text-2xl text-red-500 mb-2"></i>
              <p className="text-gray-500 text-sm">Jours d'absence</p>
              <p className="text-xl font-bold">0</p>
            </div>

          <div className="bg-white shadow rounded-lg p-4 text-center">
        <i className="fas fa-calendar-alt text-2xl text-purple-500 mb-2"></i>
        <p className="text-gray-500 text-sm">Session académique</p>
        <p className="text-xl font-bold">2024-2025</p>
      </div>

          </div>
        </div>
)}

{user.type === "Enseignant" && (
  <div className="mt-6">
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <i className="fas fa-book text-2xl text-indigo-500 mb-2"></i>
        <p className="text-gray-500 text-sm">Filières enseignés</p>
        <p className="text-xl font-bold">5</p>
      </div>

      <div className="bg-white shadow rounded-lg p-4 text-center">
        <i className="fas fa-file-upload text-2xl text-green-500 mb-2"></i>
        <p className="text-gray-500 text-sm">Documents uploadés</p>
        <p className="text-xl font-bold">8</p>
      </div>

      <div className="bg-white shadow rounded-lg p-4 text-center">
        <i className="fas fa-user-times text-2xl text-red-500 mb-2"></i>
        <p className="text-gray-500 text-sm">Absences enregistrées</p>
        <p className="text-xl font-bold">6</p>
      </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
      <i className="fas fa-user-graduate text-2xl text-purple-500 mb-2"></i>
      <p className="text-gray-500 text-sm">Nombre d'étudiants</p>
      <p className="text-xl font-bold">3</p>
    </div>

    <div className="bg-white shadow rounded-lg p-4 text-center">
      <i className="fas fa-file-alt text-2xl text-yellow-500 mb-2"></i>
      <p className="text-gray-500 text-sm">Nombre de modules</p>
      <p className="text-xl font-bold">3</p>
     </div> 
    </div>
  </div>
)}

        {user.type === "Admin" && (
  <div className="mt-5">
    
  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

    <div className="bg-white shadow rounded-lg p-4 text-center">
      <i className="fas fa-users text-2xl text-blue-500 mb-2"></i>
      <p className="text-gray-500 text-sm">Nombres d'admins</p>
      <p className="text-xl font-bold">2</p>
    </div>

    <div className="bg-white shadow rounded-lg p-4 text-center">
      <i className="fas fa-bullhorn text-2xl text-green-500 mb-2"></i>
      <p className="text-gray-500 text-sm">Nombre d'annonces</p>
      <p className="text-xl font-bold">8</p>
    </div>

    <div className="bg-white shadow rounded-lg p-4 text-center">
      <i className="fas fa-user-graduate text-2xl text-purple-500 mb-2"></i>
      <p className="text-gray-500 text-sm">Nombre d'étudiants</p>
      <p className="text-xl font-bold">3</p>
    </div>

    <div className="bg-white shadow rounded-lg p-4 text-center">
      <i className="fas fa-chalkboard-teacher text-2xl text-yellow-500 mb-2"></i>
      <p className="text-gray-500 text-sm">Nombre de professeurs</p>
      <p className="text-xl font-bold">2</p>
    </div>

    <div className="bg-white shadow rounded-lg p-4 text-center">
      <i className="fas fa-layer-group text-2xl text-red-500 mb-2"></i>
      <p className="text-gray-500 text-sm">Nombre de filières</p>
      <p className="text-xl font-bold">5</p>
    </div>

    <div className="bg-white shadow rounded-lg p-4 text-center">
      <i className="fas fa-calendar-alt text-2xl text-indigo-500 mb-2"></i>
      <p className="text-gray-500 text-sm">Nombre de sessions</p>
      <p className="text-xl font-bold">3</p>
    </div>

    <div className="bg-white shadow rounded-lg p-4 text-center">
      <i className="fas fa-book text-2xl text-pink-500 mb-2"></i>
      <p className="text-gray-500 text-sm">Nombre de modules</p>
      <p className="text-xl font-bold">10</p>
    </div>  

    </div>
  </div>
)}

        </div>
            
        </div>

        {/* Modal */}
        {isModalOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setIsModalOpen(false)} // Fermer la modal en cliquant à l'extérieur
  >
    <div
     
      onClick={(e) => e.stopPropagation()} // Empêcher la fermeture en cliquant sur le contenu
    >
      {user.type === "Etudiant" && (
            <EtudiantProfil 
            user={user}
            onUserUpdate={() => 
              {
                setIsModalOpen(false); // Fermer la modal après la mise à jour
                window.location.reload(); // Recharger la page
            }
            }
            />
      )}
     {user.type === "Enseignant" && (
            <EnseigantProfil 
            user={user} 
            onUserUpdate={() =>
              {
                setIsModalOpen(false); // Fermer la modal après la mise à jour
                window.location.reload(); // Recharger la page
              } 
            }
            />
      )}
     {user.type === "Admin" && (
            <AdminProfil 
            user={user}
            onUserUpdate={() => 
              {
                  setIsModalOpen(false); // Fermer la modal après la mise à jour
                  window.location.reload(); // Recharger la page
              }
            }
            />
      )}
    </div>
  </div>
)}

   
      </div>
  
  );
};

export default ProfilePage;