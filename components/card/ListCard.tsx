"use client";

import { useState } from "react";
import Image from "next/image";
import UpdateEtudiantModal from "../formulaires/UpdateEtudiantModal";
import UpdateEnseignantModal from "../formulaires/UpdateEnseignantModal"; // Import du modal pour les enseignants

// Définition de l'interface User pour typer les données utilisateur
export interface User {
  notes: any;
  specialite?: string;
  id_utilisateur: number;
  id: number;
  image: string;
  nom: string;
  prenom: string;
  email: string;
  adresse: string;
  date_naissance: string;
  date_inscription: string;
  tel: string;
  filiere: {
    id_filiere: number;
    nom: string;
  };
  matricule: string;
  sexe: string;
}

// Définition de l'interface des props pour le composant UserCard
interface UserCardProps {
  item: User;
  type: "etudiant" | "enseignant"; // Ajout d'un type pour différencier
  onrecharge: () => void;
  onEdit: (id_utilisateur: number, updatedData: any) => void;
  onDelete: (user: User) => void;
  onSelect: (user: User) => void;
}

const UserCard = ({
  item,
  type,
  onEdit,
  onDelete,
  onSelect,
  onrecharge,
}: UserCardProps) => {
  // États pour gérer la visibilité des modaux
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Modal de mise à jour

  // Fonction qui ouvre le modal de mise à jour avec les informations de l'utilisateur
  const handleEditClick = (user: User) => {
    setIsUpdateModalOpen(true); // Ouvre le modal de mise à jour
  };

  // Fonction qui ferme le modal de mise à jour
  const handleCloseModal = () => {
    setIsUpdateModalOpen(false); // Ferme le modal de mise à jour
    onrecharge();
  };

  // Fonction asynchrone pour gérer la mise à jour des informations utilisateur
  const handleUpdate = async (id: number, updatedData: any): Promise<void> => {
    console.log("Mise à jour de l'utilisateur :", id, updatedData); // Affiche l'id et les données mises à jour
    // Soumettre les données mises à jour
    await onEdit(id, updatedData); // Appelle la fonction de mise à jour
    handleCloseModal(); // Ferme le modal après la mise à jour
  };
  const formatDate = (date: string | Date): string => {
    if (!date) return ""; // Si la date est null ou undefined, retourner une chaîne vide
    const d = new Date(date);
    if (isNaN(d.getTime())) return ""; // Si la date est invalide, retourner une chaîne vide
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return (
    <div
      onClick={(e) => {
        if (!isUpdateModalOpen) {
          onSelect(item); // Appelle la fonction de sélection si aucun modal n'est ouvert
        }
      }}
      className="w-[250px] bg-white p-5 rounded-lg shadow-md cursor-pointer"
    >
      {/* Section avec background gris et photo de l'utilisateur */}
      <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
        <div className="w-[102px] h-[115px] relative rounded-full overflow-hidden border">
          <Image
            src={item.image || "/profils/default.jpg"}
            alt={`Photo de ${item.nom}`}
            fill
            sizes="100px"
            className="object-cover w-full h-full text-sm"
          />
        </div>
        <h3 className="text-center font-semibold mt-2 text-lg">
          {item.nom} {item.prenom}
        </h3>
        <p className="text-gray-500 text-sm">{item.email}</p>
      </div>

      {/* Contenu avec deux colonnes : détails à gauche et boutons à droite */}
      <div className="flex items-start mt-4">
        <div className="flex-1 flex flex-col gap-2 text-xs text-gray-700">
          <p className="flex gap-1 items-center text-sm">
            <Image src="/icons/book.png" alt="Adresse" width={12} height={12} />
            {item.adresse}
          </p>
          <p className="flex gap-1 items-center text-sm">
            <Image
              src="/icons/calendar.png"
              alt="Date"
              width={12}
              height={12}
            />
            {formatDate(item.date_naissance)} {/* Utilisation de formatDate */}
          </p>
          <p className="flex gap-1 items-center text-sm">
            <Image
              src="/icons/eye.png"
              alt="Téléphone"
              width={12}
              height={12}
            />
            {item.tel}
          </p>
        </div>

        {/* Section des boutons : Modifier et Supprimer */}
        <div className="flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Empêche la propagation de l'événement de clic
              handleEditClick(item); // Ouvre le modal de mise à jour
            }}
            className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition-all duration-200"
          >
            Modifier
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Empêche la propagation de l'événement de clic
              onDelete(item); // Appelle la fonction de suppression
            }}
            className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition-all duration-200"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Modal de mise à jour des informations utilisateur */}
      {isUpdateModalOpen && (
        <>
          {type === "etudiant" ? (
            <UpdateEtudiantModal
              etudiant={{
                id: item.id,
                id_utilisateur: item.id_utilisateur,
                utilisateurs: {
                  nom: item.nom,
                  prenom: item.prenom,
                  email: item.email,
                  telephone: item.tel,
                  adresse: item.adresse,
                  profil: item.image,
                  sexe: item.sexe,
                },
                matricule: item.matricule, // Added matricule property
                filieres: {
                  id_filiere: item.filiere.id_filiere,
                  nom: item.filiere.nom,
                },
                date_naissance: formatDate(item.date_naissance), // Formatez ici
                date_inscription: formatDate(item.date_inscription), // Formatez ici
              }}
              onClose={handleCloseModal} // Ferme le modal de mise à jour
              onUpdate={handleUpdate} // Appelle la fonction de mise à jour des données
            />
          ) : (
            <UpdateEnseignantModal
              enseignant={{
                id: item.id,
                id_utilisateur: item.id_utilisateur,
                utilisateurs: {
                  nom: item.nom,
                  prenom: item.prenom,
                  email: item.email,
                  telephone: item.tel,
                  adresse: item.adresse,
                  profil: item.image,
                  sexe: item.sexe,
                },
                matricule: item.matricule || "",
                specialite: item.specialite || "",
                date_naissance: formatDate(item.date_naissance),
                date_inscription: formatDate(item.date_inscription),
              }}
              onClose={handleCloseModal}
              onUpdate={handleUpdate}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserCard;
