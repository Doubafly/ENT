
"use client";
import { useState } from "react";
import { registerUser } from "@/actions/signupetudiant";

type RegisterFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  title?: string;
  onClose: () => void;
};

const RegisterFormEtudiant = ({ onSubmit, title = "Créer un étudiant", onClose }: RegisterFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    try {
      await registerUser(formData);
      setSuccess("Étudiant créé avec succès !");
    } catch (err) {
      setError("Erreur lors de la création de l'étudiant.");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg border w-full max-w-2xl">
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          x
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-lg font-bold text-center mb-3">{title}</h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-sm font-bold">Nom :</label>
              <input type="text" name="nom" className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold">Prénom :</label>
              <input type="text" name="prenom" className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold">Email :</label>
              <input type="email" name="email" className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold">Mot de passe :</label>
              <input type="password" name="mot_de_passe" className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold">Sexe :</label>
              <select name="sexe" className="w-full p-2 border rounded-lg  text-sm" required>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold">Téléphone :</label>
              <input type="text" name="telephone" className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold">Adresse :</label>
              <input type="text" name="adresse" className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold">Profil :</label>
              <input type="text" name="profil" className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold">Date de naissance :</label>
              <input type="date" name="date_naissance" className="w-full p-2 border rounded-lg  text-sm" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold">Rôle :</label>
              <select name="id_role" className="w-full p-2 border rounded-lg  text-sm" required>
                <option value="1">Membre</option>
                <option value="2">Syndicat</option>
                <option value="3">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold">Filière :</label>
              <select name="id_filiere" className="w-full p-2 border rounded-lg  text-sm" required>
                <option value="1">AP</option>
                <option value="2">IG</option>
                <option value="3">TEC</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center mt-3">
            <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600  text-sm">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterFormEtudiant;