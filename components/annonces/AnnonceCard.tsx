import React from "react";

type AnnonceProps = {
  id_annonce: number;
  titre: string;
  contenu: string;
  date_creation: string;
  admin: {
    utilisateur: {
      nom: string;
      prenom: string;
      email: string;
    };
  };
};

const AnnonceCard: React.FC<AnnonceProps> = ({ 
  titre, 
  contenu, 
  date_creation, 
  admin 
}) => {
  // Formatage de la date si nécessaire (ex: "2023-05-15T12:00:00Z" → "15/05/2023")
  const formattedDate = new Date(date_creation).toLocaleDateString('fr-FR');
  
  // Combinaison du nom et prénom de l'auteur
  const authorName = `${admin.utilisateur.prenom} ${admin.utilisateur.nom}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-semibold text-gray-800">{titre}</h2>
      <p className="text-gray-500 text-sm mt-1">
        {formattedDate} • <span className="font-medium">{authorName}</span>
      </p>
      <p className="mt-3 text-gray-700 leading-relaxed">{contenu}</p>
    </div>
  );
};

export default AnnonceCard;