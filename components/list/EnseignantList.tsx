"use client";

import { useState } from "react";
import ListCard, { User } from "@/components/card/ListCard";
import Modal from "@/components/modal/Modal";

const enseignantsData: User[] = [
  { image: "/img/profil1.jpg", nom: "Dupont", prenom: "Jean", email: "mah@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil2.jpg", nom: "Dupont", prenom: "Jean", email: "kissa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil3.jpg", nom: "Dupont", prenom: "Jean", email: "awa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil4.jpg", nom: "Dupont", prenom: "Jean", email: "dramane@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil5.jpg", nom: "Dupont", prenom: "Jean", email: "moussa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil6.jpg", nom: "Dupont", prenom: "Jean", email: "issa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil6.jpg", nom: "Dupont", prenom: "Jean", email: "issa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil7.jpg", nom: "Dupont", prenom: "Jean", email: "bourma@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil8.jpg", nom: "Maiga", prenom: "Mahamoud", email: "bourma@example.com", adresse: "Bamako, Sotuba", date: "01/01/1980", tel: "0123456789" },
  { image: "/img/profil9.jpg", nom: "DIALLO", prenom: "Moussa", email: "bourma@example.com", adresse: "Bamako, Mali", date: "01/01/1980", tel: "0123456789" },
];

export default function EnseignantList() {
  const [enseignants, setEnseignants] = useState<User[]>(enseignantsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnseigant, setSelectedEnseignant] = useState<User | null>(null); // État pour gérer l'affichage du modal
  const itemsPerPage = 8;

  // Filtrage des enseignants en fonction du terme de recherche
  const filteredEnseignants = enseignants.filter((enseignant) =>
    `${enseignant.nom} ${enseignant.prenom} ${enseignant.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcul des pages
  const totalPages = Math.ceil(filteredEnseignants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnseignants = filteredEnseignants.slice(indexOfFirstItem, indexOfLastItem);

  // Gérer la pagination
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Gérer la suppression d'un enseignant
  const handleDelete = (user: User) => {
    const updatedEnseignants = enseignants.filter((e) => e.email !== user.email);
    // setEnseignants(updatedEnseignants);
    setEnseignants([...updatedEnseignants]);

    // Vérifier si la suppression a vidé la page courante
    const newTotalPages = Math.ceil(updatedEnseignants.length / itemsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
    }
  };
  // console.log("Enseignants:", enseignants);
  // console.log("Current enseignants affichés:", currentEnseignants);
  // console.log(`Page actuelle : ${currentPage} / ${totalPages}`);
  
  return (
    <div className="ml-0 px-1 py-5 text-xl">
      {/* Titre, barre de recherche et bouton Ajouter */}
      <div className="flex justify-between items-center mb-4 ml-6">
        <h1 className="text-xl font-bold">Liste des Enseignants</h1>
        <input
          type="text"
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Revenir à la première page lors d'une recherche
          }}
          className="w-1/3 p-3 border rounded-lg text-xs"
        />
        <button className="px-6 py-2 bg-green-500 hover:bg-blue-300 text-white text-xs rounded-lg mr-4">
          Ajouter
        </button>
      </div>

      {/* Liste des enseignants */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {currentEnseignants.map((enseignant, index) => (
  // <ListCard key={`${enseignant.email}-${index}`} item={enseignant} onEdit={() => {}} onDelete={handleDelete} />
  <ListCard 
  key={`${enseignant.email}-${index}`} 
  item={enseignant} 
  onEdit={() => {}} 
  onDelete={handleDelete} 
  onSelect={() => setSelectedEnseignant(enseignant)} 
/>
))}

        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-4">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50">
            Précédent
          </button>
          <span className="text-lg font-semibold">
            Page {currentPage} sur {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50">
            Suivant
          </button>
        </div>
      )}
        {/* Modal */}
            {selectedEnseigant && (
          <Modal onClose={() => setSelectedEnseignant(null)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[400px] relative">
            {/* Bouton Fermer (en haut à droite) */}
            <div className="absolute top-3 right-3">
             
            </div>
      
            {/* Section avec background gris */}
            <div className="bg-gray-100 p-5 rounded-lg flex flex-col items-center">
              {/* Image centrée */}
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden border">
                <img
                  src={selectedEnseigant.image}
                  alt={`Photo de ${selectedEnseigant.nom}`}
                  className="object-cover w-full h-full"
                />
              </div>
      
              {/* Nom et Email */}
              <h2 className="text-center text-lg font-bold mt-2">
                {selectedEnseigant.nom} {selectedEnseigant.prenom}
              </h2>
              <p className="text-gray-500 text-sm">{selectedEnseigant.email}</p>
            </div>
      
            {/* Contenu en colonne */}
            <div className="mt-4 flex justify-between items-start px-6">
              {/* Infos personnelles */}
              <div className="space-y-3 text-sm text-gray-700">
                <p className="flex gap-2 items-center">
                <img src="/icons/book.png" alt="Adresse" className="w-4 h-4" />
                  {selectedEnseigant.adresse}
                </p>
                <p className="flex gap-2 items-center">
                <img src="/icons/calendar.png" alt="Date" className="w-4 h-4" />
                  {selectedEnseigant.date}
                </p>
                <p className="flex gap-2 items-center">
                <img src="/icons/call.png" alt="Téléphone" className="w-4 h-4" />
                  {selectedEnseigant.tel}
                </p>
              </div>
      
              {/* Boutons à droite */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => console.log("Modifier", selectedEnseigant)}
                  className="bg-blue-500 text-white px-4 py-1 text-sm rounded-lg hover:bg-blue-600 transition-all duration-200"
                >
                  Modifier
                </button>
      
                <button
                  onClick={() => console.log("Supprimer", selectedEnseigant)}
                  className="bg-red-500 text-white px-4 py-1 text-sm rounded-lg hover:bg-red-600 transition-all duration-200"
                >
                  Supprimer
                </button>
                <button
                onClick={() => setSelectedEnseignant(null)}
                className="bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded-lg hover:bg-gray-400 transition-all duration-200"
              >
                Fermer
              </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      
    </div>

  );
}
