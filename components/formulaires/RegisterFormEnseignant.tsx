"use client";

import { useState } from "react";
import ListCard, { User } from "@/components/card/ListCard";

type RegisterFormProps = {
  onClose: () => void;
  onrecharge: () => Promise<void>;
  onTeacherAdded: (newTeacher: User) => void;
};

const RegisterFormEnseignant = ({
  onTeacherAdded,
  onClose,
  onrecharge,
}: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    sexe: "",
    specialite: "",
    matricule: "",
    mot_de_passe: "",

    date_naissance: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/utilisateurs/enseignants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'enseignant");
      }

      const newTeacher = await response.json();
      onTeacherAdded(newTeacher);
      await onrecharge();
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        sexe: "",
        specialite: "",
        matricule: "",
        mot_de_passe: "",
        date_naissance: "",
      });
      onClose();
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg border w-full max-w-2xl">
      <button
          type="button"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          x
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-lg font-bold text-center mb-3">
            Créer un enseignant
          </h1>
          <div className="grid grid-cols-2 gap-3">
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
            <option value="M">Homme</option>
            <option value="F">Femme</option>
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
            type="text"
            name="matricule"
            placeholder="Matricule"
            value={formData.matricule}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="mot_de_passe"
            placeholder="Mot de passe"
            value={formData.mot_de_passe}
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
          </div>
          <div className="flex justify-center mt-3">

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Ajouter
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterFormEnseignant;
