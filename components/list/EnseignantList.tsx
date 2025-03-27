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
  const itemsPerPage = 8;

  // Fonction pour supprimer un enseignant
  const handleDelete = (nom: string) => {
    setEnseignants((prev) => prev.filter((enseignant) => enseignant.nom !== nom));
  };

  // Récupération des enseignants depuis l'API
  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        const res = await fetch("/api/utilisateurs/enseignants");
        const data = await res.json();
        console.log("Réponse API complète :", JSON.stringify(data, null, 2));
  
        if (!res.ok) {
          throw new Error(data.message || "Erreur lors de la récupération des enseignants");
        }
  
        // Vérification plus flexible de la structure des données
        const receivedData = data.enseignants || data.utilisateurs || data;
        
        if (!receivedData || !Array.isArray(receivedData)) {
          throw new Error("Données invalides reçues de l'API - Format de tableau attendu");
        }
  
        console.log("Données à mapper :", receivedData);
  
        const formattedEnseignants = receivedData.map((item: any) => {
          // Essayez d'accéder aux données de différentes manières selon la structure réelle
          const utilisateur = item.utilisateur || item;
          
          return {
            id: utilisateur.id_utilisateur || utilisateur.id || "ID inconnu",
            nom: utilisateur.nom || "Nom inconnu",
            prenom: utilisateur.prenom || "",
            email: utilisateur.email || "",
            sexe: utilisateur.sexe || "",
            image: utilisateur.profil || "/profils/default.jpg",
            tel: utilisateur.telephone || "",
            adresse: utilisateur.adresse || "",
            matricule: item.matricule || "",
            filiere: item.specialite || item.filiere || "Non renseigné",
            date: utilisateur.date_creation || "",
          };
        });
  
        setEnseignants(formattedEnseignants);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Erreur lors du fetch :", error.message);
        } else {
          console.error("Erreur lors du fetch :", error);
        }
      }
    };
  
    fetchEnseignants();
  }, []);
  

  // Filtrage des enseignants
  const filteredEnseignants = enseignants.filter((enseignant) => 
    `${enseignant.nom} ${enseignant.prenom} ${enseignant.email}`.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (classFilter ? enseignant.filiere === classFilter : true) &&
    (yearFilter ? enseignant.date.includes(yearFilter) : true)
  );

  const totalPages = Math.ceil(filteredEnseignants.length / itemsPerPage);
  const currentEnseignants = filteredEnseignants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="ml-0 px-1 py-5 text-xl">
      {/* Barre de recherche et filtres */}
      <div className="flex justify-between items-center mb-4 ml-6">
        <input
          type="text"
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/3 p-3 border rounded-lg text-xs"
        />
        <select
          value={classFilter}
          onChange={(e) => {
            setClassFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/4 p-3 border rounded-lg text-xs"
        >
          <option value="">Filtrer par filière</option>
          {[...new Set(enseignants.map((e) => e.filiere))].map((filiere) => (
            <option key={filiere} value={filiere}>
              {filiere}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-2 bg-green-500 hover:bg-blue-300 text-white text-xs rounded-lg mr-4"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des enseignants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {currentEnseignants.map((enseignant) => (
          <ListCard
            key={enseignant.id}
            item={enseignant}
            onDelete={() => handleDelete(enseignant.nom)}
            onSelect={() => setSelectedEnseignant(enseignant)}
            onEdit={() => {}}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 text-xs"
          >
            Précédent
          </button>
          <span className="text-xs font-semibold">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 text-xs"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Modal d'affichage des détails */}
      {selectedEnseignant && (
        <Modal onClose={() => setSelectedEnseignant(null)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
            <button
              onClick={() => setSelectedEnseignant(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>

            <div className="flex flex-col items-center mb-4">
              <Image
                src={selectedEnseignant.image}
                alt={`Photo de ${selectedEnseignant.nom}`}
                width={120}
                height={120}
                className="object-cover rounded-full border"
              />
              <h2 className="text-lg font-bold mt-2">{selectedEnseignant.nom} {selectedEnseignant.prenom}</h2>
              <p className="text-gray-500 text-sm">{selectedEnseignant.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
              <p><strong>Sexe :</strong> {selectedEnseignant.sexe}</p>
              <p><strong>Téléphone :</strong> {selectedEnseignant.tel || "Non renseigné"}</p>
              <p><strong>Adresse :</strong> {selectedEnseignant.adresse || "Non renseignée"}</p>
              <p><strong>Matricule :</strong> {selectedEnseignant.matricule}</p>
              <p><strong>Filière :</strong> {selectedEnseignant.filiere}</p>
              <p><strong>Date d'inscription :</strong> {new Date(selectedEnseignant.date).toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal d'ajout d'un enseignant */}
      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold mb-4">Ajouter un enseignant</h2>
            <RegisterFormEnseignant 
              onClose={() => setIsAddModalOpen(false)} 
              onSubmit={async (formData) => {
                // Handle form submission logic here
                console.log("Form submitted:", formData);
              }} 
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
