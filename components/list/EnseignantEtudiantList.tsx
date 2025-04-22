"use client";

import { useState, useEffect } from "react";
import ListCard1, { User } from "@/components/card/EnseignantListCard";
import Modal from "@/components/modal/Modal";


// Composant principal pour afficher la liste des étudiants
export default function EtudiantList() {
  const [etudiants, setEtudiants] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEtudiant, setSelectedEtudiant] = useState<User | null>(null);
  const [idProfesseur, setIdProfesseur] = useState<number | null>(null); // État pour l'ID du professeur

  const itemsPerPage = 8;

  const formatDate = (date: string | Date): string => {
    if (!date) return ""; // Si la date est null ou undefined, retourner une chaîne vide

    // Si la date est une chaîne avec un format incluant des heures, nettoyez-la
    if (typeof date === "string" && date.includes(" ")) {
      date = date.split(" ")[0]; // Gardez uniquement la partie YYYY-MM-DD
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) return ""; // Si la date est invalide, retourner une chaîne vide

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format compatible avec les champs HTML de type date
  };

 // Récupération de l'ID du professeur connecté via l'endpoint /api/auth/session
 const fetchProfesseurId = async () => {
  try {
    const response = await fetch("/api/auth/session");
    const data = await response.json();

    if (response.ok) {
      if (data.user.enseignant) {
        setIdProfesseur(data.user.enseignant.id); // Stocker l'ID du professeur
      } else {
        console.error("L'utilisateur connecté n'est pas un enseignant.");
      }
    } else {
      console.error("Erreur lors de la récupération de la session :", data.error);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la session :", error);
  }
};

  // Récupération des étudiants depuis l'API
  const fetchEtudiants = async () => {
    try {
      const response = await fetch("/api/utilisateurs/etudiants");
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        const formattedEtudiants = data.etudiants.map((etudiant: any) => ({
          id: etudiant.id_utilisateur,
          id_utilisateur: etudiant.id_utilisateur, // ✅ Ajout explicite
          nom: etudiant.utilisateur.nom,
          prenom: etudiant.utilisateur.prenom,
          email: etudiant.utilisateur.email,
          sexe: etudiant.utilisateur.sexe,
          image: etudiant.utilisateur.profil || "/profils/default.jpg",
          tel: etudiant.utilisateur.telephone,
          adresse: etudiant.utilisateur.adresse,
          matricule: etudiant.matricule,
          filiere: {
          id_filiere: etudiant.filiere.id_filiere,
          nom: etudiant.filiere.nom, 
          filiere_module:etudiant.filiere.filiere_module,

          },
          date_naissance: formatDate(etudiant.date_naissance),
          date_inscription: formatDate(etudiant.date_inscription),
          notes: etudiant.notes || [], // Ajout des notes pour le filtre par session
        }));

        setEtudiants(formattedEtudiants);
      } else {
        console.error(
          "Erreur lors de la récupération des étudiants :",
          data.message
        );
      }
    } catch (error) {
      console.error("Erreur lors du fetch :", error);
    }
  };
  useEffect(() => {
    fetchProfesseurId(); // Récupérer l'ID du professeur connecté
    fetchEtudiants();
  }, []);

 // Filtrage des étudiants
 const filteredEtudiants = etudiants.filter((etudiant) => {
  return (
    `${etudiant.nom} ${etudiant.prenom} ${etudiant.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) &&
    etudiant.filiere.filiere_module.some((module: any) =>
      module.cours.some((cours: any) => cours.id_professeur === idProfesseur)
    ) // Filtrer par l'ID du professeur
  );
});
console.log(filteredEtudiants);


  // Pagination
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);
  const currentEtudiants = filteredEtudiants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
 
  // console.log("Liste des étudiants affichée :", currentEtudiants);

  console.log(etudiants);
  return (
    <div className="ml-0 px-1 py-5 text-xl">
      {/* Barre de recherche et filtres */}
      <div className="flex justify-between items-center mb-4 ml-6">
        <input
          type="text"
          placeholder="Rechercher un étudiant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/3 p-3 border rounded-lg text-sm"
        />
       
      </div>

      {/* Liste des étudiants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredEtudiants.map((etudiant) => (
          <ListCard1
            key={etudiant.id_utilisateur}
            item={{
              ...etudiant,
              date_naissance: formatDate(etudiant.date_naissance), // Formatez ici
              date_inscription: formatDate(etudiant.date_inscription), // Formatez ici
            }}
            onrecharge={fetchEtudiants}
            onSelect={() => setSelectedEtudiant(etudiant)}
            type={"etudiant"}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 text-xs"
          >
            Précédent
          </button>
          <span className="text-xs font-semibold">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 text-xs"
          >
            Suivant
          </button>
        </div>
      )}

     
      {/* Modal d'affichage des détails */}
      {selectedEtudiant && (
        <Modal onClose={() => setSelectedEtudiant(null)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
            {/* Bouton Fermer */}
            <button
              onClick={() => setSelectedEtudiant(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              x
            </button>

            {/* Image de profil et Nom */}
            <div className="flex flex-col items-center mb-4">
              <img
                title="imgEstudiant"
                src={selectedEtudiant.image}
                className="object-cover w-[220px] h-[220px] rounded-full border"
              />
              {/* <h2 className="text-lg font-bold mt-2">{selectedEtudiant.nom} {selectedEtudiant.prenom}</h2>
        <p className="text-gray-500 text-sm">{selectedEtudiant.email}</p> */}
            </div>

           {/* Informations détaillées en colonnes */}
<div className="grid grid-cols-2 gap-4 text-lg border-t pt-4">
  <p>
    <span className="italic underline font-bold">Nom</span> : {selectedEtudiant.nom}
  </p>
  <p>
    <span className="italic underline font-bold">Prénom</span> : {selectedEtudiant.prenom}
  </p>
  <p>
    <span className="italic underline font-bold">Email</span> : {selectedEtudiant.email}
  </p>
  <p>
    <span className="italic underline font-bold">Sexe</span> : {selectedEtudiant.sexe}
  </p>
  <p>
    <span className="italic underline font-bold">Téléphone</span> : {selectedEtudiant.tel || "Non renseigné"}
  </p>
  <p>
    <span className="italic underline font-bold">Adresse</span> : {selectedEtudiant.adresse || "Non renseignée"}
  </p>
  <p>
    <span className="italic underline font-bold">Matricule</span> : {selectedEtudiant.matricule}
  </p>
  <p>
    <span className="italic underline font-bold">Filière</span> : {selectedEtudiant.filiere.nom}
  </p>
  <p>
    <span className="italic underline font-bold">Date d'inscription</span> :{" "}
    {new Date(selectedEtudiant.date_inscription).toLocaleDateString("fr-FR")}
  </p>
  <p>
    <span className="italic underline font-bold">Date de naissance</span> :{" "}
    {new Date(selectedEtudiant.date_naissance).toLocaleDateString("fr-FR")}
  </p>
</div>
          </div>
        </Modal>
      )}
     
     
    </div>
  );
}
