import React, { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  type: "Etudiant" | "Enseignant" | "Admin";
}

const ProfilePage = ({ user }: { user: User }) => {
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    // Fonction pour récupérer l'image de profil
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`/api/utilisateurs/admin/${user.id}`);
        const data = await response.json();
        setProfileImage(data.admin.utilisateur.profil);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, [user.id]);

  return (
    <div className="flex bg-gray-100 ml-5 mr-1">
      {/* Sidebar (déjà existant) */}
      {/* <Sidebar /> */}

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto">
        {/* Bannière de profil */}
        <div className="h-32 bg-blue-500  relative">
          {/* Photo de profil */}
          <div className="absolute -bottom-16 left-8">
            <img
              src={profileImage || "/profils/default.jpg"}
              alt="Photo de profil"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
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
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
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
