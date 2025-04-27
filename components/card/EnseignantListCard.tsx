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
    filiere_module: any;
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
  onSelect: (user: User) => void;
}

const UserCard = ({ item, onSelect }: UserCardProps) => {
  return (
    <div
      onClick={(e) => {
        onSelect(item); // Appelle la fonction de sélection si aucun modal n'est ouvert
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

       {/* Contenu avec deux colonnes : détails alignés à droite */}
       <div className="flex items-start mt-5">
        <div className="flex-1 flex flex-col gap-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <p className="flex gap-2 items-center text-base">
              <Image
                src="/icons/location.png"
                alt="Adresse"
                width={14}
                height={14}
              />
              {item.adresse}
            </p>
            <p className="flex gap-1 items-center text-base">
              <Image
                src="/icons/user.png"
                alt="Matricule"
                width={14}
                height={14}
              />
              {item.matricule}
            </p>
          </div>
          <div className="flex justify-between">
          <p className="flex gap-1 items-center text-base">
              <Image
                src="/icons/tel.png"
                alt="Téléphone"
                width={14}
                height={15}
              />
              {item.tel}
            </p>
           
            <p className="flex gap-1 items-center text-base">
              <Image
                src="/icons/filiere.png"
                alt="Filière"
                width={16}
                height={16}
              />
              {item.filiere.nom}
            </p>
          </div>
          {/* Ajout de l'année académique */}
<div className="flex justify-center mt-2">
  <p className="flex gap-1 items-center text-base">
    <Image
      src="/icons/calendar.png"
      alt="Année académique"
      width={16}
      height={16}
    />
    {item.filiere.filiere_module[0]?.cours[0]?.sessions?.annee_academique || "Non renseignée"}
  </p>
</div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;