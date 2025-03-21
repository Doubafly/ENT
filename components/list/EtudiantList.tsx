
"use client";

import { useState, useEffect } from "react";
import ListCard, { User } from "@/components/card/ListCard";
import Modal from "@/components/modal/Modal";
import RegisterFormEtudiant from "../formulaires/RegisterFormEtudiant ";

// Composant principal pour afficher la liste des étudiants
export default function EtudiantList() {
  const [etudiants, setEtudiants] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEtudiant, setSelectedEtudiant] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 8;

  // Récupération des étudiants depuis l'API
  useEffect(() => {
    const fetchEtudiants = async () => {
      try {
        const response = await fetch("/api/utilisateurs/etudiants");
        const data = await response.json();

        if (response.ok) {
          // Transformer les données récupérées en un format exploitable
          const formattedEtudiants = data.etudiants.map((etudiant: any) => ({
            id: etudiant.id_utilisateur,
            nom: etudiant.utilisateur.nom,
            prenom: etudiant.utilisateur.prenom,
            email: etudiant.utilisateur.email,
            sexe: etudiant.utilisateur.sexe,
            image: etudiant.utilisateur.profil || "/profils/default.jpg",
            tel: etudiant.utilisateur.telephone,
            adresse: etudiant.utilisateur.adresse,
            matricule: etudiant.matricule,
            filiere: etudiant.filiere.nom, // Nom de la filière
            date: etudiant.date_inscription,
          }));

          setEtudiants(formattedEtudiants);
        } else {
          console.error("Erreur lors de la récupération des étudiants :", data.message);
        }
      } catch (error) {
        console.error("Erreur lors du fetch :", error);
      }
    };

    fetchEtudiants();
  }, []);

  // Filtrage des étudiants
  const filteredEtudiants = etudiants.filter((etudiant) => {
    return (
      `${etudiant.nom} ${etudiant.prenom} ${etudiant.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (classFilter ? etudiant.filiere === classFilter : true) &&
      (yearFilter ? etudiant.date === yearFilter : true)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);
  const currentEtudiants = filteredEtudiants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="ml-0 px-1 py-5 text-xl">
      {/* Barre de recherche et filtres */}
      <div className="flex justify-between items-center mb-4 ml-6 ">
        <input
          type="text"
          placeholder="Rechercher un étudiant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/3 p-3 border rounded-lg text-sm"
        />
        <select
          value={classFilter}
          onChange={(e) => {
            setClassFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/4 p-3 border rounded-lg text-sm"
        >
          <option value="">Filtrer par classe</option>
          {[...new Set(etudiants.map((e) => e.filiere))].map((filiere) => (
            <option key={filiere} value={filiere}>
              {filiere}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-green-500 hover:bg-blue-300 text-white text-sm rounded-lg mr-4"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des étudiants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {currentEtudiants.map((etudiant) => (
          <ListCard
            key={etudiant.id}
            item={etudiant}
            onDelete={() => { } }
            onSelect={() => setSelectedEtudiant(etudiant)} onEdit={function (user: User): void {
              throw new Error("Function not implemented.");
            } }          />
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
      {selectedEtudiant && (
  <Modal onClose={() => setSelectedEtudiant(null)}>
    <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
      {/* Bouton Fermer */}
      <button
        onClick={() => setSelectedEtudiant(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        x
      </button>

      {/* Image de profil et Nom */}
      <div className="flex flex-col items-center mb-4">
        <img
          src={selectedEtudiant.image}
          alt={`Photo de ${selectedEtudiant.nom}`}
          className="object-cover w-[120px] h-[120px] rounded-full border"
        />
        <h2 className="text-lg font-bold mt-2">{selectedEtudiant.nom} {selectedEtudiant.prenom}</h2>
        <p className="text-gray-500 text-sm">{selectedEtudiant.email}</p>
      </div>

      {/* Informations détaillées en colonnes */}
      <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
        <p><strong>Sexe :</strong> {selectedEtudiant.sexe}</p>
        <p><strong>Téléphone :</strong> {selectedEtudiant.tel || "Non renseigné"}</p>
        <p><strong>Adresse :</strong> {selectedEtudiant.adresse || "Non renseignée"}</p>
        <p><strong>Matricule :</strong> {selectedEtudiant.matricule}</p>
        <p><strong>Filière :</strong> {selectedEtudiant.filiere}</p>
        <p>
  <strong>Date d'inscription :</strong>{" "}
  {new Date(selectedEtudiant.date).toLocaleDateString("fr-FR")}
</p>

      </div>
    </div>
  </Modal>
)}
      {/* Modal d'ajout d'un étudiant */}
{showForm && (
  <Modal onClose={() => setShowForm(false)}>
    <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
      {/* Bouton Fermer */}
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        X
      </button>

      {/* Formulaire d'ajout d'un étudiant */}
      <h2 className="text-lg font-bold mb-4">Ajouter un étudiant</h2>
      <RegisterFormEtudiant onClose={() => setShowForm(false)} onSubmit={function (formData: FormData): Promise<void> {
              throw new Error("Function not implemented.");
            } } />
    </div>
  </Modal>
)}

      
    </div>
  );
}
