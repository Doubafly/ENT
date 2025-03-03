import React from "react";

type AnnonceProps = {
  title: string;
  content: string;
  author: string;
  date: string;
};

const AnnonceCard: React.FC<AnnonceProps> = ({ title, content, author, date }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-500 text-sm mt-1">{date} • <span className="font-medium">{author}</span></p>
      <p className="mt-3 text-gray-700 leading-relaxed">{content}</p>
    </div>
  );
};

export default AnnonceCard;
