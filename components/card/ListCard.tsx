'use client';
import Image from "next/image";

export interface User {
  image: string;
  nom: string; 
  prenom: string; 
  email: string;
  adresse: string; 
  date: string;
  tel: string; 
}

interface UserCardProps {
  item: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserCard = ({ item, onEdit, onDelete }: UserCardProps) => {
  return (
    <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-md">
      {/* Partie supérieure : Image et infos principales */}
      <div className="flex gap-10 items-start">
        <div className="w-[150px] h-[150px] relative rounded-lg overflow-hidden">
          <Image
            src={item.image}
            alt={`Couverture de ${item.nom}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-semibold">{item.nom}</h3> 
          <p className="text-sm text-gray-700">{item.prenom}</p> 
          <p className="text-sm text-gray-700">{item.email}</p> 
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2 text-gray-800">
            <p className="flex gap-2 items-center">
              <Image src="/icons/book.png" alt="Statut" width={15} height={15} />
              <span>{item.adresse}</span> 
            </p>
          </div>
          <div className="flex flex-col gap-2 text-gray-800">
            <p className="flex gap-2 items-center">
              <Image src="/icons/calendar.png" alt="Date" width={15} height={15} />
              <span>{item.date}</span> {/* Date */}
            </p>
          </div>
        </div>

        {/* Boutons Modifier et Supprimer */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => onEdit(item)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Modifier
          </button>
          <button
            onClick={() => onDelete(item)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;