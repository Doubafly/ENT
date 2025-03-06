"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { registerUser } from "@/actions/signupetudiant";
import RegisterFormEtudiant from "../formulaires/RegisterFormEtudiant ";

type EtudiantType = {
  id: number;
  utilisateurs: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    profil: string;
  };
  cours: {
    filieremodule: {
      syllabus: string;
      filieres: {
        nom: string;
      };
      modules: {
        nom: string;
      };
    };
  }[];
};

const EtudiantTable = () => {
  const [etudiants, setEtudiants] = useState<EtudiantType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSur, setIsSur] = useState(false);

  const toggleIsSur = () => {
    setIsSur(!isSur);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleRegisterSubmit = async (formData: FormData) => {
    await registerUser(formData);
  };

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtrer les enseignants selon la recherche
  const filteredEtudiants = etudiants.filter(
    (etudiant) =>
      etudiant.utilisateurs.nom
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      etudiant.utilisateurs.email
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      etudiant.cours.some((cours) =>
        cours.filieremodule.filieres.nom
          .toLowerCase()
          .includes(search.toLowerCase())
      ) ||
      etudiant.cours.some((cours) =>
        cours.filieremodule.syllabus
          .toLowerCase()
          .includes(search.toLowerCase())
      ) ||
      etudiant.cours.some((cours) =>
        cours.filieremodule.modules.nom
          .toLowerCase()
          .includes(search.toLowerCase())
      ) ||
      etudiant.utilisateurs.adresse
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      etudiant.utilisateurs.telephone.includes(search)
  );

  // Pagination
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEtudiants = filteredEtudiants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  console.log(currentEtudiants);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Récupérer les enseignants depuis l'API
  useEffect(() => {
    const fetchEtudiants = async () => {
      const res = await fetch("/api/etudiant");
      if (!res.ok) {
        console.log("Erreur API :", res.status);
        return;
      }
      const data = await res.json();
      console.log("Données récupérées :", data);
      setEtudiants(data);
    };

    fetchEtudiants();
  }, []);

  return (
    <div className="w-full mt-16 gap-10 flex flex-col justify-start items-center">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold mb-4">Liste des Etudiants</h1>
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Rechercher..."
            className="border rounded p-2 w-1/3"
            value={search}
            onChange={handleSearchChange}
          />
          <button className="text-green-500 text-2xl" onClick={toggleModal}>
            +
          </button>
        </div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="p-2">Infos</th>
              <th className="p-2">ID_Etudiants</th>
              <th className="p-2">Modules</th>
              <th className="p-2">Classes</th>
              <th className="p-2">Téléphone</th>
              <th className="p-2">Adresses</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEtudiants.map((etudiant) => (
              <tr key={etudiant.id} className="border-b-2 border-b-gray-400">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {etudiant.utilisateurs.profil ? (
                      <img
                        src={etudiant.utilisateurs.profil}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <img
                        src="/icons/default-avatar.png"
                        alt="Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <div>
                        {etudiant.utilisateurs.nom}{" "}
                        {etudiant.utilisateurs.prenom}
                      </div>
                      <div className="text-sm text-gray-500">
                        {etudiant.utilisateurs.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-2">{etudiant.id}</td>
                <td className="p-2">
                  {etudiant.cours.map((cours) => (
                    <div key={cours.filieremodule?.modules.nom}>
                      {cours.filieremodule?.modules.nom || "N/A"}
                    </div>
                  ))}
                </td>
                <td className="p-2">
                  {etudiant.cours.map((cours) => (
                    <div key={cours.filieremodule?.filieres.nom}>
                      {cours.filieremodule?.filieres.nom || "N/A"}
                    </div>
                  ))}
                </td>
                <td className="p-2">{etudiant.utilisateurs.telephone}</td>
                <td className="p-2">{etudiant.utilisateurs.adresse}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Image
                      src="/icons/pencil.png"
                      alt="edit"
                      width={20}
                      height={20}
                      onClick={toggleIsSur}
                    />
                    <Image
                      src="/icons/eye.png"
                      alt="view"
                      width={20}
                      height={20}
                    />
                    <Image
                      src="/icons/delete.png"
                      alt="delete"
                      width={20}
                      height={20}
                      onClick={toggleIsSur}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <div>
            Page {currentPage} sur {totalPages}
          </div>
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      </div>

      {/* Ouvre le formualire d'inscription du prof */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-lg p-2 shadow-lg lg:px-8 lg:py-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <RegisterFormEtudiant
              onSubmit={handleRegisterSubmit}
              title="Inscription d'un nouveau Enseignant" onClose={function (): void {
                throw new Error("Function not implemented.");
              } }            />
          </div>
        </div>
      )}
      {/* Ouvre le formualire d'inscription du prof */}
      {isSur && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={toggleIsSur}
        >
          <div
            className="bg-white rounded-lg p-2 shadow-lg lg:px-8 lg:py-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-center">
              Supprimer un Enseignant
            </h2>
            <form>
              <div className="flex gap-2 text-center flex-col mt-6">
                <div className="text-lg flex justify-center font-medium w-[300px]">
                  êtes-vous sûr de vouloir effectuer cette opération?
                </div>
                <div className="flex justify-between items-center">
                  <button className="text-xl bg-green-500 rounded-xl px-10 py-2 text-white">
                    OUI
                  </button>
                  <button className="text-xl bg-red-500 rounded-xl px-10 py-2 text-white">
                    NON
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EtudiantTable;
