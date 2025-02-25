
'use client';

import { useState } from "react";
import ListCard, { User } from "@/components/card/ListCard";

const etudiantsData: User[] = [
  {
    image: "/img/dd.jpeg",
    nom: "Koné",
    prenom: "Luqman",
    email: "luqman@example.com",
    adresse: "Ottawa, Canada",
    date: "21/01/2017",
    tel: "0123456789",
  },
  {
    image: "/img/dd.jpeg",
    nom: "Dupont",
    prenom: "Jean",
    email: "kissa@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
  },
  {
    image: "/img/dd.jpeg",
    nom: "Dupont",
    prenom: "Jean",
    email: "awa@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
  },
  {
    image: "/img/dd.jpeg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
  },
  {
    image: "/img/dd.jpeg",
    nom: "Dupont",
    prenom: "Jean",
    email: "moussa@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
  }
];

export default function EtudiantsList() {
  const [etudiants, setEtudiants] = useState(etudiantsData);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (user: User) => {
    console.log("Modifier :", user);
  };

  const handleDelete = (user: User) => {
    const updatedEtudiants = etudiants.filter((e) => e !== user);
    setEtudiants(updatedEtudiants);
  };

  const filteredEtudiants = etudiants.filter((etudiant) =>
    `${etudiant.nom} ${etudiant.prenom} ${etudiant.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-0 px-1 py-5 text-xl">
      {/* Titre, barre de recherche et bouton Ajouter */}
      <div className="flex justify-between items-center mb-1 ml-6 ">
        <h1 className="text-xl font-bold">Liste des Étudiants</h1>
        <input
          type="text"
          placeholder="Rechercher un étudiant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 p-3 border rounded-lg text-xs"
        />
        <button className="px-6 py-2 bg-green-500 text-white text-xs rounded-lg mr-4">
          Ajouter
        </button>
      </div>

      {/* Liste des étudiants */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {filteredEtudiants.map((etudiant) => (
            <ListCard
              key={etudiant.email}
              item={etudiant}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
// 'use client';

// import { useState } from "react";
// import ListCard, { User } from "@/components/card/ListCard";
// import RegisterFormEtudiant from "../formulaires/RegisterFormEtudiant ";
// const etudiantsData: User[] = [
//   {
//     image: "/img/dd.jpeg",
//     nom: "Koné",
//     prenom: "Luqman",
//     email: "luqman@example.com",
//     adresse: "Ottawa, Canada",
//     date: "21/01/2017",
//     tel: "0123456789",
//   },
//   {
//     image: "/img/dd.jpeg",
//     nom: "Dupont",
//     prenom: "Jean",
//     email: "kissa@example.com",
//     adresse: "Paris, France",
//     date: "01/01/1980",
//     tel: "0123456789",
//   },
// ];

// export default function EtudiantsList() {
//   const [etudiants, setEtudiants] = useState(etudiantsData);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false); // État pour afficher la modale

//   const handleEdit = (user: User) => {
//     console.log("Modifier :", user);
//   };

//   const handleDelete = (user: User) => {
//     const updatedEtudiants = etudiants.filter((e) => e !== user);
//     setEtudiants(updatedEtudiants);
//   };

//   return (
//     <div className="ml-0 px-1 py-5 text-xl">
//       {/* Titre, barre de recherche et bouton Ajouter */}
//       <div className="flex justify-between items-center mb-1 ml-6">
//         <h1 className="text-xl font-bold">Liste des Étudiants</h1>
//         <input
//           type="text"
//           placeholder="Rechercher un étudiant..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-1/3 p-3 border rounded-lg text-xs"
//         />
//         <button 
//           onClick={() => setShowModal(true)} 
//           className="px-6 py-2 bg-green-500 text-white text-xs rounded-lg mr-4"
//         >
//           Ajouter
//         </button>
//       </div>

//       {/* Liste des étudiants */}
//       <div className="flex justify-center">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
//           {etudiants.map((etudiant) => (
//             <ListCard
//               key={etudiant.email}
//               item={etudiant}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Modale d'ajout d'étudiant */}
//       {showModal && (
//    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
//       <div className="bg-white p-6 rounded-lg w-1/2 shadow-lg transform transition-all scale-95">
//          <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-bold">Ajouter un étudiant</h2>
//             <button onClick={() => setShowModal(false)} className="text-red-500 text-xl">✖</button>
//          </div>
//          <RegisterFormEtudiant onSubmit={() => setShowModal(false)} />
//       </div>
//    </div>
// )}

//     </div>
//   );
// }
