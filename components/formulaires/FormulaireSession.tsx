"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";

type SessionFormData = {
  session: string;
};

type SessionFormProps = {
  onCancel: () => void;
  title: string;
  apiUrl?: string;
  onSuccess?: () => void;
  initialData?: Partial<SessionFormData>;
};

const FormulaireSession = ({ 
  onCancel, 
  title, 
  apiUrl = "/api/sessions", 
  onSuccess,
  initialData = { session: "" }
}: SessionFormProps) => {
  const [formData, setFormData] = useState<SessionFormData>({
    session: initialData.session || ""
  });

  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'error' | 'success';
    message?: string;
  }>({ type: 'idle' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: 'loading' });

    try {
      const payload = {
        annee_academique: formData.session.trim()
      };

      // Validation simple
      if (!payload.annee_academique.match(/^\d{4}-\d{4}$/)) {
        throw new Error("Format invalide. Utilisez AAAA-AAAA (ex: 2023-2024)");
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création");
      }

      setStatus({ 
        type: 'success', 
        message: "Session créée avec succès !" 
      });
      
      // Réinitialisation après 1.5s si succès
      setTimeout(() => {
        if (onSuccess) onSuccess();
        setFormData({ session: "" });
        setStatus({ type: 'idle' });
      }, 1500);

    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        message: err.message || "Erreur lors de la création" 
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {status.type === 'error' && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2">
              <X className="flex-shrink-0 mt-0.5" size={16} />
              <div>{status.message}</div>
            </div>
          )}

          {status.type === 'success' && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="flex-shrink-0 mt-0.5" size={16} />
              <div>{status.message}</div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="session" className="block text-sm font-medium text-gray-700">
              Année académique *
            </label>
            <input
              id="session"
              type="text"
              name="session"
              value={formData.session}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 2023-2024"
              pattern="\d{4}-\d{4}"
              required
              disabled={status.type === 'loading'}
              aria-describedby="session-format"
            />
            <p id="session-format" className="text-xs text-gray-500">
              Format requis : AAAA-AAAA (ex: 2023-2024)
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={status.type === 'loading'}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
              disabled={status.type === 'loading'}
            >
              {status.type === 'loading' ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Envoi...
                </>
              ) : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormulaireSession;