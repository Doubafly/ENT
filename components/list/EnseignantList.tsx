"use client";

import ListCard, { User } from "@/components/card/ListCard";
import Modal from "@/components/modal/Modal";
import RegisterFormEnseignant from "../formulaires/FormulaireProf";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function EnseignantList() {
  const [enseignants, setEnseignants] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEnseignant, setSelectedEnseignant] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 8;

  // Fonction pour supprimer un enseignant
  const handleDelete = (nom: string) => {
    const updatedEnseignants = enseignants.filter(
      (enseignant) => enseignant.nom !== nom
    );
    setEnseignants(updatedEnseignants);
  };

  // Récupération des enseignants depuis l'API
  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        const res = await fetch("/api/utilisateurs/enseignants");
        if (!res.ok) {
          console.error("Erreur HTTP :", res.status);
          return;
        }
        const data = await res.json();
        console.log("Réponse de l'API :", data);
        setEnseignants(data.utilisateurs || []);
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      }
    };
    fetchEnseignants();
  }, []);

  // Filtrage des enseignants
  const filteredEnseignants = enseignants.filter((enseignant) => {
    return (
      `${enseignant.nom} ${enseignant.prenom} ${enseignant.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (classFilter ? enseignant.filiere === classFilter : true) &&
      (yearFilter ? enseignant.date === yearFilter : true)
    );
  });

  const totalPages = Math.ceil(filteredEnseignants.length / itemsPerPage);
  const currentEnseignants = filteredEnseignants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="ml-0 px-1 py-5 text-xl">
      <div className="flex justify-between items-center mb-4 ml-6">
        <input
          type="text"
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/4 p-3 border rounded-lg text-xs"
        />
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-2 bg-green-500 hover:bg-blue-300 text-white text-ms rounded-lg mr-4"
        >
          + Ajouter
        </button>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {currentEnseignants.map((enseignant, index) => (
            <ListCard
              key={`${enseignant.email}-${index}`}
              item={enseignant}
              onEdit={() => {}}
              onDelete={() => handleDelete(enseignant.nom)}
              onSelect={() => setSelectedEnseignant(enseignant)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}