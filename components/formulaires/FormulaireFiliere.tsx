"use client";

import { useState } from "react";

type RegisterFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void; // fonction pour fermer le formulaire
  title?: string;
};

const FormulaireFiliere = ({
  onSubmit,
  onCancel,
  title = "Créer une Filiere",
}: RegisterFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    await onSubmit(formData);
  }

  return (
    // Fond noir fixe qui ne disparaît pas au clic
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {/* Conteneur du formulaire */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold">{title}</h1>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Nom Filiere :</label>
              <input
                type="text"
                name="nom"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Description :</label>
              <input
                type="text"
                name="prenom"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Niveau :</label>
              <input
                type="text"
                name="ville"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>


          </div>

          <div className="flex justify-between mt-6">
            

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Créer
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormulaireFiliere;
