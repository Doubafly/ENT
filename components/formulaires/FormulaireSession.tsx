"use client";

import { useState } from "react";

type SessionFormData = {
  session: string;
};

type SessionFormProps = {
  onCancel: () => void;
  title: string;
  apiUrl?: string;
  onSuccess?: () => void;
};

const FormulaireSession = ({ 
  onCancel, 
  title, 
  apiUrl = "/api/sessions", 
  onSuccess 
}: SessionFormProps) => {
  const [formData, setFormData] = useState<SessionFormData>({
    session: ""
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
  
    try {
      const payload = {
        annee_academique: formData.session // Assurez-vous que c'est le bon nom de champ
      };
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Envoyez l'objet formaté correctement
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création");
      }
  
      setSuccess("Session créée avec succès !");
      setFormData({ session: "" });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold">{title}</h1>
          
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Nom de la session :</label>
              <input
                type="text"
                name="session"
                value={formData.session}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Ex: 2023-2024"
                required
                autoFocus
              />
              <p className="mt-1 text-xs text-gray-500">
                Format recommandé : AAAA-AAAA
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "En cours..." : "Créer"}
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

export default FormulaireSession;