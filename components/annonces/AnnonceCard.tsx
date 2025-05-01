// components/annonces/AnnonceCard.tsx
import React from "react";

interface AnnonceProps {
  id_annonce: number;
  titre: string;
  contenu: string;
  date_creation: string;
  admin: {
    utilisateur: {
      nom: string;
      prenom: string;
    };
  };
  onViewMore?: () => void;
}

const AnnonceCard: React.FC<AnnonceProps> = ({ 
  titre, 
  contenu, 
  date_creation,  
  admin,
  onViewMore
}) => {
  const formattedDate = new Date(date_creation).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  const authorName = `${admin.utilisateur.prenom} ${admin.utilisateur.nom}`;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800">{titre}</h2>
      <p className="text-gray-500 text-sm mt-1">
        {formattedDate} • <span className="font-medium">{authorName}</span>
      </p>
      <p className="mt-3 text-gray-700 line-clamp-2">
        {contenu}
      </p>
      {onViewMore && (
        <button
          onClick={onViewMore}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          Voir plus
        </button>
      )}
    </div>
  );
};

export default AnnonceCard;