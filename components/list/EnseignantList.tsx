"use client";

import ListCard, { User } from "@/components/card/ListCard";
import Modal from "@/components/modal/Modal";
import RegisterFormEnseignant from "../formulaires/FormulaireProf";
import Image from "next/image";
import { useState } from "react";

const enseignantsData: User[] = [
  { image: "/img/profil1.jpg", nom: "Dupont", prenom: "Jean", email: "mah@example.com", adresse: "Paris, France", date: "2022", tel: "0123456789", classe: "AP" },
  { image: "/img/profil2.jpg", nom: "Dupont", prenom: "Jean", email: "kissa@example.com", adresse: "Paris, France", date: "2023", tel: "0123456789", classe: "AP" },
  { image: "/img/profil3.jpg", nom: "Dupont", prenom: "Jean", email: "awa@example.com", adresse: "Paris, France", date: "2022", tel: "0123456789", classe: "ISR" },
  { 
    image: "/img/profil4.jpg",
     nom: "Dupont",
      prenom: "Jean",
       email: "dramane@example.com", 
       adresse: "Paris, France", 
       date: "2023",
        tel: "0123456789",
     classe: "ISR" },
     { 
      image: "/img/profil5.jpg",
       nom: "Dupont",
        prenom: "Jean",
         email: "dramane@example.com", 
         adresse: "Paris, France", 
         date: "2023",
          tel: "0123456789",
       classe: "ISR" },
       { 
        image: "/img/profil6.jpg",
         nom: "Dupont",
          prenom: "Jean",
           email: "dramane@example.com", 
           adresse: "Paris, France", 
           date: "2023",
            tel: "0123456789",
         classe: "ISR" },
         { 
          image: "/img/profil7.jpg",
           nom: "Dupont",
            prenom: "Jean",
             email: "dramane@example.com", 
             adresse: "Paris, France", 
             date: "2023",
              tel: "0123456789",
           classe: "MIAGE" },
           { 
            image: "/img/profil8.jpg",
             nom: "Dupont",
              prenom: "Jean",
               email: "dramane@example.com", 
               adresse: "Paris, France", 
               date: "2023",
                tel: "0123456789",
             classe: "MIAGE" },
             { 
              image: "/img/profil9.jpg",
               nom: "Dupont",
                prenom: "Jean",
                 email: "dramane@example.com", 
                 adresse: "Paris, France", 
                 date: "2023",
                  tel: "0123456789",
               classe: "MIAGE" },
               { 
                image: "/img/profil10.jpg",
                 nom: "Dupont",
                  prenom: "Jean",
                   email: "dramane@example.com", 
                   adresse: "Paris, France", 
                   date: "2023",
                    tel: "0123456789",
                 classe: "GLDW" },
                 { 
                  image: "/img/profil11.jpg",
                   nom: "Dupont",
                    prenom: "Jean",
                     email: "dramane@example.com", 
                     adresse: "Paris, France", 
                     date: "2023",
                      tel: "0123456789",
                   classe: "GLDW" },
                   { 
                    image: "/img/profil12.jpg",
                     nom: "Dupont",
                      prenom: "Jean",
                       email: "dramane@example.com", 
                       adresse: "Paris, France", 
                       date: "2023",
                        tel: "0123456789",
                     classe: "GLDW" },
                     { 
                      image: "/img/profil13.jpg",
                       nom: "Dupont",
                        prenom: "Jean",
                         email: "dramane@example.com", 
                         adresse: "Paris, France", 
                         date: "2023",
                          tel: "0123456789",
                       classe:"GLDW" },

];

export default function EnseignantList() {
  const [enseignants, setEnseignants] = useState<User[]>(enseignantsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEnseignant, setSelectedEnseignant] = useState<User | null>(null);
  const itemsPerPage = 8;

  // Récupération des classes et années uniques pour les filtres
  const classesDisponibles = Array.from(new Set(enseignantsData.map(ens => ens.classe)));
  const anneesDisponibles = Array.from(new Set(enseignantsData.map(ens => ens.date)));

  // Filtrage des enseignants
  const filteredEnseignants = enseignants.filter((enseignant) => {
    return (
      `${enseignant.nom} ${enseignant.prenom} ${enseignant.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (classFilter ? enseignant.classe === classFilter : true) &&
      (yearFilter ? enseignant.date === yearFilter : true)
    );
  });

  const totalPages = Math.ceil(filteredEnseignants.length / itemsPerPage);
  const currentEnseignants = filteredEnseignants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (name: string) => {
    setEnseignants((prevEnseignants) => prevEnseignants.filter(ens => ens.nom !== name));
    console.log(`Enseignant avec le nom ${name} supprimé.`);
  };
  
  return (
    <div className="ml-0 px-1 py-5 text-xl">
      <div className="flex justify-between items-center mb-4 ml-6">
        <h1 className="text-xl font-bold">
          <img src="/icons/teach.png" alt="Téléphone" className="w-8 h-8" />
          Liste des Enseignants
          
          </h1>

        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/4 p-3 border rounded-lg text-xs"
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
          {classesDisponibles.map((classe) => (
            <option key={classe} value={classe}>
              {classe}
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

        {/* Bouton Ajouter */}
        <button onClick={() => setIsAddModalOpen(true)} className="px-6 py-2 bg-green-500 hover:bg-blue-300 text-white text-xs rounded-lg">
          Ajouter
        </button>
      </div>

      {/* Liste des enseignants */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {currentEnseignants.map((enseignant, index) => (
            <ListCard 
              key={`${enseignant.email}-${index}`} 
              item={enseignant} 
              onEdit={() => {}} 
              onDelete={() => handleDelete(enseignant.nom)} 
              onSelect={() => setSelectedEnseignant(enseignant)} 
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs">
            Précédent
          </button>
          <span className="text-lg font-semibold text-xs">Page {currentPage} sur {totalPages}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs">
            Suivant
          </button>
        </div>
      )}
  {/* Modal */}
   {selectedEnseignant && (
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
         src={selectedEnseignant.image}
         alt={`Photo de ${selectedEnseignant.nom}`}
         className="object-cover w-full h-full"
       />
     </div>

     {/* Nom et Email */}
     <h2 className="text-center text-lg font-bold mt-2">
       {selectedEnseignant.nom} {selectedEnseignant.prenom}
     </h2>
     <p className="text-gray-500 text-sm">{selectedEnseignant.email}</p>
   </div>

   {/* Contenu en colonne */}
   <div className="mt-4 flex justify-between items-start px-6">
     {/* Infos personnelles */}
     <div className="space-y-3 text-sm text-gray-700">
       <p className="flex gap-2 items-center">
       <img src="/icons/book.png" alt="Adresse" className="w-4 h-4" />
         {selectedEnseignant.adresse}
       </p>
       <p className="flex gap-2 items-center">
       <img src="/icons/calendar.png" alt="Date" className="w-4 h-4" />
         {selectedEnseignant.date}
       </p>
       <p className="flex gap-2 items-center">
       <img src="/icons/call.png" alt="Téléphone" className="w-4 h-4" />
         {selectedEnseignant.tel}
       </p>
     </div>

     {/* Boutons à droite */}
     <div className="flex flex-col gap-2">
       <button
         onClick={() => console.log("Modifier", selectedEnseignant)}
         className="bg-blue-500 text-white px-4 py-1 text-sm rounded-lg hover:bg-blue-600 transition-all duration-200"
       >
         Modifier
       </button>

       <button
         onClick={() => console.log("Supprimer", selectedEnseignant)}
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


{/* Modal d'ajout d'un enseignant */}
{isAddModalOpen && (
  <Modal onClose={() => setIsAddModalOpen(false)}>
    <RegisterFormEnseignant 
      onSubmit={async (formData) => {
        console.log("Formulaire soumis !");
        console.log("Nouveau étudiant:", Object.fromEntries([...formData.entries()]));
        setIsAddModalOpen(false);
      }} 
    />
  </Modal>
)}

    </div>
  );
}