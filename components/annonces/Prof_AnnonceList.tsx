import React, { useState } from "react";
import AnnonceCard from "@/components/annonces/AnnonceCard";
import AnnonceDetail from "@/components/annonces/AnnonceDetail";

type Annonce = {
  id: number;
  title: string;
  content: string;
  fullContent: string;
  author: string;
  date: string;
};

const initialAnnonces: Annonce[] = [
    {
      id: 1,
      title: "📚 Cours de révision avant l'examen",
      content: "Des séances de révision sont organisées pour mieux vous préparer...",
      fullContent: "Des séances de révision auront lieu la semaine précédant les examens. Chaque enseignant proposera des sessions adaptées aux besoins des étudiants. Consultez votre espace étudiant pour voir les créneaux disponibles et vous inscrire. C'est l'occasion idéale pour poser des questions et revoir les points clés du programme.",
      author: "Prof. Dupont",
      date: "2025-02-19",
    },
    {
      id: 2,
      title: "✍️ Devoir à rendre pour la semaine prochaine",
      content: "Un devoir est à rendre avant la date limite, consultez les consignes...",
      fullContent: "Les étudiants de la filière informatique doivent soumettre leur projet sur les bases de données avant le 26 février. Le travail doit être envoyé via la plateforme universitaire. Tout retard entraînera une pénalité. Consultez les consignes détaillées dans l'espace cours.",
      author: "Prof. Dupont",
      date: "2025-02-18",
    },
  ];
  

const AnnonceList: React.FC = () => {
  const [annonces, setAnnonces] = useState<Annonce[]>(initialAnnonces);
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formAnnonce, setFormAnnonce] = useState<Annonce>({
    id: 0,
    title: "",
    content: "",
    fullContent: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleAddOrUpdateAnnonce = () => {
    if (isEditing) {
      setAnnonces((prev) =>
        prev.map((a) => (a.id === formAnnonce.id ? formAnnonce : a))
      );
    } else {
      setAnnonces((prev) => [
        ...prev,
        { ...formAnnonce, id: prev.length + 1 },
      ]);
    }
    setShowForm(false);
    setIsEditing(false);
    setFormAnnonce({
      id: 0,
      title: "",
      content: "",
      fullContent: "",
      author: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleEditAnnonce = (annonce: Annonce) => {
    setFormAnnonce(annonce);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteAnnonce = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      setAnnonces((prev) => prev.filter((a) => a.id !== id));
      setSelectedAnnonce(null);
    }
  };

  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">📢 Annonces</h1>

      {selectedAnnonce ? (
        <div>
          <button
            onClick={() => setSelectedAnnonce(null)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ← Retour aux annonces
          </button>
          <AnnonceDetail
            title={selectedAnnonce.title}
            content={selectedAnnonce.fullContent}
            author={selectedAnnonce.author}
            date={selectedAnnonce.date}
          />
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowForm(true)}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Ajouter une annonce
          </button>

          {showForm && (
            <div className="bg-white p-4 rounded shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">
                {isEditing ? "Modifier l'annonce" : "Ajouter une annonce"}
              </h2>
              <input
                type="text"
                placeholder="Titre"
                value={formAnnonce.title}
                onChange={(e) =>
                  setFormAnnonce({ ...formAnnonce, title: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                placeholder="Résumé"
                value={formAnnonce.content}
                onChange={(e) =>
                  setFormAnnonce({ ...formAnnonce, content: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                placeholder="Contenu détaillé"
                value={formAnnonce.fullContent}
                onChange={(e) =>
                  setFormAnnonce({ ...formAnnonce, fullContent: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Auteur"
                value={formAnnonce.author}
                onChange={(e) =>
                  setFormAnnonce({ ...formAnnonce, author: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={handleAddOrUpdateAnnonce}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isEditing ? "Modifier" : "Ajouter"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                }}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {annonces.map((annonce) => (
              <div key={annonce.id} className="cursor-pointer bg-white p-4 rounded shadow-md">
                <AnnonceCard {...annonce} onClick={() => setSelectedAnnonce(annonce)} />
                <div className="flex justify-end space-x-4 mt-2">
                  <a href="#" onClick={() => setSelectedAnnonce(annonce)} className="text-blue-600 underline">
                    Voir plus
                  </a>
                  <a href="#" onClick={() => handleEditAnnonce(annonce)} className="text-yellow-600 underline">
                    Modifier
                  </a>
                  <a href="#" onClick={() => handleDeleteAnnonce(annonce.id)} className="text-red-600 underline">
                    Supprimer
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AnnonceList;
