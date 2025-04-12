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
  code_module: string;
  volume_horaire: number;
  syllabus: string;
  id_filiere: number;
}

interface FormulaireModuleProps {
  onCancel: () => void;
  title?: string;
  onSuccess?: () => void;
  moduleToEdit?: {
    id_module: number;
    nom: string;
    description: string;
    code_module: string;
    volume_horaire: number;
    syllabus: string;
    id_filiere: number;
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
    description: "",
    code_module: "",
    volume_horaire: 0,
    syllabus: "",
    id_filiere: 0
  });

  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadFilieres = async () => {
      try {
        const response = await fetch('/api/filieres');
        if (!response.ok) throw new Error('Échec du chargement des filières');
        
        const data = await response.json();
        setFilieres(data.filieres || []);
        
        // Initialiser le formulaire avec les données à éditer ou les valeurs par défaut
        if (moduleToEdit) {
          setFormData({
            id_module: moduleToEdit.id_module,
            nom: moduleToEdit.nom,
            description: moduleToEdit.description,
            code_module: moduleToEdit.code_module,
            volume_horaire: moduleToEdit.volume_horaire,
            syllabus: moduleToEdit.syllabus,
            id_filiere: moduleToEdit.id_filiere
          });
        } else if (data.filieres?.length > 0) {
          setFormData(prev => ({ ...prev, id_filiere: data.filieres[0].id_filiere }));
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les filières");
      } finally {
        setIsLoading(false);
      }
    };

    loadFilieres();
  }, [moduleToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "volume_horaire" || name === "id_filiere" 
        ? Number(value) 
        : value
    }));
  };

  const resetForm = () => {
    setFormData({
      id_module: undefined,
      nom: "",
      description: "",
      code_module: "",
      volume_horaire: 0,
      syllabus: "",
      id_filiere: filieres.length > 0 ? filieres[0].id_filiere : 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validation
      const errors = [];
      if (!formData.nom.trim()) errors.push("Le nom du module est requis");
      if (!formData.code_module.trim()) errors.push("Le code module est requis");
      if (formData.id_filiere <= 0) errors.push("Une filière doit être sélectionnée");
      if (formData.volume_horaire <= 0) errors.push("Le volume horaire doit être positif");

      if (errors.length > 0) throw new Error(errors.join("\n"));

      if (formData.id_module) {
        // Mode édition - Mise à jour du module
        const response = await fetch(`/api/modules/${formData.id_module}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom: formData.nom,
            description: formData.description,
            filiere_module: [{
              code_module: formData.code_module,
              volume_horaire: formData.volume_horaire,
              syllabus: formData.syllabus,
              id_filiere: formData.id_filiere
            }]
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erreur lors de la modification du module");
        }

        setSuccess("Module modifié avec succès");
      } else {
        // Mode création - Nouveau module
        // Étape 1: Création du module
        const moduleResponse = await fetch('/api/modules', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom: formData.nom,
            description: formData.description
          })
        });
    
        const moduleData = await moduleResponse.json();
        
        if (!moduleResponse.ok) {
          throw new Error(moduleData.message || "Erreur lors de la création du module");
        }
    
        // Étape 2: Association à la filière
        const associationResponse = await fetch('/api/filiereModule', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_module: moduleData.module.id_module,
            id_filiere: formData.id_filiere,
            code_module: formData.code_module,
            volume_horaire: formData.volume_horaire,
            syllabus: formData.syllabus
          })
        });
    
        if (!associationResponse.ok) {
          const errorData = await associationResponse.json();
          throw new Error(errorData.message || "Erreur lors de l'association");
        }

        setSuccess("Module créé avec succès");
        resetForm();
      }

      // Rafraîchir les données et fermer après un délai
      router.refresh();
      if (onSuccess) onSuccess();
      
    } catch (err: any) {
      console.error("Erreur complète:", err);
      setError(err.message || "Une erreur inconnue est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded whitespace-pre-line">
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
            <label className="block mb-1 font-medium">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Syllabus</label>
            <textarea
              name="syllabus"
              value={formData.syllabus}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Filière *</label>
            {isLoading ? (
              <p>Chargement...</p>
            ) : filieres.length === 0 ? (
              <p className="text-red-500">Aucune filière disponible</p>
            ) : (
              <select
                name="id_filiere"
                value={formData.id_filiere}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                {filieres.map(filiere => (
                  <option key={filiere.id_filiere} value={filiere.id_filiere}>
                    {filiere.nom}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Code module *</label>
            <input
              type="text"
              name="code_module"
              value={formData.code_module}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Volume horaire (h) *</label>
            <input
              type="number"
              name="volume_horaire"
              value={formData.volume_horaire}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="1"
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
              disabled={isSubmitting || isLoading || filieres.length === 0}
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