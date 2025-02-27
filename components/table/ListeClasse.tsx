"use client";
import { useState } from "react";

interface Classe {
  id: number;
  abbr: string;
  name: string;
  enseignants: string[];
}

export default function ClasseList() {
  const [classes, setClasses] = useState<Classe[]>([
    {
      id: 1,
      abbr: "AP",
      name: "Analyse-Programmation",
      enseignants: ["Drissa Kouma"],
    },
    { id: 2, abbr: "GL", name: "Génie Logiciel", enseignants: ["Awa Traoré"] },
    {
      id: 3,
      abbr: "RSI",
      name: "Réseaux et Systèmes Informatiques",
      enseignants: ["Ibrahim Diallo"],
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassAbbr, setNewClassAbbr] = useState("");
  const [newClassName, setNewClassName] = useState("");

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.abbr.toLowerCase().includes(search.toLowerCase())
  );

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  // Gestion des enseignants
  const handleAddTeacher = () => {
    if (!newTeacher.trim() || !selectedClassId) return;

    const trimmedTeacher = newTeacher.trim();
    const exists = classes.some(
      (c) => c.id === selectedClassId && c.enseignants.includes(trimmedTeacher)
    );

    if (exists) {
      alert("Cet enseignant existe déjà !");
      return;
    }

    setClasses((prev) =>
      prev.map((c) =>
        c.id === selectedClassId
          ? { ...c, enseignants: [...c.enseignants, trimmedTeacher] }
          : c
      )
    );
    setNewTeacher("");
  };

  const handleRemoveTeacher = (teacher: string) => {
    if (!selectedClassId) return;

    setClasses((prev) =>
      prev.map((c) =>
        c.id === selectedClassId
          ? { ...c, enseignants: c.enseignants.filter((t) => t !== teacher) }
          : c
      )
    );
  };

  // Gestion des classes
  const handleDeleteClass = (id: number) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    if (id === selectedClassId) {
      setShowModal(false);
      setSelectedClassId(null);
    }
  };

  const handleAddClass = () => {
    if (!newClassAbbr.trim() || !newClassName.trim()) return;

    const newClass: Classe = {
      id: Math.max(...classes.map((c) => c.id), 0) + 1,
      abbr: newClassAbbr.trim(),
      name: newClassName.trim(),
      enseignants: [],
    };

    setClasses((prev) => [...prev, newClass]);
    setShowAddModal(false);
    setNewClassAbbr("");
    setNewClassName("");
  };

  const handleUpdateClass = (updatedClass: Classe) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Rechercher une classe..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Ajouter
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Abréviation</th>
            <th className="border p-2">Nom Complet</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClasses.map((classe) => (
            <tr key={classe.id} className="border">
              <td className="border p-2">{classe.abbr}</td>
              <td className="border p-2">{classe.name}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedClassId(classe.id);
                    setShowModal(true);
                  }}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Voir
                </button>
                <button
                  onClick={() => handleDeleteClass(classe.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedClass && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Modifier la classe</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Abréviation</label>
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={selectedClass.abbr}
                  onChange={(e) =>
                    handleUpdateClass({
                      ...selectedClass,
                      abbr: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nom complet</label>
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={selectedClass.name}
                  onChange={(e) =>
                    handleUpdateClass({
                      ...selectedClass,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Enseignants</label>
                <ul className="space-y-2">
                  {selectedClass.enseignants.map((teacher, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{teacher}</span>
                      <button
                        onClick={() => handleRemoveTeacher(teacher)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Ajouter un enseignant"
                    className="border p-2 rounded w-full"
                    value={newTeacher}
                    onChange={(e) => setNewTeacher(e.target.value)}
                  />
                  <button
                    onClick={handleAddTeacher}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white p-6 rounded w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Ajouter une classe</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Abréviation</label>
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={newClassAbbr}
                  onChange={(e) => setNewClassAbbr(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nom complet</label>
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddClass}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
