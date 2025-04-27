import React from "react";

type AnnonceDetailProps = {
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

const AnnonceDetail: React.FC<AnnonceDetailProps> = ({ 
  titre, 
  contenu, 
  date_creation, 
  admin 
}) => {
  // Formatage de la date
  const formattedDate = new Date(date_creation).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Nom complet de l'auteur
  const authorName = `${admin.utilisateur.prenom} ${admin.utilisateur.nom}`;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border-l-4 border-blue-500">
      <h1 className="text-3xl font-bold text-gray-800">{titre}</h1>
      <p className="text-gray-500 text-sm mt-2">
        Publié le {formattedDate} • <span className="font-medium">{authorName}</span>
      </p>
      <div className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line">
        {contenu}
      </div>
    </div>
  );
};

export default AnnonceDetail;