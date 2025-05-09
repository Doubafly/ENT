export default function EtudiantProfil(user: any) {
    return (
        <div className="flex flex-col items-center justify-center  bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 w-96">
          <h2 className="text-xl font-bold mb-4">Modifier le profil</h2>
          <form >
            {/* Image de profil */}
            <div className="flex flex-col items-center mb-4">
              <img
                src={user.profil || "/profils/default.jpg"}
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
                // onChange={handleInputChange}
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
                // onChange={handleInputChange}
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
                // onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                // onClick={() => setIsModalOpen(false)} 
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
    );
    }