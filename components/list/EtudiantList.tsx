"use client";

import { useState, useEffect } from "react";
import ListCard, { User } from "@/components/card/ListCard";
import Modal from "@/components/modal/Modal";
import RegisterFormEtudiant from "../formulaires/RegisterFormEtudiant";
import UpdateEtudiantModal from "../formulaires/UpdateEtudiantModal";


// Composant principal pour afficher la liste des étudiants
export default function EtudiantList() {
  const [etudiants, setEtudiants] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEtudiant, setSelectedEtudiant] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // État pour le modal de suppression
  const [etudiantToDelete, setEtudiantToDelete] = useState<User | null>(null); // Étudiant à supprimer
 

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

  // Récupération des étudiants depuis l'API
  const fetchEtudiants = async () => {
    try {
      const response = await fetch("/api/utilisateurs/etudiants");
      const data = await response.json();
  
      if (response.ok) {
        const formattedEtudiants = data.etudiants.map((etudiant: any) => ({
          id: etudiant.id_utilisateur,
          id_utilisateur: etudiant.id_utilisateur,  // ✅ Ajout explicite
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
          },
          date_naissance: formatDate(etudiant.date_naissance),
          date_inscription: formatDate(etudiant.date_inscription),
        }));
  
        setEtudiants(formattedEtudiants);
      } else {
        console.error("Erreur lors de la récupération des étudiants :", data.message);
      }
    } catch (error) {
      console.error("Erreur lors du fetch :", error);
    }
  };
  useEffect(() => {
    fetchEtudiants();
  }, []);  


  // Création d'un nouvel étudiant
  const handleAddEtudiant = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    console.log("Données envoyées :", data);

    try {
      const response = await fetch("/api/utilisateurs/etudiants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newEtudiant = await response.json();
        setEtudiants((prev) => [...prev, newEtudiant]);
        console.log("Réponse API après ajout :", newEtudiant);

        if (!newEtudiant || !newEtudiant.id_utilisateur) {
          console.error("Données reçues incorrectes :", newEtudiant);
          return;
        }

        setEtudiants((prev) => [
          ...prev,
          {
            id_utilisateur: newEtudiant.id_utilisateur,
            id: newEtudiant.id_utilisateur, // Obligatoire pour ton type User
            nom: newEtudiant.utilisateur?.nom || "Nom inconnu",
            prenom: newEtudiant.utilisateur?.prenom || "Prénom inconnu",
            email: newEtudiant.utilisateur?.email || "Email inconnu",
            sexe: newEtudiant.utilisateur?.sexe || "Non précisé",
            image: newEtudiant.utilisateur?.profil || "/profils/default.jpg",
            tel: newEtudiant.utilisateur?.telephone || "N/A",
            adresse: newEtudiant.utilisateur?.adresse || "N/A",
            matricule: newEtudiant.matricule || "Matricule inconnu",
            filiere: {
              id_filiere: newEtudiant.filiere?.id_filiere || 0,
              nom: newEtudiant.filiere?.nom || "Non assignée",
            },
            date_naissance: newEtudiant.utilisateur?.date_naissance || "Date inconnue",
            date_inscription: newEtudiant.date_inscription || "Date inconnue",
          },
        ]);
        
        setCurrentPage(1);
        setShowForm(false);
        
      } else {
        const errorText = await response.text();
        console.error("Erreur lors de l'ajout :", errorText);
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };

  // Mise à jour d'un étudiant
  const handleUpdateEtudiant = async (id_utilisateur: number, updatedData: any) => {
    console.log("Données envoyées à l'API :", updatedData); // 🛠 Vérifie la structure des données
    
    try {
      const response = await fetch(`/api/utilisateurs/etudiants/${id_utilisateur}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const updatedEtudiant = await response.json();
        console.log("Réponse de l'API :", updatedEtudiant);
  
        // Mise à jour locale de l'étudiant dans la liste
        setEtudiants((prev) =>
          prev.map((etudiant) =>
            etudiant.id === id_utilisateur ? { ...etudiant, ...updatedEtudiant } : etudiant
          )
        );
  
        // Rafraîchissement des étudiants depuis l'API après modification
        await fetchEtudiants(); // 🔄 Rafraîchit la liste après modification
  
        setIsUpdateModalOpen(false);
      } else {
        console.error("Erreur lors de la mise à jour :", await response.json());
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };
  
  

  // Fonction pour gérer la suppression d'un étudiant
const handleDeleteEtudiant = async () => {
  if (!etudiantToDelete) return; // Si aucun étudiant n'est sélectionné à supprimer

  try {
    const response = await fetch(`/api/utilisateurs/etudiants/${etudiantToDelete.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Si la suppression réussit, met à jour l'état local
      setEtudiants((prev) =>
        prev.filter((etudiant) => etudiant.id !== etudiantToDelete.id)
      );
      setIsDeleteModalOpen(false); // Ferme le modal de confirmation
      setEtudiantToDelete(null); // Réinitialise l'étudiant à supprimer
      
    } else {
      const errorText = await response.text();
      console.error("Erreur lors de la suppression :", errorText);
    }
  }catch (error) {
    console.error("Erreur lors de la suppression de l'étudiant :", error);
  }
};

 

  // Fonction pour ouvrir le modal de suppression
  const confirmDeleteEtudiant = (etudiant: User) => {
    setEtudiantToDelete(etudiant);
    setIsDeleteModalOpen(true);
  };

  // Filtrage des étudiants
  const filteredEtudiants = etudiants.filter((etudiant) => {
    return (
      `${etudiant.nom} ${etudiant.prenom} ${etudiant.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (classFilter ? etudiant.filiere.nom === classFilter : true) &&
      (yearFilter ? formatDate(etudiant.date_inscription) === yearFilter : true)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);
  const currentEtudiants = filteredEtudiants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log("Liste des étudiants affichée :", currentEtudiants);


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
        <select
          value={classFilter}
          onChange={(e) => {
            setClassFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/4 p-3 border rounded-lg text-sm"
        >
          <option value="">Filtrer par classe</option>
          {[...new Set(etudiants.map((e) => e.filiere.nom))].map((filiere) => (
            <option key={filiere} value={filiere}>
              {filiere}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-green-500 hover:bg-blue-300 text-white text-sm rounded-lg mr-4"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des étudiants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {currentEtudiants.map((etudiant) => (
         <ListCard
         key={etudiant.id_utilisateur}
         item={{
           ...etudiant,
           date_naissance: formatDate(etudiant.date_naissance), // Formatez ici
           date_inscription: formatDate(etudiant.date_inscription), // Formatez ici
         }}
         onDelete={() => confirmDeleteEtudiant(etudiant)}
         onSelect={() => setSelectedEtudiant(etudiant)}
         onEdit={() => {
           setSelectedEtudiant(etudiant);
           setIsUpdateModalOpen(true);
         }}
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 text-xs"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Modal de mise à jour */}
      {isUpdateModalOpen && selectedEtudiant && (
        <UpdateEtudiantModal
  etudiant={{
    id: selectedEtudiant?.id || 0,
    id_utilisateur: selectedEtudiant?.id_utilisateur || 0, // 🔹 Ajoutez cette ligne
    utilisateurs: {
      nom: selectedEtudiant?.nom || "",
      prenom: selectedEtudiant?.prenom || "",
      email: selectedEtudiant?.email || "",
      telephone: selectedEtudiant?.tel|| "",
      adresse: selectedEtudiant?.adresse || "",
      profil: selectedEtudiant?.image || "/profils/default.jpg",
      sexe: selectedEtudiant?.sexe || "",
    },
    matricule: selectedEtudiant?.matricule || "",
    filieres: {
      id_filiere: selectedEtudiant?.filiere.id_filiere || 0,
      nom: selectedEtudiant?.filiere.nom || "",
    },
    date_naissance: formatDate(selectedEtudiant?.date_naissance || ""), // Conversion ici
    date_inscription: formatDate(selectedEtudiant?.date_inscription || ""), // Conversion ici
  }}
  onClose={() => setIsUpdateModalOpen(false)}
  onUpdate={async (id_utilisateur, updatedData) => {
    console.log("ID utilisateur :", id_utilisateur);
    console.log("Données envoyées à l'API :", updatedData);

    await handleUpdateEtudiant(id_utilisateur, updatedData); 
    setIsUpdateModalOpen(false);
  }}
/>
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
          src={selectedEtudiant.image}
          
          className="object-cover w-[220px] h-[220px] rounded-full border"
        />
        {/* <h2 className="text-lg font-bold mt-2">{selectedEtudiant.nom} {selectedEtudiant.prenom}</h2>
        <p className="text-gray-500 text-sm">{selectedEtudiant.email}</p> */}
      </div>

      {/* Informations détaillées en colonnes */}
      <div className="grid grid-cols-2 gap-4 text-lg border-t pt-4">
      <p><strong>Nom :</strong> {selectedEtudiant.nom}</p>
      <p><strong>Prénom :</strong> {selectedEtudiant.prenom}</p>
      <p><strong>Email :</strong> {selectedEtudiant.email}</p>
        <p><strong>Sexe :</strong> {selectedEtudiant.sexe}</p>
        <p><strong>Téléphone :</strong> {selectedEtudiant.tel || "Non renseigné"}</p>
        <p><strong>Adresse :</strong> {selectedEtudiant.adresse || "Non renseignée"}</p>
        <p><strong>Matricule :</strong> {selectedEtudiant.matricule}</p>
        <p><strong>Filière :</strong> {selectedEtudiant.filiere.nom}</p>
        <p>
           <strong>Date d'inscription :</strong>{" "}
            {new Date(selectedEtudiant.date_inscription).toLocaleDateString("fr-FR")}
        </p>
        <p>
           <strong>Date de naissance :</strong>{" "}
            {new Date(selectedEtudiant.date_naissance).toLocaleDateString("fr-FR")}
        </p>

      </div>
    </div>
  </Modal>
)}
      {/* Modal d'ajout d'un étudiant */}
      {showForm && (
       <Modal onClose={() => setShowForm(false)}>
       <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
         <button
           onClick={() => setShowForm(false)}
           className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
         >
           X
         </button>
         <h2 className="text-lg font-bold mb-4">Ajouter un étudiant</h2>
        <RegisterFormEtudiant
          onClose={() => setShowForm(false)}
          onSubmit={handleAddEtudiant}
          onStudentAdded={(newStudent : User) => {
            setEtudiants((prev) => [...prev, newStudent]); // Ajoute le nouvel étudiant à la liste
          }}
        />
       </div>
     </Modal>
      )}
      {/* Modal de confirmation de suppression */}
{isDeleteModalOpen && (
  <Modal onClose={() => setIsDeleteModalOpen(false)}>
    <div className="p-5 bg-white rounded-lg shadow-lg w-[400px]">
      <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
      <p className="text-sm mb-4">
        Êtes-vous sûr de vouloir supprimer l'étudiant{" "}
        <span className="font-semibold">
          {etudiantToDelete?.nom} {etudiantToDelete?.prenom}
        </span> ?
        Cette action est irréversible.
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg"
        >
          Annuler
        </button>
        <button
          onClick={handleDeleteEtudiant} // Appel de la fonction de suppression
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Supprimer
        </button>
      </div>
    </div>
  </Modal>
)}

    </div>
  );
}