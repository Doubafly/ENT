"use client";
import { useState } from "react";

type SessionFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  title?: string;
  isEditMode?: boolean;
};

const FormulaireSession = ({
  onSubmit,
  onCancel,
  title = "Créer une Session",
  isEditMode = false,
}: SessionFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    try {
      await onSubmit(formData);
      setSuccess(
        isEditMode
          ? "Session modifiée avec succès !"
          : "Session créée avec succès !"
      );
      setTimeout(() => {
        setSuccess(null);
        onCancel();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[450px]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}

          <div className="mt-4">
            <label
              htmlFor="session"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom de la session *
            </label>
            <input
              type="text"
              id="session"
              name="session"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 2023-2024"
              required
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500">
              Format recommandé : AAAA-AAAA (ex: 2023-2024)
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditMode ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormulaireSession;
