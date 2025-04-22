"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Filiere {
  id_filiere: number;
  nom: string;
}

interface ModuleFormData {
  id_module?: number;
  nom: string;
  description: string;
}

interface FormulaireModuleProps {
  onCancel: () => void;
  title?: string;
  onSuccess?: () => void;
  moduleToEdit?: {
    id_module: number;
    nom: string;
    description: string;
  } | null;
}

function FormulaireModule({
  onCancel,
  title = "Créer un nouveau module",
  onSuccess,
  moduleToEdit = null
}: FormulaireModuleProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ModuleFormData>({
    id_module: undefined,
    nom: "",
    description: ""
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (moduleToEdit) {
      setFormData({
        id_module: moduleToEdit.id_module,
        nom: moduleToEdit.nom,
        description: moduleToEdit.description
      });
    }
  }, [moduleToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validation
      if (!formData.nom.trim()) throw new Error("Le nom du module est requis");
      if (!formData.description.trim()) throw new Error("La description est requise");

      if (formData.id_module) {
        // Mode édition - Mise à jour du module
        const response = await fetch(`/api/modules/${formData.id_module}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom: formData.nom,
            description: formData.description
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erreur lors de la modification");
        }

        setSuccess("Module modifié avec succès");
      } else {
        // Mode création - Nouveau module
        const response = await fetch('/api/modules', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom: formData.nom,
            description: formData.description
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erreur lors de la création");
        }

        setSuccess("Module créé avec succès");
      }

      router.refresh();
      if (onSuccess) onSuccess();
      
    } catch (err: any) {
      console.error("Erreur:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nom du module *</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded ${
                isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "En cours..." : formData.id_module ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormulaireModule;