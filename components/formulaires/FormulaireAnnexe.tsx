"use client";

import { useState } from "react";

type AnnexeFormData = {
  nom: string;
  adresse: string;
  ville: string;
  region: string;
};

type RegisterFormProps = {
  onCancel: () => void;
  title: string;
  apiUrl?: string;
  onSuccess?: () => void; // Seule ligne ajoutée
};

const FormulaireAnnexe = ({ onCancel, title, apiUrl = "/api/annexes", onSuccess }: RegisterFormProps) => {
  const [formData, setFormData] = useState<AnnexeFormData>({
    nom: "",
    adresse: "",
    ville: "",
    region: "",
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
      if (!formData.nom.trim() || !formData.adresse.trim()) {
        throw new Error("Nom et adresse sont obligatoires");
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'envoi");
      }

      setSuccess("Annexe créée avec succès !");
      setFormData({ nom: "", adresse: "", ville: "", region: "" });
      
      // Appel de onSuccess si fourni
      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => setSuccess(null), 5000);

    } catch (err: any) {
      setError(err.message || "Erreur lors de la création");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold">{title}</h1>
          
          {/* Messages d'état */}
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
              <label className="block text-gray-700 mb-2">Nom Annexe :</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Répétez pour les autres champs (adresse, ville, région) */}
            <div>
              <label className="block text-gray-700 mb-2">Adresse :</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Ville :</label>
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Région :</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
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

export default FormulaireAnnexe;