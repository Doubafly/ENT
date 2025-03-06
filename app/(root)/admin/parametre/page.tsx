"use client";
import React from "react";
import ListeAnnexes from "@/components/list/ListeAnnexes";
import { useState } from "react";
import {
  FaCog,
  FaPalette,
  FaUser,
  FaShieldAlt,
  FaBell,
  FaBuilding,
  FaUserShield,
  FaCalendarAlt,
  FaBook,
  FaSitemap,
} from "react-icons/fa";
import ListeModules from "@/components/list/ListeModules";
import ListeFilieres from "@/components/list/ListeFilieres";
import ListeRoles from "@/components/list/ListeRoles";

const ParametrePage = () => {
  const [activeSection, setActiveSection] = useState("Système");
  const [configurationAction, setConfigurationAction] = useState<string | null>(
    null
  );

  // Données pour les sections
  const sections = [
    {
      id: "Système",
      icon: <FaCog />,
      description: "Gérer les paramètres système",
    },
    {
      id: "Roles",
      icon: <FaUser />,
      description: "Gérer les differents Roles",
    },
    {
      id: "Annexes",
      icon: <FaBuilding />,
      description: "Gérer les differents annexes",
    },
    {
      id: "Sessions",
      icon: <FaCalendarAlt />,
      description: "Gérer les differents Sessions",
    },
    {
      id: "Modules",
      icon: <FaBook />,
      description: "Gérer les differents Modules",
    },
    {
      id: "Filieres",
      icon: <FaSitemap />,
      description: "Gérer les differents Filieres",
    },
    {
      id: "Personnaliser",
      icon: <FaPalette />,
      description: "Personnaliser l'apparence",
    },
    {
      id: "Confidentialité",
      icon: <FaShieldAlt />,
      description: "Contrôler la confidentialité",
    },
  ];

  const handleConfigure = (sectionId: string) => {
    setConfigurationAction(sectionId);
  };

  return (
    <div className="flex flex-col min-h-52 bg-gray-50 text-gray-800 mt-15 p-4 md:p-8 w-full">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Le sidebar du paramètre */}
        <span className="bg-white text-gray-800 rounded-lg shadow-lg w-full md:w-64 border-r border-gray-200 p-5 mb-50 md:mb-0 h-100">
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <ul>
            {sections.map((section) => (
              <li
                key={section.id}
                className={`mb-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100 hover:text-blue-600"
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-lg">{section.icon}</span>
                  <span className="font-medium">{section.id}</span>
                </div>
              </li>
            ))}
          </ul>
        </span>

        {/* Contenu des Paramètres */}
        <main className="flex-1 p-4 md:p-8">
          <h1 className="text-gray-800 text-2xl md:text-3xl font-bold mb-6">
            {activeSection}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Carte pour chaque sous-section */}
            {sections
              .filter((section) => section.id === activeSection)
              .map((section) => (
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
                  {/* Carte pour chaque sous-section */}
                  {sections
                    .filter(
                      (section) =>
                        section.id === activeSection && section.id !== "Annexes" && section.id !== "Roles" && section.id !== "Modules" && section.id !== "Filieres"
                    ) // Exclure la section "Annexes"
                    .map((section) => (
                      <div
                        key={section.id}
                        className="bg-white text-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="flex items-center mb-4">
                          <span className="text-2xl mr-3">{section.icon}</span>
                          <h2 className="text-xl font-semibold truncate">
                            {section.id}
                          </h2>
                        </div>
                        <p>{section.description}</p>
                        {!["Annexes", "Filieres", "Roles", "Modules"].includes(
                          section.id
                        ) && (
                          <button
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            onClick={() => handleConfigure(section.id)}
                          >
                            Configurer
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              ))}
          </div>

          {activeSection === "Roles" && <ListeRoles />}
          {activeSection === "Annexes" && <ListeAnnexes />}
          {activeSection === "Modules" && <ListeModules />}
          {activeSection === "Filieres" && <ListeFilieres />}

          {/* Affichage des actions de configuration */}
          {configurationAction === "Système" && (
            <div className="bg-white text-gray-800 mt-6 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Configuration du système
              </h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="language" className="block">
                    Langue
                  </label>
                  <select
                    id="language"
                    className="border-gray-300 w-full p-2 border rounded-lg"
                  >
                    <option>Français</option>
                    <option>Anglais</option>
                    <option>Espagnol</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </form>
            </div>
          )}

          {configurationAction === "Personnaliser" && (
            <div className="bg-white text-gray-800 mt-6 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Personnalisation de l'apparence
              </h2>
              <form>
                <div className="mb-4">
                  <label className="block">Couleur principale</label>
                  <input
                    type="color"
                    className="border-gray-300 w-full p-1 border rounded-lg"
                    title="Couleur principale"
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Taille de la police</label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    className="w-full"
                    title="Taille de la police"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </form>
            </div>
          )}

          {configurationAction === "Annexes" && (
            <div className="bg-white text-gray-800 mt-6 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Gestion des Annexes
              </h2>
              <form>
                <div className="mb-4">
                  <label className="block">Nom de l'annexes</label>
                  <input
                    type="text"
                    className="border-gray-300 w-full p-2 border rounded-lg"
                    placeholder="Nom d'utilisateur"
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Ville</label>
                  <input
                    type="text"
                    className="border-gray-300 w-full p-2 border rounded-lg"
                    placeholder="Nom d'utilisateur"
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Region</label>
                  <input
                    type="text"
                    className="border-gray-300 w-full p-2 border rounded-lg"
                    placeholder="Nom d'utilisateur"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </form>
            </div>
          )}

          {configurationAction === "Rôles" && (
            <div className="bg-white text-gray-800 mt-6 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Gestion des Rôles</h2>
              <form>
                <div className="mb-4">
                  <label className="block">Nom</label>
                  <input
                    type="text"
                    className="border-gray-300 w-full p-2 border rounded-lg"
                    placeholder="Nom d'utilisateur"
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Description</label>
                  <textarea
                    className="border-gray-300 w-full p-2 border rounded-lg"
                    placeholder="Nom d'utilisateur"
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Permissions</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Créer
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Lire
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Modifier
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Supprimer
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </form>
            </div>
          )}

          {configurationAction && (
            <button
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              onClick={() => setConfigurationAction(null)}
            >
              Fermer
            </button>
          )}
        </main>
      </div>
    </div>
  );
};

export default ParametrePage;
