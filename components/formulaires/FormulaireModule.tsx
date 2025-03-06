"use client";
import { useState } from "react";

type RegisterFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  title?: string;
};

const FormulaireModule = ({
  onSubmit,
  onCancel,
  title = "Créer un Module",
}: RegisterFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    try {
      await onSubmit(formData);
      setSuccess("Module créé avec succès !");
      setTimeout(() => {
        setSuccess(null);
        onCancel(); // Fermer après succès
      }, 1500);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  }

  return (
    // Fond noir fixe
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Conteneur du formulaire */}
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[450px]"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture au clic sur le formulaire
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold">{title}</h1>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <div className="flex flex-col gap-4 mt-6">
            <div className="flex gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Nom Module :</label>
                <input
                  type="text"
                  name="nom"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Code Module :</label>
                <input
                  type="text"
                  name="code"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Description :</label>
                <input
                  type="text"
                  name="description"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Crédit :</label>
                <input
                  type="number"
                  name="credit"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Volume Horaire :</label>
              <input
                type="number"
                name="volumeHoraire"
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

export default FormulaireModule;
