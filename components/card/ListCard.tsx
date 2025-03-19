"use client";

import { useState } from "react";
import Image from "next/image";
import UpdateEtudiantModal from "../formulaires/UpdateEtudiantModal";

// Définition de l'interface User pour typer les données utilisateur
export interface User {
  id: number;
  image: string;
  nom: string;
  prenom: string;
  email: string;
  adresse: string;
  date: string;
  tel: string;
  filiere: string;
  matricule: string;
}

// Définition de l'interface des props pour le composant UserCard
interface UserCardProps {
  item: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onSelect: (user: User) => void;
}

const UserCard = ({ item, onEdit, onDelete, onSelect }: UserCardProps) => {
  // États pour gérer la visibilité des modaux
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal de confirmation de suppression
  const [userToDelete, setUserToDelete] = useState<User | null>(null); // Utilisateur à supprimer
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Modal de mise à jour
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Utilisateur sélectionné pour la mise à jour

  // Fonction qui ouvre le modal de confirmation de suppression
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user); // Stocke l'utilisateur à supprimer
    setIsModalOpen(true); // Ouvre le modal de confirmation
  };

  // Fonction qui confirme la suppression de l'utilisateur
  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete); // Appelle la fonction de suppression
    }
    setIsModalOpen(false); // Ferme le modal de confirmation
  };

  // Fonction qui ouvre le modal de mise à jour avec les informations de l'utilisateur
  const handleEditClick = (user: User) => {
    setSelectedUser(user); // Définit l'utilisateur sélectionné
    setIsUpdateModalOpen(true); // Ouvre le modal de mise à jour
  };

  // Fonction qui ferme le modal de mise à jour
  const handleCloseModal = () => {
    setIsUpdateModalOpen(false); // Ferme le modal de mise à jour
    setSelectedUser(null); // Réinitialise l'utilisateur sélectionné
  };

  // Fonction asynchrone pour gérer la mise à jour des informations utilisateur
  const handleUpdate = async (id: number, updatedData: any): Promise<void> => {
    console.log(id, updatedData); // Affiche l'id et les données mises à jour (vous pouvez remplacer cela par un appel API)
    handleCloseModal(); // Ferme le modal après la mise à jour
  };

  return (
    <div
      onClick={(e) => {
        if (!isModalOpen && !isUpdateModalOpen) {
          onSelect(item); // Appelle la fonction de sélection si aucun modal n'est ouvert
        }
      }}
      className="w-[230px] bg-white p-5 rounded-lg shadow-md cursor-pointer"
    >
      {/* Section avec background gris et photo de l'utilisateur */}
      <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
        <div className="w-[100px] h-[100px] relative rounded-full overflow-hidden border">
          <Image
            src={item.image}
            alt={`Photo de ${item.nom}`}
            fill
            sizes="100px"
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-center text-sm font-semibold mt-2">
          {item.nom} {item.prenom}{" "}
          {/* Affiche le nom et prénom de l'utilisateur */}
        </h3>
        <p className="text-gray-500 text-xs">{item.email}</p>{" "}
        {/* Affiche l'email de l'utilisateur */}
      </div>

      {/* Contenu avec deux colonnes : détails à gauche et boutons à droite */}
      <div className="flex items-start mt-4">
        <div className="flex-1 flex flex-col gap-2 text-xs text-gray-700">
          <p className="flex gap-1 items-center">
            <Image src="/icons/book.png" alt="Adresse" width={12} height={12} />
            {item.adresse} {/* Affiche l'adresse de l'utilisateur */}
          </p>
          <p className="flex gap-1 items-center">
            <Image
              src="/icons/calendar.png"
              alt="Date"
              width={12}
              height={12}
            />
            {item.date} {/* Affiche la date associée à l'utilisateur */}
          </p>
          <p className="flex gap-1 items-center">
            <Image
              src="/icons/call.png"
              alt="Téléphone"
              width={12}
              height={12}
            />
            {item.tel} {/* Affiche le numéro de téléphone de l'utilisateur */}
          </p>
        </div>

        {/* Section des boutons : Modifier et Supprimer */}
        <div className="flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Empêche la propagation de l'événement de clic
              handleEditClick(item); // Ouvre le modal de mise à jour
            }}
            className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600 transition-all duration-200"
          >
            Modifier
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Empêche la propagation de l'événement de clic
              handleDeleteClick(item); // Ouvre le modal de confirmation de suppression
            }}
            className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600 transition-all duration-200"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[300px]">
            <h2 className="text-center text-lg font-semibold mb-4">
              Êtes-vous sûr ?
            </h2>
            <p className="text-center text-sm mb-4">
              Vous êtes sur le point de supprimer cet utilisateur.
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => setIsModalOpen(false)} // Ferme le modal sans suppression
                className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete} // Confirme la suppression de l'utilisateur
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-all duration-200"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de mise à jour des informations utilisateur */}
      {isUpdateModalOpen && selectedUser && (
        <UpdateEtudiantModal
          etudiant={{
            id: selectedUser.id, // Passe l'id de l'utilisateur pour la mise à jour
            utilisateurs: {
              nom: selectedUser.nom,
              prenom: selectedUser.prenom,
              email: selectedUser.email,
              telephone: selectedUser.tel,
              adresse: selectedUser.adresse,
              profil: selectedUser.image,
            },
            filieres: {
              nom: selectedUser.filiere,
            },
          }}
          onClose={handleCloseModal} // Ferme le modal de mise à jour
          onUpdate={handleUpdate} // Appelle la fonction de mise à jour des données
        />
      )}
    </div>
  );
};

export default UserCard;
