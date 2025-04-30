import React from "react";
import { FaSpinner } from "react-icons/fa";
import Calendrier from "./Calendrier";

interface Annonce {
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
}

const RightSidebar = () => {
  const [annonces, setAnnonces] = React.useState<Annonce[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedAnnonce, setSelectedAnnonce] = React.useState<Annonce | null>(null);

  React.useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const response = await fetch('/api/annonce');
        const data = await response.json();
        // Trier par date décroissante et prendre les 5 premières
        const sortedAnnonces = (data.annonces || [])
          .sort((a: Annonce, b: Annonce) => 
            new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime()
          )
          .slice(0, 5);
        setAnnonces(sortedAnnonces);
      } catch (error) {
        console.error("Erreur lors du chargement des annonces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonces();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <aside className="right-sidebar mt-8 space-y-6">
      {/* Section Calendrier */}
      <section>
        <Calendrier />
      </section>

      {/* Section Annonces */}
      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Dernières annonces</h2>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
          </div>
        ) : selectedAnnonce ? (
          // Vue détaillée d'une annonce
          <div className="space-y-4">
            <button 
              onClick={() => setSelectedAnnonce(null)}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center mb-4"
            >
              ← Retour aux annonces
            </button>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="text-lg font-medium">{selectedAnnonce.titre}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(selectedAnnonce.date_creation)} • 
                Par {selectedAnnonce.admin.utilisateur.prenom} {selectedAnnonce.admin.utilisateur.nom}
              </p>
              <p className="mt-3 text-gray-700 whitespace-pre-line">
                {selectedAnnonce.contenu}
              </p>
            </div>
          </div>
        ) : annonces.length > 0 ? (
          // Liste des 5 annonces les plus récentes
          <div className="space-y-4">
            {annonces.map((annonce) => (
              <div 
                key={annonce.id_annonce} 
                className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
              >
                <h3 className="font-medium text-gray-800">{annonce.titre}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(annonce.date_creation)} • 
                  Par {annonce.admin.utilisateur.prenom} {annonce.admin.utilisateur.nom}
                </p>
                <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                  {annonce.contenu}
                </p>
                <button
                  onClick={() => setSelectedAnnonce(annonce)}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  Voir plus →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 py-2">Aucune annonce à afficher</p>
        )}
      </section>
    </aside>
  );
};

export default RightSidebar;
{/* <section className="flex flex-col pb-8">
  <div className="profile-banner" />
  <div className="profile">
    <div className="profile-img">
      <span className="text-5xl font-bold text-blue-500">
        {user.firstName[0]}
      </span>
    </div>
    <div className="profile-details">
      <h1 className="profile-name">
        {user.firstName} {user.lastName}
      </h1>
      <p className="profile-email"> {user.email}</p>
    </div>
  </div>
</section> */}

  {/* <div className="flex w-full justify-between">
    <h2 className="header-2"> list....</h2>
    <Link href="/" className="flex gap-2">
      <Image src="/logo.ico" width={20} height={20} alt="plus" />
      <h2 className="text-14 font-semibold text-gray-600">Dou</h2>
    </Link>
  </div> */}