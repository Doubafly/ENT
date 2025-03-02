
// 'use client';

// import { useState } from "react";
// import Image from "next/image";
// import UpdateEtudiantModal from "../formulaires/UpdateEtudiantModal";

// export interface User {
//   // id: number;  // Ajout de l'ID
//   image: string;
//   nom: string;
//   prenom: string;
//   email: string;
//   adresse: string;
//   date: string;
//   tel: string;
//   filiere: string;
//   matricule: string;
// }

// interface UserCardProps {
//   item: User;
//   onEdit: (user: User) => void;
//   onDelete: (user: User) => void;
//   onSelect: (user: User) => void;
// }

// const UserCard = ({ item, onEdit, onDelete, onSelect }: UserCardProps) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userToDelete, setUserToDelete] = useState<User | null>(null);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   const handleDeleteClick = (user: User) => {
//     setUserToDelete(user);
//     setIsModalOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (userToDelete) {
//       onDelete(userToDelete);
//     }
//     setIsModalOpen(false);
//   };

//   const handleEditClick = (user: User) => {
//     setSelectedUser(user);
//     setIsUpdateModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsUpdateModalOpen(false);
//     setSelectedUser(null);
//   };

//   return (
//     <div
//       onClick={(e) => {
//         if (!isModalOpen && !isUpdateModalOpen) {
//           onSelect(item);
//         }
//       }}
//       className="w-[230px] bg-white p-5 rounded-lg shadow-md cursor-pointer"
//     >
//       {/* Section avec background gris */}
//       <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
//         <div className="w-[100px] h-[100px] relative rounded-full overflow-hidden border">
//           <Image src={item.image} alt={`Photo de ${item.nom}`} fill className="object-cover w-full h-full" />
//         </div>
//         <h3 className="text-center text-sm font-semibold mt-2">
//           {item.nom} {item.prenom}
//         </h3>
//         <p className="text-gray-500 text-xs">{item.email}</p>
//       </div>

//       {/* Contenu en deux colonnes */}
//       <div className="flex items-start mt-4">
//         <div className="flex-1 flex flex-col gap-2 text-xs text-gray-700">
//           <p className="flex gap-1 items-center">
//             <Image src="/icons/book.png" alt="Adresse" width={12} height={12} />
//             {item.adresse}
//           </p>
//           <p className="flex gap-1 items-center">
//             <Image src="/icons/calendar.png" alt="Date" width={12} height={12} />
//             {item.date}
//           </p>
//           <p className="flex gap-1 items-center">
//             <Image src="/icons/call.png" alt="Téléphone" width={12} height={12} />
//             {item.tel}
//           </p>
//         </div>

//         {/* Boutons empilés à droite */}
//         <div className="flex flex-col gap-2">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleEditClick(item);
//             }}
//             className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600 transition-all duration-200"
//           >
//             Modifier
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleDeleteClick(item);
//             }}
//             className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600 transition-all duration-200"
//           >
//             Supprimer
//           </button>
//         </div>
//       </div>

//       {/* Modal de confirmation */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg w-[300px]">
//             <h2 className="text-center text-lg font-semibold mb-4">
//               Êtes-vous sûr ?
//             </h2>
//             <p className="text-center text-sm mb-4">
//               Vous êtes sur le point de supprimer cet utilisateur.
//             </p>
//             <div className="flex justify-around">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400 transition-all duration-200"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleConfirmDelete}
//                 className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-all duration-200"
//               >
//                 Confirmer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//      {/* Modal de mise à jour */}
// {isUpdateModalOpen && selectedUser && (
//   <UpdateEtudiantModal
//     etudiant={{
//       utilisateurs: {
//         nom: selectedUser.nom,
//         prenom: selectedUser.prenom,
//         email: selectedUser.email,
//         telephone: selectedUser.tel,
//         adresse: selectedUser.adresse,
//         profil: selectedUser.image, // Assigne l'image comme profil
//       },
//       filieres: {
//         nom: selectedUser.filiere,
//       },
//       // matricule: selectedUser?.matricule,
//     }}
//     onClose={handleCloseModal}
//     onUpdate={handleCloseModal} // Action de mise à jour
//   />
// )}

//     </div>
//   );
// };

// export default UserCard;
'use client';

import { useState } from "react";
import Image from "next/image";
import UpdateEtudiantModal from "../formulaires/UpdateEtudiantModal";

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

interface UserCardProps {
  item: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onSelect: (user: User) => void;
}

const UserCard = ({ item, onEdit, onDelete, onSelect }: UserCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete);
    }
    setIsModalOpen(false);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedUser(null);
  };

  // Fonction asynchrone pour la mise à jour
  const handleUpdate = async (id: number, updatedData: any): Promise<void> => {
    // Vous pouvez effectuer des actions ici, comme appeler une API pour mettre à jour les données
    console.log(id, updatedData); // Juste un exemple pour afficher l'id et les données mises à jour
    // Après la mise à jour, fermez le modal
    handleCloseModal();
  };

  return (
    <div
      onClick={(e) => {
        if (!isModalOpen && !isUpdateModalOpen) {
          onSelect(item);
        }
      }}
      className="w-[230px] bg-white p-5 rounded-lg shadow-md cursor-pointer"
    >
      {/* Section avec background gris */}
      <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
        <div className="w-[100px] h-[100px] relative rounded-full overflow-hidden border">
          <Image src={item.image} alt={`Photo de ${item.nom}`} fill className="object-cover w-full h-full" />
        </div>
        <h3 className="text-center text-sm font-semibold mt-2">
          {item.nom} {item.prenom}
        </h3>
        <p className="text-gray-500 text-xs">{item.email}</p>
      </div>

      {/* Contenu en deux colonnes */}
      <div className="flex items-start mt-4">
        <div className="flex-1 flex flex-col gap-2 text-xs text-gray-700">
          <p className="flex gap-1 items-center">
            <Image src="/icons/book.png" alt="Adresse" width={12} height={12} />
            {item.adresse}
          </p>
          <p className="flex gap-1 items-center">
            <Image src="/icons/calendar.png" alt="Date" width={12} height={12} />
            {item.date}
          </p>
          <p className="flex gap-1 items-center">
            <Image src="/icons/call.png" alt="Téléphone" width={12} height={12} />
            {item.tel}
          </p>
        </div>

        {/* Boutons empilés à droite */}
        <div className="flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(item);
            }}
            className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600 transition-all duration-200"
          >
            Modifier
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item);
            }}
            className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600 transition-all duration-200"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Modal de confirmation */}
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
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-all duration-200"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

     {/* Modal de mise à jour */}
   
{isUpdateModalOpen && selectedUser && (
  <UpdateEtudiantModal
    etudiant={{
      id: selectedUser.id,  // Assurez-vous que `id` est présent ici
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
    onClose={handleCloseModal}
    onUpdate={handleUpdate}
  />
)}

    </div>
  );
};

export default UserCard;
