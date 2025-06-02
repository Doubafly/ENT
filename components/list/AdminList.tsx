"use client";

import { useState, useEffect } from "react";
import ListCard from "@/components/card/ListCard";
import Modal from "@/components/modal/Modal";

type User = {
  id: number;
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  sexe: string;
  tel: string;
  adresse: string;
  image: string;
  mot_de_passe: string;
  permissions: string | { [key: string]: boolean };
};

export default function AdminList() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<User | null>( null );
  const [newAdmins, setNewAdmins] = useState<User | null>(null);
  const adminsPerPage = 6;
  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/utilisateurs/admin");
      const data = await response.json();
      if (response.ok) {
        const formattedAdmins = data.utilisateurs.map((admin: any) => ({
          id: admin.id_admin,
          id_utilisateur: admin.utilisateur.id_utilisateur,
          nom: admin.utilisateur.nom,
          prenom: admin.utilisateur.prenom,
          email: admin.utilisateur.email,
          sexe: admin.utilisateur.sexe,
          tel: admin.utilisateur.telephone,
          adresse: admin.utilisateur.adresse,
          image: admin.utilisateur.profil || "/profils/default.jpg",
          permissions: admin.utilisateur.Permission[0],
        }));
        setAdmins(formattedAdmins);
      } else {
        console.error("Erreur récupération admins:", data.message);
      }
    } catch (error) {
      console.error("Erreur fetch admins :", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setNewAdmins((prev) => {
      if (!prev) {
        // Initialiser l'objet si newAdmins est null
        return {
          id: 0,
          id_utilisateur: 0,
          nom: "",
          prenom: "",
          email: "",
          sexe: "",
          tel: "",
          adresse: "",
          image: "",
          mot_de_passe:"",
          permissions: {
            enseignants: false,
            etudiants: false,
            admin: false,
            classes: false,
            paiement: false,
            note: false,
            emplois_du_temps: false,
            parametres: false,
            annonces: false,
          },
          [name]: type === "checkbox" ? checked : value,
        };
      }

      // Si c'est une case à cocher, on met à jour la valeur dans l'objet `permissions`
      if (type === "checkbox") {
        return {
          ...prev,
          permissions: {
            ...(typeof prev.permissions === "object" && prev.permissions ? prev.permissions : {}),
            [name]: checked,
          },
        };
      }

      // Sinon, on met à jour la valeur du champ texte
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

 
  function confirmDeleteAdmin(admin: any) {
    setAdminToDelete(admin);
    setIsDeleteModalOpen(true);
  }
    // Fonction pour gérer la suppression d'un enseignant
    const handleDeleteAdmin = async () => {
      if (!adminToDelete) return;
  
      try {
        const response = await fetch(
          `/api/utilisateurs/admin/${adminToDelete.id_utilisateur}`,
          {
            method: "DELETE",
          }
        );
  
        if (response.ok) {
          setAdmins((prev) =>
            prev.filter((admin) => admin.id_utilisateur !== adminToDelete.id_utilisateur)
          );
          setIsDeleteModalOpen(false);
          setAdminToDelete(null);
        } else {
          const errorText = await response.text();
          console.error("Erreur lors de la suppression :", errorText);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de l'enseignant :", error);
      }
    };


  function handleUpdateEnseignant(enseignant: any) {
    console.log("Update enseignant:", enseignant);
    // Add your update logic here
  }
  async function handleSubmit() {
    console.log("Enregistrer admin:", newAdmins);
    const response = await fetch(
      `/api/utilisateurs/admin`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmins),
      }
    );
    if(response.ok){
      fetchAdmins()
      setShowForm(false)
    }
  }
  console.log(admins);
  
    const filteredAdmins = admins?.filter((admin) =>
      `${admin.nom} ${admin.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
 

  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);
  const startIndex = (currentPage - 1) * adminsPerPage;
  const currentAdmins = filteredAdmins.slice(startIndex, startIndex + adminsPerPage);

  return (
    <div className="p-4 space-y-4">
        {/* Barre de recherche et filtres */}
        <div className="flex justify-between items-center mb-4 ml-6">
        <input
          type="text"
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/3 p-3 border rounded-lg text-sm"
        />
        <button
          onClick={() => setShowForm(true)}
          className="w-1/10 p-3 border rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 transition duration-200"    
        >
          + Ajouter
        </button>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {currentAdmins.map((admin) => (
               <ListCard
               key={admin.id_utilisateur}
               item={admin}
               onrecharge={fetchAdmins}
               onDelete={() => confirmDeleteAdmin(admin)}
               onSelect={() => setSelectedAdmin(admin)}
               onEdit={handleUpdateEnseignant}
               type={"admin"}
             />
        ))}
      </div>

            {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
            <p className="text-sm mb-4">
              Êtes-vous sûr de vouloir supprimer l'enseignant{" "}
              <span className="font-semibold">
                {adminToDelete?.nom} {adminToDelete?.prenom}
              </span>{" "}
              ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAdmin}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Supprimer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
           <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-[600px]">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Profil Administrateur
        </h2>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Nom:</label>
            <input
              type="text"
              name="nom"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Prénom:</label>
            <input
              type="text"
              name="prenom"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Téléphone:</label>
            <input
              type="text"
              name="telephone"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Adresse:</label>
            <input
              type="text"
              name="adresse"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Mot de passe:</label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="password"
            />
          </div>
        </div>
        <div className="flex gap-4 mb-4">
        <div className="w-1/2">
          <label className="block text-gray-700">Sexe:</label>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sexe"
                value="M"
                onChange={handleChange}
                className="form-radio"
              />
              Homme
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sexe"
                value="F"
                onChange={handleChange}
                className="form-radio"
              />
              Femme
            </label>
          </div>
        </div>
      </div>

        {/* Affichage des permissionss sans possibilité de modification */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Permissionss :</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div key="enseignants" className="flex items-center gap-2 text-sm text-gray-700 capitalize">
              <input
                type="checkbox"
                name={"enseignants"}
                onChange={handleChange}
              />
              enseignants
            </div>
            <div key="etudiants" className="flex items-center gap-2 text-sm text-gray-700 capitalize">
              <input
                type="checkbox"
                name={"etudiants"}
                onChange={handleChange}
              />
              etudiants
            </div>
            <div key="admin" className="flex items-center gap-2 text-sm text-gray-700 capitalize">
              <input
                type="checkbox"
                name={"admin"}
                onChange={handleChange}
              />
              admin
            </div>
            <div key="classes" className="flex items-center gap-2 text-sm text-gray-700 capitalize">
              <input
                type="checkbox"
                name={"classes"}
                onChange={handleChange}
              />
              classes
            </div>
            <div key="paiement" className="flex items-center gap-2 text-sm text-gray-700 capitalize">
              <input
                type="checkbox"
                name={"paiement"}
                onChange={handleChange}
              />
              paiement
            </div>
            <div key="note" className="flex items-center gap-2 text-sm text-gray-700 capitalize">
              <input
                type="checkbox"
                name={"note"}
                onChange={handleChange}
              />
              note
            </div>
            <div key="emplois_du_temps" className="flex items-center gap-2 text-sm text-gray-700 capitalize">
              <input
                type="checkbox"
                name={"emplois_du_temps"}
                onChange={handleChange}
              />
              emplois du temps
            </div>
            <div key="parametres" className="flex items-center gap-2 text-sm text-gray-700 capitalize">
              <input
                type="checkbox"
                name={"parametres"}
                onChange={handleChange}
              />
              paramètres
            </div>
            <div key="annonces" className="flex items-center gap-2 text-sm text-gray-700 capitalize">
              <input
                type="checkbox"
                name={"annonces"}
                onChange={handleChange}
              />
              annonces
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            // onClick={handleCloseAll}
            className="bg-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </div>
      </div>

    </div>
        </Modal>
      )}
        {selectedAdmin && (
        <Modal onClose={() => setSelectedAdmin(null)}>
          <div className="p-5 bg-white rounded-lg shadow-lg w-[600px] relative">
            {/* Bouton Fermer */}
            <button
              onClick={() => setSelectedAdmin(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              x
            </button>

            {/* Image de profil et Nom */}
            <div className="flex flex-col items-center mb-4">
              <img
                title="imgEstudiant"
                src={selectedAdmin.image}
                className="object-cover w-[220px] h-[220px] rounded-full border"
              />
              {/* <h2 className="text-lg font-bold mt-2">{selectedAdmin.nom} {selectedAdmin.prenom}</h2>
        <p className="text-gray-500 text-sm">{selectedAdmin.email}</p> */}
            </div>

            {/* Informations détaillées en colonnes */}
            <div className="grid grid-cols-2 gap-4 text-lg border-t pt-4">
              <p>
                <strong>Nom :</strong> {selectedAdmin.nom}
              </p>
              <p>
                <strong>Prénom :</strong> {selectedAdmin.prenom}
              </p>
              <p>
                <strong>Email :</strong> {selectedAdmin.email}
              </p>
              <p>
                <strong>Sexe :</strong> {selectedAdmin.sexe}
              </p>
              <p>
                <strong>Téléphone :</strong>{" "}
                {selectedAdmin.tel || "Non renseigné"}
              </p>
              <p>
                <strong>Adresse :</strong>{" "}
                {selectedAdmin.adresse || "Non renseignée"}
              </p>
                 {/* Affichage des permissions sans possibilité de modification */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Permissions :</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.keys(selectedAdmin.permissions).map((perm) => (
              <div key={perm} className="flex items-center gap-2 text-sm text-gray-700 capitalize">
                <input
                  type="checkbox"
                  name={`permissions.${perm}`}
                  checked={selectedAdmin.permissions[perm]}
                />
                {perm.replace(/_/g, " ")}
              </div>
            ))}
          </div>
        </div>
            </div>
          </div>
        </Modal>
      )}
    
    </div>
  );
}
