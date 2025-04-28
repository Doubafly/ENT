"use client";

import { useState, useEffect } from "react";
import ListCard, { User } from "@/components/card/ListCard";
import Modal from "@/components/modal/Modal";
import RegisterFormEnseignant from "../formulaires/RegisterFormEnseignant"; // Formulaire pour enseignant
import UpdateEnseignantModal from "../formulaires/UpdateEnseignantModal"; // Modal de mise à jour pour enseignant

// Composant principal pour afficher la liste des enseignants
export default function EnseignantList() {
  const [enseignants, setEnseignants] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnseignant, setSelectedEnseignant] = useState<User | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [enseignantToDelete, setEnseignantToDelete] = useState<User | null>(
    null
  );

  const itemsPerPage = 8;

  const formatDate = (date: string | Date): string => {
    if (!date) return "";
    if (typeof date === "string" && date.includes(" ")) {
      date = date.split(" ")[0];
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Récupération des enseignants depuis l'API
  const fetchEnseignants = async () => {
    try {
      const response = await fetch("/api/utilisateurs/enseignants");
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        const formattedEnseignants = data.utilisateurs.map(
          (enseignant: any) => ({
            id: enseignant.id,
            id_utilisateur: enseignant.utilisateur.id_utilisateur,
            nom: enseignant.utilisateur.nom,
            matricule: enseignant.matricule,
            prenom: enseignant.utilisateur.prenom,
            email: enseignant.utilisateur.email,
            sexe: enseignant.utilisateur.sexe,
            image: enseignant.utilisateur.profil || "/profils/default.jpg",
            tel: enseignant.utilisateur.telephone,
            adresse: enseignant.utilisateur.adresse,
            specialite: enseignant.specialite,
            profil: enseignant.utilisateur.profil,
            date_naissance: formatDate(enseignant.date_naissance),
          })
        );

        setEnseignants(formattedEnseignants);
      } else {
        console.error(
          "Erreur lors de la récupération des enseignants :",
          data.message
        );
      }
    } catch (error) {
      console.error("Erreur lors du fetch :", error);
    }
  };

  useEffect(() => {
    fetchEnseignants();
  }, []);

  // Mise à jour d'un enseignant
  const handleUpdateEnseignant = async (
    id_utilisateur: number,
    updatedData: any
  ) => {
    try {
      const response = await fetch(
        `/api/utilisateurs/enseignants/${id_utilisateur}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        const updatedEnseignant = await response.json();
        setEnseignants((prev) =>
          prev.map((enseignant) =>
            enseignant.id === id_utilisateur
              ? { ...enseignant, ...updatedEnseignant }
              : enseignant
          )
        );
        await fetchEnseignants();
        setIsUpdateModalOpen(false);
      } else {
        console.error("Erreur lors de la mise à jour :", await response.json());
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };

  // Fonction pour gérer la suppression d'un enseignant
  const handleDeleteEnseignant = async () => {
    if (!enseignantToDelete) return;

    try {
      const response = await fetch(
        `/api/utilisateurs/enseignants/${enseignantToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setEnseignants((prev) =>
          prev.filter((enseignant) => enseignant.id !== enseignantToDelete.id)
        );
        setIsDeleteModalOpen(false);
        setEnseignantToDelete(null);
      } else {
        const errorText = await response.text();
        console.error("Erreur lors de la suppression :", errorText);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'enseignant :", error);
    }
  };

  // Fonction pour ouvrir le modal de suppression
  const confirmDeleteEnseignant = (enseignant: User) => {
    setEnseignantToDelete(enseignant);
    setIsDeleteModalOpen(true);
  };

  // Filtrage des enseignants
  const filteredEnseignants = enseignants.filter((enseignant) => {
    return (
      `${enseignant.nom} ${enseignant.prenom} ${enseignant.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (classFilter ? enseignant.specialite === classFilter : true)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredEnseignants.length / itemsPerPage);
  const currentEnseignants = filteredEnseignants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleSelectEnseignant = (enseignant: User) => {
    setSelectedEnseignant(enseignant);
    console.log(enseignant);
  };

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
          className="w-1/3 p-3 border rounded-lg text-sm"
        />
        <select
          title="filtre"
          value={classFilter}
          onChange={(e) => {
            setClassFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/3 p-3 border rounded-lg text-sm"
        >
          <option value="">Filtrer par spécialité</option>
          {[...new Set(enseignants.map((e) => e.specialite))].map(
            (specialite) => (
              <option key={specialite} value={specialite}>
                {specialite}
              </option>
            )
          )}
        </select>
        <button
          onClick={() => setShowForm(true)}
          className="w-1/10 p-3 border rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 transition duration-200"    
        >
          + Ajouter
        </button>
      </div>

      {/* Liste des enseignants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {currentEnseignants.map((enseignant) => (
          <ListCard
            key={enseignant.id_utilisateur}
            item={{
              ...enseignant,
              date_naissance: formatDate(enseignant.date_naissance),
            }}
            onrecharge={fetchEnseignants}
            onDelete={() => confirmDeleteEnseignant(enseignant)}
            onSelect={() => handleSelectEnseignant(enseignant)}
            onEdit={handleUpdateEnseignant}
            type={"enseignant"}
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 text-xs"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Modal d'ajout d'un enseignant */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              X
            </button>
            <h2 className="text-lg font-bold mb-4">Ajouter un enseignant</h2>
            <RegisterFormEnseignant
              onClose={() => setShowForm(false)}
              onrecharge={fetchEnseignants}
              onTeacherAdded={(newTeacher: User) => {
                setEnseignants((prev) => [...prev, newTeacher]);
              }}
            />
          </div>
        </Modal>
      )}
      {selectedEnseignant && (
        <Modal onClose={() => setSelectedEnseignant(null)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
            {/* Bouton Fermer */}
            <button
              onClick={() => setSelectedEnseignant(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              x
            </button>

            {/* Image de profil et Nom */}
            <div className="flex flex-col items-center mb-4">
              <img
                title="imgEstudiant"
                src={selectedEnseignant.image}
                className="object-cover w-[220px] h-[220px] rounded-full border"
              />
              {/* <h2 className="text-lg font-bold mt-2">{selectedEnseignant.nom} {selectedEnseignant.prenom}</h2>
              <p className="text-gray-500 text-sm">{selectedEnseignant.email}</p> */}
            </div>

            {/* Informations détaillées en colonnes */}
            <div className="grid grid-cols-2 gap-4 text-lg border-t pt-4">
            <p>
    <span className="italic underline font-bold">Nom</span> : {selectedEnseignant.nom}
  </p>
  <p>
    <span className="italic underline font-bold">Prénom</span> : {selectedEnseignant.prenom}
  </p>
  <p>
    <span className="italic underline font-bold">Email</span> : {selectedEnseignant.email}
  </p>
  <p>
    <span className="italic underline font-bold">Sexe</span> : {selectedEnseignant.sexe}
  </p>
  <p>
    <span className="italic underline font-bold">Téléphone</span> : {selectedEnseignant.tel || "Non renseigné"}
  </p>
  <p>
    <span className="italic underline font-bold">Adresse</span> : {selectedEnseignant.adresse || "Non renseignée"}
  </p>
  <p>
    <span className="italic underline font-bold">Matricule</span> : {selectedEnseignant.matricule}
  </p>
  <p>
    <span className="italic underline font-bold">Spécialité</span> : {selectedEnseignant.specialite || "Non renseignée"}
  </p>
             
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
            <p className="text-sm mb-4">
              Êtes-vous sûr de vouloir supprimer l'enseignant{" "}
              <span className="font-semibold">
                {enseignantToDelete?.nom} {enseignantToDelete?.prenom}
              </span>{" "}
              ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteEnseignant}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Supprimer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}