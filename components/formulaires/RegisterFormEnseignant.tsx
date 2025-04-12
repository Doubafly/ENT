"use client";

import { useState } from "react";

export default function RegisterFormEnseignant({
  onClose,
  onrecharge,
  onTeacherAdded,
}: {
  onClose: () => void;
  onrecharge: () => void;
  onTeacherAdded: (newTeacher: any) => void;
}) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    sexe: "",
    specialite: "",
    date_naissance: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/utilisateurs/enseignants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newTeacher = await response.json();
        onTeacherAdded(newTeacher);
        onrecharge();
        onClose();
      } else {
        console.error("Erreur lors de l'ajout :", await response.json());
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="nom"
        placeholder="Nom"
        value={formData.nom}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="prenom"
        placeholder="Prénom"
        value={formData.prenom}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="telephone"
        placeholder="Téléphone"
        value={formData.telephone}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="adresse"
        placeholder="Adresse"
        value={formData.adresse}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <select
        title="sexe"
        name="sexe"
        value={formData.sexe}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Sexe</option>
        <option value="Homme">Homme</option>
        <option value="Femme">Femme</option>
      </select>
      <input
        type="text"
        name="specialite"
        placeholder="Spécialité"
        value={formData.specialite}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="date"
        name="date_naissance"
        value={formData.date_naissance}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        Ajouter
      </button>
    </form>
  );
}
