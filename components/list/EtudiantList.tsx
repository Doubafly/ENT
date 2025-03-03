"use client";

import { useState } from "react";
import ListCard, { User } from "@/components/card/ListCard";
import Modal from "@/components/modal/Modal";
import RegisterFormEtudiant from "../formulaires/RegisterFormEtudiant ";

// Données fictives des étudiants
const etudiantsData: User[] = [
  { image: "/img/profil1.jpg", nom: "Dupont", prenom: "Jean", email: "mah@example.com", adresse: "Paris, France", date: "2021", tel: "0123456789" , filiere : "AP", matricule: "12CV",id :1},
  { image: "/img/profil2.jpg", nom: "Dupont", prenom: "Jean", email: "kissa@example.com", adresse: "Paris, France", date: "2021", tel: "0123456789" , filiere : "IG", matricule: "12CV",id :2, },
  { image: "/img/profil3.jpg", nom: "Dupont", prenom: "Jean", email: "awa@example.com", adresse: "Paris, France", date: "2021", tel: "0123456789" , filiere : "EMI", matricule: "12CV",id :3,},
  { image: "/img/profil4.jpg", nom: "Dupont", prenom: "Jean", email: "dramane@example.com", adresse: "Paris, France", date: "2021", tel: "0123456789" , filiere : "GEER", matricule: "12CV",id :4,},
  { image: "/img/profil5.jpg", nom: "Dupont", prenom: "Jean", email: "moussa@example.com", adresse: "Paris, France", date: "2021", tel: "0123456789" , filiere : "AP", matricule: "12CV",id :5 },
  { image: "/img/profil6.jpg", nom: "Dupont", prenom: "Jean", email: "issa@example.com", adresse: "Paris, France", date: "2022", tel: "0123456789", filiere : "IG", matricule: "12CV",id :6 },
  { image: "/img/profil6.jpg", nom: "Dupont", prenom: "Jean", email: "issa@example.com", adresse: "Paris, France", date: "2022", tel: "0123456789", filiere : "EMI", matricule: "12CV",id :7},
  { image: "/img/profil7.jpg", nom: "Dupont", prenom: "Jean", email: "bourma@example.com", adresse: "Paris, France", date: "2022", tel: "0123456789", filiere : "GEER", matricule: "12CV",id :8 },
  { image: "/img/profil8.jpg", nom: "Maiga", prenom: "Mahamoud", email: "bourma@example.com", adresse: "Bamako, Sotuba", date: "2022", tel: "0123456789", filiere : "CCA", matricule: "12CV",id :9 },
  { image: "/img/profil9.jpg", nom: "DIALLO", prenom: "Moussa", email: "bourma@example.com", adresse: "Bamako, Mali", date: "2022", tel: "0123456789", filiere : "FC", matricule: "12CV",id :10 },

];

// Composant principal pour afficher la liste des étudiants
export default function EtudiantList() {
  // États pour gérer les données des étudiants, la recherche, la pagination, et l'affichage des modals
  const [etudiants, setEtudiant] = useState<User[]>(etudiantsData);
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche pour filtrer les étudiants
  const [classFilter, setClassFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle de la liste d'étudiants
  const [selectedEtudiant, setSelectedEtudiant] = useState<User | null>(null); // Étudiant sélectionné pour afficher le modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // État pour le modal d'ajout
  const [showForm, setShowForm] = useState(false);  // Contrôle l'affichage du formulaire d'ajout
  const itemsPerPage = 8; // Nombre d'étudiants à afficher par page

  // Récupération des classes et années uniques pour les filtres
  const classesDisponibles = Array.from(new Set(etudiantsData.map(ent => ent.filiere)));
  const anneesDisponibles = Array.from(new Set(etudiantsData.map(ent => ent.date)));

  // Filtrage des enseignants
  const filteredEtudiants = etudiants.filter((etudiant) => {
    return (
      `${etudiant.nom} ${etudiant.prenom} ${etudiant.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (classFilter ? etudiant.filiere === classFilter : true) &&
      (yearFilter ? etudiant.date === yearFilter : true)
    );
  });

  // Calcul des pages en fonction du nombre d'étudiants filtrés
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEtudiants = filteredEtudiants.slice(indexOfFirstItem, indexOfLastItem);

  // Fonction pour changer de page
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Fonction pour supprimer un étudiant
  const handleDelete = (user: User) => {
    const updatedEtudiants = etudiants.filter((e) => e.email !== user.email);
    setEtudiant([...updatedEtudiants]);

    // Mettre à jour la page actuelle si l'étudiant supprimé était sur la page en cours
    const newTotalPages = Math.ceil(updatedEtudiants.length / itemsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
    }
  };

  // Fonction pour fermer le formulaire d'ajout
  const handleCloseForm = () => {
    setShowForm(false);  // Ferme le formulaire en modifiant l'état
  };

  return (
    <div className="ml-0 px-1 py-5 text-xl">
      {/* Section de titre, recherche et bouton Ajouter */}
      <div className="flex justify-between items-center mb-4 ml-6">
        <h1 className="text-xl font-bold">Liste des Etudiants</h1>
        {/* Champ de recherche pour filtrer les étudiants */}
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
         {/*Filtre  Sélecteur de classe */}
         <select
          value={classFilter}
          onChange={(e) => {
            setClassFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/4 p-3 border rounded-lg text-xs"
        >
          <option value="">Filtrer par classes</option>
          {classesDisponibles.map((filiere) => (
            <option key={filiere} value={filiere}>
              {filiere}
            </option>
          ))}
        </select>

        {/* Filtre Sélecteur d'année */}
        <select
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/4 p-3 border rounded-lg text-xs"
        >
          <option value="">Filtrer par années</option>
          {anneesDisponibles.map((annee) => (
            <option key={annee} value={annee}>
              {annee}
            </option>
          ))}
        </select>

      <button onClick={() => setShowForm(true)} className="px-6 py-2 bg-green-500 hover:bg-blue-300 text-white text-xs rounded-lg mr-4">
  Ajouter
</button>

      </div>

      {/* Liste des étudiants */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {/* Affichage des étudiants sous forme de cartes */}
          {currentEtudiants.map((etudiant, index) => (
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

      {/* Pagination : affichage des boutons de navigation */}
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

      {/* Modal pour afficher les détails d'un étudiant */}
      {selectedEtudiant && (
        <Modal onClose={() => setSelectedEtudiant(null)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[300px] relative">
            {/* Bouton pour fermer le modal */}
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setSelectedEtudiant(null)}
                className="bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded-lg hover:bg-gray-400 transition-all duration-200"
              >
                x
              </button>
            </div>

            {/* Détails de l'étudiant */}
            <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden border">
                <img
                  src={selectedEtudiant.image}
                  alt={`Photo de ${selectedEtudiant.nom}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-center text-lg font-bold mt-2">
                {selectedEtudiant.nom} {selectedEtudiant.prenom}
              </h2>
              <p className="text-gray-500 text-sm">{selectedEtudiant.email}</p>
            </div>

            {/* Informations supplémentaires de l'étudiant en deux colonnes */}
            <div className="mt-3 px-4 grid grid-cols-2 gap-x-3 text-sm text-gray-700">
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

            {/* Affichage du téléphone de l'étudiant */}
            <div className="mt-4 flex justify-center">
              <p className="flex gap-2 items-center text-sm text-gray-700">
                <img src="/icons/call.png" alt="Téléphone" className="w-4 h-4" />
                {selectedEtudiant.tel}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal d'ajout d'un étudiant avec un formulaire */}
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
