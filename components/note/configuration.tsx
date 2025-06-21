"use client";

import Modal from "@/components/modal/ModalBox";
import { useEffect, useState } from "react";
import {
  FiChevronUp,
  FiEdit2,
  FiInfo,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";

interface Module {
  id_module: number;
  nom: string;
  description?: string;
}

interface Session {
  id_sessions: number;
  annee_academique: string;
}

interface Enseignant {
  id: number;
  nom: string;
  prenom: string;
  specialite: string;
  utilisateur?: {
    nom: string;
    prenom: string;
  };
}

interface Cours {
  id_cours: number;
  semestre: string;
  sessions: Session;
  enseignant: Enseignant;
}

interface FiliereModule {
  id_filiere_module: number;
  id_module: number;
  module: Module;
  coefficient: number;
  volume_horaire?: number;
  code_module?: string;
  cours?: Cours[];
}

interface Classe {
  id_filiere: number;
  nom: string;
  filiere_module?: FiliereModule[];
}

export default function Configuration({
  filiereId,
  donne,
  alldata,
}: {
  filiereId: number | null;
  donne: Classe;
  alldata: any;
}) {
  // États
  const [modules, setModules] = useState<FiliereModule[]>(
    donne.filiere_module || []
  );
  const [allModules, setAllModules] = useState<Module[]>(
    alldata.data.allModules || []
  );
  const [sessions, setSessions] = useState<Session[]>(
    alldata.data.allsession || []
  );
  const [enseignants, setEnseignants] = useState<Enseignant[]>(
    alldata.data.enseignants || []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // États du formulaire
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState<
    "selectModule" | "configureModule" | "createCours"
  >("selectModule");

  // Sélections
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedFiliereModule, setSelectedFiliereModule] =
    useState<FiliereModule | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedEnseignant, setSelectedEnseignant] =
    useState<Enseignant | null>(null);
  const [semestre, setSemestre] = useState("Semestre1");

  // Configuration module
  const [moduleConfig, setModuleConfig] = useState({
    coefficient: 1,
    volume_horaire: 30,
    code_module: "",
  });

  // Édition
  const [editingCours, setEditingCours] = useState<Cours | null>(null);
  const [editingFiliereModule, setEditingFiliereModule] =
    useState<FiliereModule | null>(null);

  // Suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    type: "module" | "cours";
  }>();
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    status: "success" | "error" | "info";
  }>({ show: false, message: "", status: "info" });

  // Gestion des erreurs
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(
        () => setNotification({ ...notification, show: false }),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fonctions de gestion des modules
  const handleSelectModule = (module: Module | null) => {
    setSelectedModule(module);
    if (!module) return;

    const existingModule = modules.find(
      (m) => m.id_module === module.id_module
    );
    if (existingModule) {
      setSelectedFiliereModule(existingModule);
      setStep("createCours");
    } else {
      setSelectedFiliereModule(null);
      setModuleConfig({
        coefficient: 1,
        volume_horaire: 30,
        code_module: `MOD-${module.id_module.toString().padStart(3, "0")}`,
      });
      setStep("configureModule");
    }
  };

  const handleCreateFiliereModule = async () => {
    if (!selectedModule || !filiereId) {
      setError("Veuillez sélectionner un module");
      return;
    }

    setLoading(true);
    try {
      const url = editingFiliereModule
        ? `/api/filiereModule/${editingFiliereModule.id_filiere_module}`
        : "/api/filiereModule";

      const method = editingFiliereModule ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_module: selectedModule.id_module,
          id_filiere: filiereId,
          ...moduleConfig,
          ...(editingFiliereModule && {
            id_filiere_module: editingFiliereModule.id_filiere_module,
          }),
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'opération");

      const { data } = await response.json();

      setModules((prev) =>
        editingFiliereModule
          ? prev.map((m) =>
              m.id_filiere_module === data.id_filiere_module
                ? { ...data, module: selectedModule, cours: m.cours }
                : m
            )
          : [...prev, { ...data, module: selectedModule, cours: [] }]
      );

      setSelectedFiliereModule({ ...data, module: selectedModule, cours: [] });
      setStep("createCours");

      setNotification({
        show: true,
        message: editingFiliereModule
          ? "Module mis à jour avec succès"
          : "Module créé avec succès",
        status: "success",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setNotification({
        show: true,
        message: err instanceof Error ? err.message : "Erreur inconnue",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCours = async () => {
    if (!selectedFiliereModule || !selectedSession || !selectedEnseignant) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const url = editingCours
        ? `/api/cours/${editingCours.id_cours}`
        : "/api/cours";

      const method = editingCours ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_filiere_module: selectedFiliereModule.id_filiere_module,
          id_professeur: selectedEnseignant.id,
          id_sessions: selectedSession.id_sessions,
          semestre,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'opération");

      const { data } = await response.json();

      setModules((prev) =>
        prev.map((m) => {
          if (m.id_filiere_module !== selectedFiliereModule.id_filiere_module)
            return m;

          const cours = m.cours || [];
          return {
            ...m,
            cours: editingCours
              ? cours.map((c) =>
                  c.id_cours === editingCours.id_cours
                    ? {
                        ...data,
                        sessions: selectedSession,
                        enseignant: selectedEnseignant,
                      }
                    : c
                )
              : [
                  ...cours,
                  {
                    ...data,
                    sessions: selectedSession,
                    enseignant: selectedEnseignant,
                  },
                ],
          };
        })
      );

      resetForm();

      setNotification({
        show: true,
        message: editingCours
          ? "Cours mis à jour avec succès"
          : "Cours créé avec succès",
        status: "success",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setNotification({
        show: true,
        message: err instanceof Error ? err.message : "Erreur inconnue",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    setLoading(true);
    try {
      const url =
        itemToDelete.type === "cours"
          ? `/api/cours/${itemToDelete.id}`
          : `/api/filiereModule/${itemToDelete.id}`;

      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setModules((prev) =>
        itemToDelete.type === "module"
          ? prev.filter((m) => m.id_filiere_module !== itemToDelete.id)
          : prev.map((m) => ({
              ...m,
              cours:
                m.cours?.filter((c) => c.id_cours !== itemToDelete.id) || [],
            }))
      );

      setShowDeleteModal(false);

      setNotification({
        show: true,
        message:
          itemToDelete.type === "module"
            ? "Module supprimé avec succès"
            : "Cours supprimé avec succès",
        status: "success",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
      setNotification({
        show: true,
        message:
          err instanceof Error ? err.message : "Erreur lors de la suppression",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setStep("selectModule");
    setSelectedModule(null);
    setSelectedFiliereModule(null);
    setSelectedSession(null);
    setSelectedEnseignant(null);
    setEditingCours(null);
    setEditingFiliereModule(null);
    setModuleConfig({
      coefficient: 1,
      volume_horaire: 30,
      code_module: "",
    });
  };

  const getEnseignantName = (enseignant: Enseignant) => {
    return enseignant.utilisateur
      ? `${enseignant.utilisateur.prenom} ${enseignant.utilisateur.nom}`
      : `${enseignant.prenom} ${enseignant.nom}`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Notification Modal */}
      {notification.show && (
        <Modal message={notification.message} status={notification.status} />
      )}

      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Configuration des Cours - {donne.nom}
        </h1>

        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showForm
              ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {showForm ? (
            <>
              <FiChevronUp />
              <span>Masquer le formulaire</span>
            </>
          ) : (
            <>
              <FiPlus />
              <span>Nouveau cours</span>
            </>
          )}
        </button>
      </div>

      {/* Message d'erreur */}
      {error && !notification.show && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <div className="flex items-center">
            <FiX className="mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingCours
                ? "Modifier un cours"
                : editingFiliereModule
                ? "Modifier un module"
                : "Nouveau cours"}
            </h2>

            <div className="flex mb-6">
              <div
                className={`flex-1 text-center py-2 border-b-2 ${
                  step === "selectModule"
                    ? "border-blue-500 text-blue-600 font-medium"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                Sélection du module
              </div>
              <div
                className={`flex-1 text-center py-2 border-b-2 ${
                  step === "configureModule"
                    ? "border-blue-500 text-blue-600 font-medium"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                Configuration
              </div>
              <div
                className={`flex-1 text-center py-2 border-b-2 ${
                  step === "createCours"
                    ? "border-blue-500 text-blue-600 font-medium"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                Création du cours
              </div>
            </div>

            {step === "selectModule" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module
                  </label>
                  <select
                    value={selectedModule?.id_module || ""}
                    onChange={(e) => {
                      const moduleId = parseInt(e.target.value);
                      const module =
                        allModules.find((m) => m.id_module === moduleId) ||
                        null;
                      handleSelectModule(module);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez un module</option>
                    {allModules.map((module) => (
                      <option key={module.id_module} value={module.id_module}>
                        {module.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (selectedFiliereModule) {
                        setStep("createCours");
                      } else if (selectedModule) {
                        setStep("configureModule");
                      }
                    }}
                    disabled={!selectedModule}
                    className={`px-4 py-2 rounded-lg ${
                      selectedModule
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}

            {step === "configureModule" && selectedModule && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Configuration du module {selectedModule.nom}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code module
                    </label>
                    <input
                      type="text"
                      value={moduleConfig.code_module}
                      onChange={(e) =>
                        setModuleConfig({
                          ...moduleConfig,
                          code_module: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coefficient
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={moduleConfig.coefficient}
                      onChange={(e) =>
                        setModuleConfig({
                          ...moduleConfig,
                          coefficient: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volume horaire (heures)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={moduleConfig.volume_horaire}
                      onChange={(e) =>
                        setModuleConfig({
                          ...moduleConfig,
                          volume_horaire: parseInt(e.target.value) || 30,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep("selectModule")}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Retour
                  </button>

                  <button
                    onClick={handleCreateFiliereModule}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-white ${
                      loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        En cours...
                      </span>
                    ) : editingFiliereModule ? (
                      "Mettre à jour le module"
                    ) : (
                      "Associer le module"
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === "createCours" && selectedFiliereModule && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  {editingCours ? "Modifier" : "Créer"} un cours pour{" "}
                  {selectedFiliereModule.module.nom}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session académique
                    </label>
                    <select
                      value={selectedSession?.id_sessions || ""}
                      onChange={(e) => {
                        const sessionId = parseInt(e.target.value);
                        const session =
                          sessions.find((s) => s.id_sessions === sessionId) ||
                          null;
                        setSelectedSession(session);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionnez une session</option>
                      {sessions.map((session) => (
                        <option
                          key={session.id_sessions}
                          value={session.id_sessions}
                        >
                          {session.annee_academique}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semestre
                    </label>
                    <select
                      value={semestre}
                      onChange={(e) => setSemestre(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Semestre1">Semestre 1</option>
                      <option value="Semestre2">Semestre 2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enseignant
                    </label>
                    <select
                      value={selectedEnseignant?.id || ""}
                      onChange={(e) => {
                        const enseignantId = parseInt(e.target.value);
                        const enseignant =
                          enseignants.find((e) => e.id === enseignantId) ||
                          null;
                        setSelectedEnseignant(enseignant);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionnez un enseignant</option>
                      {enseignants.map((enseignant) => (
                        <option key={enseignant.id} value={enseignant.id}>
                          {getEnseignantName(enseignant)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() =>
                      setStep(
                        selectedFiliereModule
                          ? "selectModule"
                          : "configureModule"
                      )
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Retour
                  </button>

                  <button
                    onClick={handleCreateCours}
                    disabled={
                      !selectedSession || !selectedEnseignant || loading
                    }
                    className={`px-4 py-2 rounded-lg text-white ${
                      !selectedSession || !selectedEnseignant
                        ? "bg-gray-400 cursor-not-allowed"
                        : loading
                        ? "bg-blue-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        En cours...
                      </span>
                    ) : editingCours ? (
                      "Mettre à jour le cours"
                    ) : (
                      "Créer le cours"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Liste des cours - Version sans défilement horizontal */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Liste des cours
          </h2>

          <div className="w-full">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coeff.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume H
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semestre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enseignant
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modules.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      Aucun module configuré
                    </td>
                  </tr>
                ) : (
                  modules.flatMap((module) =>
                    module.cours && module.cours.length > 0 ? (
                      module.cours.map((cours) => (
                        <tr
                          key={`cours-${cours.id_cours}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {module.module.nom}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {module.code_module}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {module.coefficient}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {module.volume_horaire}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {cours.sessions.annee_academique}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {cours.semestre}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {getEnseignantName(cours.enseignant)}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedModule(module.module);
                                  setSelectedFiliereModule(module);
                                  setSelectedSession(cours.sessions);
                                  setSelectedEnseignant(cours.enseignant);
                                  setSemestre(cours.semestre);
                                  setEditingCours(cours);
                                  setShowForm(true);
                                  setStep("createCours");
                                }}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                title="Modifier"
                              >
                                <FiEdit2 size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setItemToDelete({
                                    id: cours.id_cours,
                                    type: "cours",
                                  });
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                title="Supprimer"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr
                        key={`module-${module.id_filiere_module}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {module.module.nom}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {module.code_module}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {module.coefficient}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {module.volume_horaire}
                        </td>
                        <td
                          colSpan={3}
                          className="px-4 py-4 text-sm text-gray-500"
                        >
                          Aucun cours programmé
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setSelectedModule(module.module);
                                setSelectedFiliereModule(module);
                                setEditingFiliereModule(module);
                                setShowForm(true);
                                setStep("configureModule");
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                              title="Modifier"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setItemToDelete({
                                  id: module.id_filiere_module,
                                  type: "module",
                                });
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                              title="Supprimer"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression personnalisé */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="text-center">
              <FiInfo className="mx-auto text-red-500 w-12 h-12 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirmer la suppression
              </h3>
              <p className="text-gray-500 mb-6">
                Êtes-vous sûr de vouloir supprimer{" "}
                {itemToDelete?.type === "cours"
                  ? "ce cours"
                  : "ce module et tous ses cours associés"}{" "}
                ? Cette action est irréversible.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteItem}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white ${
                  loading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? "Suppression..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
