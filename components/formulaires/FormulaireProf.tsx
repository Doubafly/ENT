import { registerTeacher } from "@/actions/signupprofesseur";
import { useState } from "react";

type RegisterFormProps = {
  onSubmit: (formData: FormData) => Promise<void>; // La fonction appelée lors de la soumission
  title?: string; // Titre du formulaire
  onClose: () => void; // Fonction pour fermer le formulaire
};

const RegisterFormEnseignant = ({ onSubmit, title = "Créer un Enseignant", onClose }: RegisterFormProps) => {  // Ajoutez onClose ici
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    try {
      await registerTeacher(formData);
      setSuccess("Enseignant créé avec succès !");
    } catch (err) {
      setError("Erreur lors de la création de l'enseignant.");
    }
  }

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-lg border-t-1 border-b-2 border-gray-300 max-w-sm mx-auto">
     <button
        type="button"
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        onClick={onClose}  // Utilisation de onClose ici
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <form onSubmit={handleSubmit} className="space-y-3">
        <h1 className="text-sm font-bold text-center">{title}</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <div className="flex flex-col gap-3 mt-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1 text-xs">Nom :</label>
              <input
                type="text"
                name="nom"
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1 text-xs">Prénom :</label>
              <input
                type="text"
                name="prenom"
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1 text-xs">Email :</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1 text-xs">Mot de passe :</label>
              <input
                type="password"
                name="mot_de_passe"
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1 text-xs">Sexe :</label>
              <select
                name="sexe"
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1 text-xs">Téléphone :</label>
              <input
                type="text"
                name="telephone"
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1 text-xs">Adresse :</label>
              <input
                type="text"
                name="adresse"
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1 text-xs">Profil :</label>
              <input
                type="text"
                name="profil"
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1 text-xs">Date de naissance :</label>
              <input
                type="date"
                name="date_naissance"
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1 text-xs">Role :</label>
              <select
                name="id_role"
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="1">Membre</option>
                <option value="2">Syndicat</option>
                <option value="3">Autre</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1 text-xs">Filière :</label>
              <select
                name="id_filiere"
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="1">AP</option>
                <option value="2">IG</option>
                <option value="3">TEC</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-600"
          >
            Créer
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterFormEnseignant;