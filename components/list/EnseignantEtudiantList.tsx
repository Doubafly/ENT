"use client";

import { useState, useEffect } from "react";
import ListCard1, { User } from "@/components/card/EnseignantListCard";
import Modal from "@/components/modal/Modal";


// Composant principal pour afficher la liste des étudiants
export default function EtudiantList() {
  const [etudiants, setEtudiants] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState<string>(""); // État pour le filtre par classe
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEtudiant, setSelectedEtudiant] = useState<User | null>(null);
  const [idProfesseur, setIdProfesseur] = useState<number | null>(null); // État pour l'ID du professeur
  const [sessionFilter, setSessionFilter] = useState<string>(""); // État pour le filtre par session
  const [error, setError] = useState("");

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

 useEffect(() => {
    const fetchProfesseurId = () => {
      try {
        // Vérifier si on est côté client avant d'accéder à localStorage
        if (typeof window !== "undefined") {
          const userDataString = localStorage.getItem("user");
          if (!userDataString) {
            throw new Error("Aucune session utilisateur trouvée");
          }

          const userData = JSON.parse(userDataString);
          
          // Vérification plus robuste de la structure des données
          if (userData?.user?.enseignant?.id) {
            setIdProfesseur(userData.user.enseignant.id);
          } else if (userData?.user?.id) {
            setIdProfesseur(userData.user.id);
          } else {
            throw new Error("Données utilisateur incomplètes");
          }
        }
      } catch (err) {
        console.error("Erreur de lecture du localStorage:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    };

    fetchProfesseurId();
    fetchEtudiants();
  }, []);

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
          annee_academique: etudiant.filiere.filiere_module[0]?.sessions?.annee_academique || "Non renseignée", // Récupération de l'année académique
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
  const matchesSearchTerm = `${etudiant.nom} ${etudiant.prenom} ${etudiant.email}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesSession =
    sessionFilter === "" ||
    etudiant.filiere.filiere_module.some((module: any) =>
      module.cours.some((cours: any) => cours.sessions?.annee_academique === sessionFilter)
    );

  const matchesClass =
    classFilter === "" || etudiant.filiere.nom === classFilter;

  const matchesProfesseur =
    etudiant.filiere.filiere_module.some((module: any) =>
      module.cours.some((cours: any) => cours.id_professeur === idProfesseur)
    );

  return matchesSearchTerm && matchesSession && matchesClass && matchesProfesseur;
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
      <div className="flex flex-wrap justify-between items-center mb-4 ml-6 gap-4">
        <input
          type="text"
          placeholder="Rechercher un étudiant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/4 p-3 border rounded-lg text-sm"
        />
{/* Filtre par classe */}
<select
  value={classFilter}
  onChange={(e) => {
    setClassFilter(e.target.value);
    setCurrentPage(1);
  }}
  className="w-1/4 p-3 border rounded-lg text-sm"
>
  <option value="">Toutes les classes</option>
  {Array.from(
    new Set(
      etudiants
        .filter((etudiant) =>
          etudiant.filiere.filiere_module.some((module: any) =>
            module.cours.some((cours: any) => cours.id_professeur === idProfesseur)
          )
        )
        .map((etudiant) => etudiant.filiere.nom)
    )
  ).map((classe) => (
    <option key={classe} value={classe}>
      {classe}
    </option>
  ))}
</select>

        {/* Filtre par session */}
  <select
    value={sessionFilter}
    onChange={(e) => {
      setSessionFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="w-1/4 p-3 border rounded-lg text-sm"
  >
    <option value="">Toutes les sessions</option>
    {Array.from(
      new Set(
        etudiants.flatMap((etudiant) =>
          etudiant.filiere.filiere_module.flatMap((module: any) =>
            module.cours.flatMap((cours: any) => cours.sessions?.annee_academique)
          )
        )
      )
    ).map((session) => (
      <option key={session} value={session}>
        {session}
      </option>
    ))}
  </select>
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
  <span className="italic underline font-bold">Année académique</span> :{" "}
  {selectedEtudiant.filiere.filiere_module[0]?.cours[0]?.sessions?.annee_academique || "Non renseignée"}
</p>
  <p>
    <span className="italic underline font-bold">Filière</span> : {selectedEtudiant.filiere.nom}
  </p>
  <p>
    <span className="italic underline font-bold">Date d'inscription</span> :{" "}
    {new Date(selectedEtudiant.date_inscription).toLocaleDateString("fr-FR")}
  </p>
  <p >
    <span className="italic underline font-bold ">Date de naissance</span> :{" "}
    {new Date(selectedEtudiant.date_naissance).toLocaleDateString("fr-FR")}
  </p>
</div>
          </div>
        </Modal>
      )}
     
     
    </div>
  );
}
