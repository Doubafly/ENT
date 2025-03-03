"use client";
// j'ai ransformer mon formulaire en composant pour pouvoir l'utiliser dans plusieurs pages
import { useState } from "react";

type RegisterFormProps = {
  onSubmit: (formData: FormData) => Promise<void>; //  LA fonction qui est  appelée lors de la soumission
  title?: string; // Titre du formulaire a voir en bas
};

const FormulaireRole = ({
  onSubmit,
  title = "Créer une Annexe",
}: RegisterFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-xl font-bold">{title}</h1>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <div className="flex flex-col gap-1 mt-6">
          <div className="flex gap-4 mt-4">
            <div>
              <label className="block text-gray-700 mb-2">Nom :</label>
              <input
                type="text"
                name="nom"
                className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          
          </div>

          <div className="flex gap-4 mt-4">
          <div>
              <label className="block text-gray-700 mb-2">Description :</label>
              <input
                type="text"
                name="prenom"
                className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <div>
              <label className="block text-gray-700 mb-2">Permission :</label>
              <input
                type="text"
                name="ville"
                className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          
        </div>
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Créer
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormulaireRole;
