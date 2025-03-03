import React from "react";

type AnnonceDetailProps = {
  title: string;
  content: string;
  author: string;
  date: string;
};

const AnnonceDetail: React.FC<AnnonceDetailProps> = ({ title, content, author, date }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border-l-4 border-blue-500">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-500 text-sm mt-2">{date} • <span className="font-medium">{author}</span></p>
      <p className="mt-4 text-gray-700 leading-relaxed">{content}</p>
    </div>
  );
};

export default AnnonceDetail;
