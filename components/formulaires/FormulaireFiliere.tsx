"use client";

import { useState, useEffect } from "react";

type FiliereFormData = {
  nom: string;
  description: string;
  niveau: string;
  montant_annuel: number;
  id_annexe?: number;
};

type Annexe = {
  id_annexe: number;
  nom: string;
};

type FiliereFormProps = {
  onCancel: () => void;
  title: string;
  apiUrl?: string;
  onSuccess?: () => void;
};

const FormulaireFiliere = ({ 
  onCancel, 
  title, 
  apiUrl = "/api/filieres", 
  onSuccess
}: FiliereFormProps) => {
  const [formData, setFormData] = useState<FiliereFormData>({
    nom: "",
    description: "",
    niveau: "",
    montant_annuel: 0,
    id_annexe: undefined
  });

  const [annexes, setAnnexes] = useState<Annexe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAnnexes, setIsLoadingAnnexes] = useState(true);

  // Charger les annexes au montage
  useEffect(() => {
    const fetchAnnexes = async () => {
      try {
        const response = await fetch("/api/annexes");
        if (!response.ok) throw new Error("Erreur de chargement des annexes");
        const data = await response.json();
        setAnnexes(data.annexes || []);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les annexes");
      } finally {
        setIsLoadingAnnexes(false);
      }
    };
    
    fetchAnnexes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "montant_annuel" || name === "id_annexe" 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.nom.trim() || !formData.niveau || formData.montant_annuel <= 0) {
        throw new Error("Nom, niveau et montant valide sont obligatoires");
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création");
      }

      setSuccess("Filière créée avec succès !");
      setFormData({ 
        nom: "", 
        description: "", 
        niveau: "", 
        montant_annuel: 0,
        id_annexe: undefined
      });
      
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
              <label className="block text-gray-700 mb-2">Nom :</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Description :</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Niveau :</label>
              <select
                name="niveau"
                value={formData.niveau}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Sélectionnez un niveau</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
                <option value="Doctorat">Doctorat</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Montant annuel :</label>
              <input
                type="number"
                name="montant_annuel"
                value={formData.montant_annuel}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Annexe :</label>
              <select
                name="id_annexe"
                value={formData.id_annexe || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                disabled={isLoadingAnnexes}
              >
                <option value="">Sélectionnez une annexe (optionnel)</option>
                {annexes.map((annexe) => (
                  <option key={annexe.id_annexe} value={annexe.id_annexe}>
                    {annexe.nom}
                  </option>
                ))}
              </select>
              {isLoadingAnnexes && (
                <p className="text-sm text-gray-500">Chargement des annexes...</p>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingAnnexes}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                isSubmitting || isLoadingAnnexes ? "opacity-50 cursor-not-allowed" : ""
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

export default FormulaireFiliere;