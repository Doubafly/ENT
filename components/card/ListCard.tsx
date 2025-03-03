// // 'use client';
// // import Image from "next/image";

// // export interface User {
// //   image: string;
// //   nom: string; 
// //   prenom: string; 
// //   email: string;
// //   adresse: string; 
// //   date: string;
// //   tel: string; 
// // }

// // interface UserCardProps {
// //   item: User;
// //   onEdit: (user: User) => void;
// //   onDelete: (user: User) => void;
// // }

// // const UserCard = ({ item, onEdit, onDelete }: UserCardProps) => {
// //   return (
// //     <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-md min-h-[300px]">
// //       {/* Partie supérieure : Image et infos principales */}
// //       <div className="flex gap-10 items-start">
// //         <div className="w-[120px] h-[120px] relative rounded-lg overflow-hidden">
// //           <Image
// //             src={item.image}
// //             alt={`Photo de ${item.nom}`}
// //             fill
// //             className="object-cover w-full h-full"
// //           />
// //         </div>
// //         <div className="flex flex-col gap-3">
// //           <h3 className="text-2xl font-semibold">{item.nom}</h3>
// //           <p className="text-sm text-gray-700">{item.prenom}</p>
// //           <p className="text-sm text-gray-700">{item.email}</p>
// //         </div>
// //       </div>

// //       {/* Partie inférieure avec infos supplémentaires et boutons */}
// //       <div className="flex flex-col gap-4 mt-4">
// //         <div className="flex justify-between">
// //           <div className="flex flex-col gap-2 text-gray-800">
// //             <p className="flex gap-2 items-center">
// //               <Image src="/icons/book.png" alt="Statut" width={15} height={15} />
// //               <span>{item.adresse}</span>
// //             </p>
// //           </div>
// //           <div className="flex flex-col gap-2 text-gray-800">
// //             <p className="flex gap-2 items-center">
// //               <Image src="/icons/calendar.png" alt="Date" width={15} height={15} />
// //               <span>{item.date}</span>
// //             </p>
// //           </div>
// //         </div>

// //         {/* Boutons Modifier et Supprimer */}
// //         <div className="flex justify-end gap-4">
// //           <button
// //             onClick={() => onEdit(item)}
// //             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
// //           >
// //             Modifier
// //           </button>
// //           <button
// //             onClick={() => onDelete(item)}
// //             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
// //           >
// //             Supprimer
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };


// // export default UserCard;
// 'use client';

// import Image from "next/image";

// export interface User {
//   image: string;
//   nom: string;
//   prenom: string;
//   email: string;
//   adresse: string;
//   date: string;
//   tel: string;
// }

// interface UserCardProps {
//   item: User;
//   onEdit: (user: User) => void;
//   onDelete: (user: User) => void;
// }

// const UserCard = ({ item, onEdit, onDelete }: UserCardProps) => {
//   return (
//     <div className="w-[250px] bg-white p-5 rounded-lg shadow-md">
//       {/* Section avec background gris */}
//       <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
//         {/* Image centrée */}
//         <div className="w-[100px] h-[100px] relative rounded-full overflow-hidden border">
//           <Image
//             src={item.image}
//             alt={`Photo de ${item.nom}`}
//             fill
//             className="object-cover w-full h-full"
//           />
//         </div>

//         {/* Nom et Email */}
//         <h3 className="text-center text-sm font-semibold mt-2">
//           {item.nom} {item.prenom}
//         </h3>
//         <p className="text-gray-500 text-xs">{item.email}</p>
//       </div>

//       {/* Contenu en deux colonnes */}
//       <div className="flex items-start mt-4">
//         {/* Infos à gauche */}
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
//             <Image src="/icons/call.png" alt="Date" width={12} height={12} />
//             {item.tel}
//           </p>
//         </div>

//         {/* Boutons empilés à droite */}
//         <div className="flex flex-col gap-2">
//           <button
//             onClick={() => onEdit(item)}
//             className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600 transition-all duration-200"
//           >
//             Modifier
//           </button>
//           <button
//             onClick={() => onDelete(item)}
//             className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600 transition-all duration-200"
//           >
//             Supprimer
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserCard;
'use client';

import { useState } from "react";
import Image from "next/image";

export interface User {
  image: string;
  nom: string;
  prenom: string;
  email: string;
  adresse: string;
  date: string;
  tel: string;
  classe: string;

  
}

interface UserCardProps {
  item: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onSelect: (user: User) => void;  // Ajout de onSelect
}



const UserCard = ({ item, onEdit, onDelete, onSelect }: UserCardProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <div
    onClick={(e) => {
      if (!isModalOpen) {
        onSelect(item);
      }
    }}
    className="w-[230px] bg-white p-5 rounded-lg shadow-md cursor-pointer"
    >
      {/* Section avec background gris */}
      <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
        {/* Image centrée */}
        <div className="w-[100px] h-[100px] relative rounded-full overflow-hidden border">
          <Image
            src={item.image}
            alt={`Photo de ${item.nom}`}
            fill
            className="object-cover w-full h-full"
          />
        </div>

        {/* Nom et Email */}
        <h3 className="text-center text-sm font-semibold mt-2">
          {item.nom} {item.prenom}
        </h3>
        <p className="text-gray-500 text-xs">{item.email}</p>
      </div>

      {/* Contenu en deux colonnes */}
      <div className="flex items-start mt-4">
        {/* Infos à gauche */}
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
              e.stopPropagation(); // Empêche le onSelect lors du clic
              onEdit(item);
            }}
            className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600 transition-all duration-200"
          >
            Modifier
          </button>
          <button
              onClick={(e) => {
                e.stopPropagation(); // Empêche le onSelect lors du clic
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
                onClick={handleCancelDelete}
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
    </div>
  );
};

export default UserCard;
