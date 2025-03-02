
"use client";

import { useState } from "react";
import ListCard, { User } from "@/components/card/ListCard";
import Modal from "@/components/modal/Modal";
import RegisterFormEtudiant from "../formulaires/RegisterFormEtudiant ";


const etudiantsData: User[] = [
  { image: "/img/profil1.jpg", nom: "Dupont", prenom: "Jean", email: "mah@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" , filiere : "AP", matricule: "12CV",id :1},
  { image: "/img/profil2.jpg", nom: "Dupont", prenom: "Jean", email: "kissa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" , filiere : "IG", matricule: "12CV",id :2 },
  { image: "/img/profil3.jpg", nom: "Dupont", prenom: "Jean", email: "awa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" , filiere : "EMI", matricule: "12CV",id :3 },
  { image: "/img/profil4.jpg", nom: "Dupont", prenom: "Jean", email: "dramane@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" , filiere : "GEER", matricule: "12CV",id :4 },
  { image: "/img/profil5.jpg", nom: "Dupont", prenom: "Jean", email: "moussa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789" , filiere : "AP", matricule: "12CV",id :5 },
  { image: "/img/profil6.jpg", nom: "Dupont", prenom: "Jean", email: "issa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789", filiere : "IG", matricule: "12CV",id :6 },
  { image: "/img/profil6.jpg", nom: "Dupont", prenom: "Jean", email: "issa@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789", filiere : "EMI", matricule: "12CV",id :7},
  { image: "/img/profil7.jpg", nom: "Dupont", prenom: "Jean", email: "bourma@example.com", adresse: "Paris, France", date: "01/01/1980", tel: "0123456789", filiere : "GEER", matricule: "12CV",id :8 },
  { image: "/img/profil8.jpg", nom: "Maiga", prenom: "Mahamoud", email: "bourma@example.com", adresse: "Bamako, Sotuba", date: "01/01/1980", tel: "0123456789", filiere : "CCA", matricule: "12CV",id :9 },
  { image: "/img/profil9.jpg", nom: "DIALLO", prenom: "Moussa", email: "bourma@example.com", adresse: "Bamako, Mali", date: "01/01/1980", tel: "0123456789", filiere : "FC", matricule: "12CV",id :10 },
];

export default function EtudiantList() {
  const [etudiants, setEtudiant] = useState<User[]>(etudiantsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEtudiant, setSelectedEtudiant] = useState<User | null>(null); // État pour gérer l'affichage du modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // État pour le modal d'ajout
  const [showForm, setShowForm] = useState(false);  // Contrôle l'affichage du formulaire
  const itemsPerPage = 8;

  // Filtrage des etudiants en fonction du terme de recherche
  const filteredEtudiants = etudiants.filter((etudiant) =>
    `${etudiant.nom} ${etudiant.prenom} ${etudiant.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcul des pages
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEtudiants = filteredEtudiants.slice(indexOfFirstItem, indexOfLastItem);

  // Gérer la pagination
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Gérer la suppression d'un etudiant
  const handleDelete = (user: User) => {
    const updatedEtudiants = etudiants.filter((e) => e.email !== user.email);
    // setEtudiants(updatedEtudiants);
    setEtudiant([...updatedEtudiants]);

    // Vérifier si la suppression a vidé la page courante
    const newTotalPages = Math.ceil(updatedEtudiants.length / itemsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
    }
  };
  // console.log("Entudiants:", etudiants);
  // console.log("Current etudiants affichés:", currentEtudiants);
  // console.log(`Page actuelle : ${currentPage} / ${totalPages}`);

  // Fonction pour fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);  // Change l'état pour fermer le formulaire
  };

  
  return (
    <div className="ml-0 px-1 py-5 text-xl">
      {/* Titre, barre de recherche et bouton Ajouter */}
      <div className="flex justify-between items-center mb-4 ml-6">
        <h1 className="text-xl font-bold">Liste des Etudiants</h1>
        <input
          type="text"
          placeholder="Rechercher un etudiant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Revenir à la première page lors d'une recherche
          }}
          className="w-1/3 p-3 border rounded-lg text-xs"
        />
        {/* Bouton Ajouter */}
      <button onClick={() => setShowForm(true)} className="px-6 py-2 bg-green-500 hover:bg-blue-300 text-white text-xs rounded-lg mr-4">
        Ajouter
      </button>
      </div>

      {/* Liste des entudiants */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {currentEtudiants.map((etudiant, index) => (
  // <ListCard key={`${etudiant.email}-${index}`} item={etudiant} onEdit={() => {}} onDelete={handleDelete} />
        <ListCard 
          key={`${etudiant.email}-${index}`} 
          item={etudiant} 
          onEdit={() => {}} 
          onDelete={handleDelete} 
          onSelect={() => setSelectedEtudiant(etudiant)} 
        />

        ))}

        </div>
      </div>

      {/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-between items-center mt-4 px-4">
    <button
      onClick={handlePrevPage}
      disabled={currentPage === 1}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 text-xs"
    >
      Précédent
    </button>
    
    <span className="text-xs font-semibold ">
      Page {currentPage} sur {totalPages}
    </span>
    
    <button
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 text-xs"
    >
      Suivant
    </button>
  </div>
)}


    {/* Modal */}
{selectedEtudiant && (
  <Modal onClose={() => setSelectedEtudiant(null)}>
    <div className="p-5 bg-white rounded-lg shadow-lg w-[300px] relative">
      {/* Bouton Fermer */}
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setSelectedEtudiant(null)}
          className="bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded-lg hover:bg-gray-400 transition-all duration-200"
        >
          x
        </button>
      </div>

      {/* Section avec background gris */}
      <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
        {/* Image centrée */}
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden border">
          <img
            src={selectedEtudiant.image}
            alt={`Photo de ${selectedEtudiant.nom}`}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Nom et Email */}
        <h2 className="text-center text-lg font-bold mt-2">
          {selectedEtudiant.nom} {selectedEtudiant.prenom}
        </h2>
        <p className="text-gray-500 text-sm">{selectedEtudiant.email}</p>
      </div>

     {/* Contenu en deux colonnes */}
<div className="mt-3 px-4 grid grid-cols-2 gap-x-3 text-sm text-gray-700">
  {/* Colonne gauche */}
  <div className="space-y-2">
    <p className="flex gap-1 items-center">
      <img src="/icons/book.png" alt="Adresse" className="w-4 h-4" />
      {selectedEtudiant.adresse}
    </p>
    <p className="flex gap-1 items-center">
      <img src="/icons/calendar.png" alt="Date" className="w-4 h-4" />
      {selectedEtudiant.date}
    </p>
  </div>

  {/* Colonne droite avec décalage */}
  <div className="space-y-2 pl-3">
    <p className="flex gap-1 items-center">
      <img src="/icons/assessment.png" alt="Filière" className="w-4 h-4" />
      {selectedEtudiant.filiere}
    </p>
    <p className="flex gap-1 items-center">
      <img src="/icons/check.png" alt="Matricule" className="w-4 h-4" />
      {selectedEtudiant.matricule}
    </p>
  </div>
</div>

      {/* Téléphone centré */}
      <div className="mt-4 flex justify-center">
        <p className="flex gap-2 items-center text-sm text-gray-700">
          <img src="/icons/call.png" alt="Téléphone" className="w-4 h-4" />
          {selectedEtudiant.tel}
        </p>
      </div>
    </div>
  </Modal>
)}


 {/* Modal d'ajout d'un étudiant */}
 {showForm && (
        <Modal onClose={handleCloseForm}>
          <RegisterFormEtudiant 
            onSubmit={async (formData) => {
              console.log("Formulaire soumis !");
              console.log("Nouveau étudiant:", Object.fromEntries([...formData.entries()]));
              setShowForm(false);  // Ferme le formulaire après la soumission
            }} 
            onClose={handleCloseForm}  // Passe la fonction handleCloseForm à RegisterFormEtudiant
          />
        </Modal>
      )}



    </div>
  );
}
