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
    content:
      "Des séances de révision sont organisées pour mieux vous préparer...",
    fullContent:
      "Des séances de révision auront lieu la semaine précédant les examens. Chaque enseignant proposera des sessions adaptées aux besoins des étudiants. Consultez votre espace étudiant pour voir les créneaux disponibles et vous inscrire. C'est l'occasion idéale pour poser des questions et revoir les points clés du programme.",
    author: "Prof. Dupont",
    date: "2025-02-19",
  },
  {
    id: 2,
    title: "✍️ Devoir à rendre pour la semaine prochaine",
    content:
      "Un devoir est à rendre avant la date limite, consultez les consignes...",
    fullContent:
      "Les étudiants de la filière informatique doivent soumettre leur projet sur les bases de données avant le 26 février. Le travail doit être envoyé via la plateforme universitaire. Tout retard entraînera une pénalité. Consultez les consignes détaillées dans l'espace cours.",
    author: "Prof. Martin",
    date: "2025-02-18",
  },
  {
    id: 3,
    title: "🎙️ Conférence sur les nouvelles technologies",
    content:
      "Un enseignant invité animera une conférence sur les tendances tech...",
    fullContent:
      "Le 5 mars, nous aurons l'honneur d'accueillir un expert en cybersécurité qui donnera une conférence sur les défis actuels et futurs dans ce domaine. La conférence aura lieu en amphithéâtre A et sera suivie d'une session de questions-réponses. Les étudiants intéressés doivent s'inscrire avant le 3 mars.",
    author: "Prof. Lefebvre",
    date: "2025-02-17",
  },
  {
    id: 4,
    title: "📖 Ressources supplémentaires pour le cours",
    content: "Des documents complémentaires sont disponibles en ligne...",
    fullContent:
      "Suite à la demande de plusieurs étudiants, j’ai mis en ligne des ressources supplémentaires pour approfondir les notions vues en cours. Vous pouvez les consulter sur la plateforme Moodle. N’hésitez pas à poser vos questions lors des prochaines séances.",
    author: "Prof. Bernard",
    date: "2025-02-16",
  },
  {
    id: 5,
    title: "📚 Examen de fin de semestre",
    content:
      "Les examens débuteront bientôt. Consultez les horaires et salles...",
    fullContent:
      "Les examens de fin de semestre débuteront le 15 mars pour toutes les filières. Consultez vos calendriers pour voir les horaires et les salles affectées. Une réunion d'information aura lieu le 10 mars pour répondre aux questions des étudiants. Les étudiants doivent également s'assurer d'avoir leur carte universitaire et d'arriver 30 minutes avant le début de l'examen.",
    author: "Administration",
    date: "2025-02-19",
  },
  {
    id: 6,
    title: "🎭 Inscription aux clubs universitaires",
    content: "Rejoignez un club et participez aux événements à venir...",
    fullContent:
      "Les inscriptions aux clubs sont ouvertes jusqu'au 25 février. Chaque club organisera une réunion d'information pour présenter ses activités. Parmi les clubs disponibles : club de théâtre, club de robotique, club de photographie et bien d'autres ! Ne manquez pas l'occasion de rencontrer de nouvelles personnes et de participer à des événements enrichissants tout au long de l'année.",
    author: "Bureau des étudiants",
    date: "2025-02-18",
  },
  {
    id: 7,
    title: "🤖 Conférence sur l'Intelligence Artificielle",
    content:
      "Une conférence sur l'IA se tiendra bientôt avec des experts du domaine...",
    fullContent:
      "Le département d'informatique organise une conférence exclusive sur l'Intelligence Artificielle le 5 mars prochain. Des experts du domaine viendront parler des dernières avancées en machine learning, vision par ordinateur et IA éthique. Les étudiants intéressés peuvent s'inscrire dès maintenant. Un espace sera également prévu pour poser des questions aux conférenciers.",
    author: "Département d'Informatique",
    date: "2025-02-17",
  },
  {
    id: 8,
    title: "📖 Nouvelle bibliothèque numérique",
    content: "Accédez à des milliers de ressources académiques en ligne...",
    fullContent:
      "La bibliothèque centrale a récemment mis en place une plateforme numérique permettant aux étudiants d'accéder à des milliers de livres, articles scientifiques et revues spécialisées. Il suffit d'utiliser votre identifiant universitaire pour vous connecter et commencer à explorer les ressources disponibles. Des ateliers seront également organisés pour apprendre à optimiser vos recherches en ligne.",
    author: "Bibliothèque Centrale",
    date: "2025-02-16",
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
      setAnnonces((prev) => [...prev, { ...formAnnonce, id: prev.length + 1 }]);
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        📢 Annonces
      </h1>

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
          {/* <button
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
          )} */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded shadow-md">
            {annonces.map((annonce) => (
              <div key={annonce.id} className="cursor-pointer p-4 ">
                <AnnonceCard
                  {...annonce}
                  onClick={() => setSelectedAnnonce(annonce)}
                />
                <div className="flex justify-end space-x-4 mt-2">
                  <a
                    href="#"
                    onClick={() => setSelectedAnnonce(annonce)}
                    className="text-blue-600 underline"
                  >
                    Voir plus
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
