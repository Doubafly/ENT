
export default function AdminProfil(user:any) {
  console.log("user", user);
  
  return (
      <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-96 ">
          <h2 className="text-2xl font-bold mb-4">Profil Administrateur</h2>
          <div className="mb-4">
          <label className="block text-gray-700">Nom:</label>
          <input
              type="text"
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Nom de l'administrateur"
          />
          </div>
          <div className="mb-4">
          <label className="block text-gray-700">Prénom:</label>
          <input
              type="text"
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Prénom de l'administrateur"
          />
          </div>
          <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
              type="email"
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Email de l'administrateur"
          />
          </div>
          <button className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600">
          Enregistrer
          </button>
      </div>
      </div>
  );
  }