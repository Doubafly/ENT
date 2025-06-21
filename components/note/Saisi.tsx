import { useEffect, useState } from "react";
import Modal from "@/components/modal/ModalBox";
import { FiFilter, FiChevronDown, FiChevronUp, FiSave, FiX, FiUsers, FiBook, FiCalendar, FiAward, FiChevronRight } from "react-icons/fi";

interface Student {
  id: number;
  matricule: string;
  id_note?: number;
  name: string;
  id_cours?: number;
  notes: any;
  coefficient?: number;
}

interface Module {
  id: number;
  name: string;
  students: Student[];
}

interface Semestre {
  id: string;
  name: string;
  modules: Module[];
}

interface Classe {
  id: number;
  name: string;
  semestres: Semestre[];
}

interface NoteEntryProps {
  classes: Classe[];
  onrecharge: () => void;
}

const StudentTable: React.FC<{ students: Student[]; moduleKey: number | null; onrecharge: () => void }> = ({
  students,
  moduleKey,
  onrecharge,
}) => {
  const [notes, setNotes] = useState<Array<{
    id: string | number;
    id_note: number;
    id_cours: number;
    statut_reclamation: string;
    commentaire_etudiant: string;
    coefficient: number;
    note_class: number;
    note_exam: number;
    name: string;
  }>>([]);

  const [modal, setModal] = useState<{
    message: string;
    status: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (students && students.length > 0) {
      setNotes(
        students.map((stud) => ({
          id: stud.id,
          matricule: stud.matricule,
          id_note: stud.notes?.[0]?.id_note || 0,
          id_cours: stud.id_cours || 0,
          statut_reclamation: stud.notes?.[0]?.statut_reclamation || "",
          commentaire_etudiant: stud.notes?.[0]?.statut_reclamation || "",
          coefficient: stud.coefficient || 0,
          note_class: stud.notes?.[0]?.note_class || 0,
          note_exam: stud.notes?.[0]?.note_exam || 0,
          name: stud.name || "",
        }))
      );
    }
  }, [students]);

  const handleInputChange = (
    id: string | number,
    field: "note_class" | "note_exam",
    value: number
  ) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, [field]: value } : note
      )
    );
  };

  const submitNote = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const updatePromises = notes.map(async (note) => {
        const student = students.find((s) => s.id === note.id);
        if (!student) return;

        const { notes, id: id_etudiant, id_cours } = student;
        const id_note = notes?.[0]?.id_note;

        const payload = {
          note_class: note.note_class,
          note_exam: note.note_exam,
        };

        if (id_note) {
          const res = await fetch(`/api/notes/${note.id_note}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(`Erreur update pour ${student.name} : ${error.message}`);
          }
          return res.json();
        }

        const res = await fetch(`/api/notes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...payload,
            id_etudiant,
            id_cours,
            commentaire_enseignant: "",
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(`Erreur création pour ${student.name} : ${error.message}`);
        }
        onrecharge();
        return res.json();
      });
      const results = await Promise.all(updatePromises);
      setModal({ message: "Notes enregistrées avec succès !", status: "success" });
      onrecharge();
    } catch (error: any) {
      setModal({ 
        message: "Erreur pendant l'enregistrement des notes : " + error.message, 
        status: "error" 
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex items-center">
                  <FiUsers className="mr-2" />
                  Étudiant
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex items-center">
                  <FiBook className="mr-2" />
                  Note Classe
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex items-center">
                  <FiAward className="mr-2" />
                  Note Examen
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Coefficient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Note Finale
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map(({ id, name, notes, coefficient }) => {
                const note =
                  notes && notes[0]
                    ? ((Number(notes[0].note_class) || 0) + (Number(notes[0].note_exam) || 0) * 2) / 3
                    : 0;
                return (
                  <tr
                    key={id}
                    className={`hover:bg-gray-50 transition-colors ${
                      notes?.[0]?.statut_reclamation === "EnAttente"
                        ? "bg-amber-50"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-20 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue={notes?.[0]?.note_class || 0}
                        onChange={(e) =>
                          handleInputChange(id, "note_class", Number(e.target.value))
                        }
                        min="0"
                        max="20"
                        step="0.1"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-20 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue={notes?.[0]?.note_exam || 0}
                        onChange={(e) =>
                          handleInputChange(id, "note_exam", Number(e.target.value))
                        }
                        min="0"
                        max="20"
                        step="0.1"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coefficient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                      {note.toFixed(2)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun étudiant trouvé pour cette sélection
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {students.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 flex justify-end border-t border-gray-200">
          <button
            onClick={submitNote}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiSave className="mr-2" />
            Enregistrer les notes
          </button>
        </div>
      )}
      {modal && <Modal message={modal.message} status={modal.status} />}
    </div>
  );
};

const Saisi: React.FC<NoteEntryProps> = ({ classes, onrecharge }) => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  const handleClassChange = (classId: number) => {
    setSelectedClass(classId);
    setSelectedSemester(null);
    setSelectedModule(null);
  };

  const handleSemesterChange = (semesterId: string) => {
    setSelectedSemester(semesterId);
    setSelectedModule(null);
  };

  const resetFilters = () => {
    setSelectedClass(null);
    setSelectedSemester(null);
    setSelectedModule(null);
  };

  const selectedClassData = classes.find((cls) => cls.id === selectedClass);
  const selectedSemesterData = selectedClassData?.semestres.find(
    (sem) => sem.id === selectedSemester
  );
  const selectedModuleData = selectedSemesterData?.modules.find(
    (mod) => mod.id === selectedModule
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FiFilter className="mr-2 text-blue-500" />
          Sélectionnez les critères
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiUsers className="mr-2 text-blue-500" />
              Classe
            </label>
            <select
              value={selectedClass || ""}
              onChange={(e) => handleClassChange(Number(e.target.value))}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiCalendar className="mr-2 text-blue-500" />
              Semestre
            </label>
            <select
              value={selectedSemester || ""}
              onChange={(e) => handleSemesterChange(e.target.value)}
              disabled={!selectedClass}
              className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !selectedClass ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Tous les semestres</option>
              {selectedClassData?.semestres.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiBook className="mr-2 text-blue-500" />
              Module
            </label>
            <select
              value={selectedModule || ""}
              onChange={(e) => setSelectedModule(Number(e.target.value))}
              disabled={!selectedSemester}
              className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !selectedSemester ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Tous les modules</option>
              {selectedSemesterData?.modules.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(selectedClass || selectedSemester || selectedModule) && (
          <div className="flex justify-between items-center mb-4 bg-blue-50 p-3 rounded-md">
            <div className="text-sm text-gray-700 flex items-center">
              <span className="font-medium text-blue-700">
                {selectedClassData?.name || "Toutes les classes"}
              </span>
              {selectedSemesterData && (
                <>
                  <FiChevronRight className="mx-2 text-gray-400" />
                  <span>{selectedSemesterData.name}</span>
                </>
              )}
              {selectedModuleData && (
                <>
                  <FiChevronRight className="mx-2 text-gray-400" />
                  <span>{selectedModuleData.name}</span>
                </>
              )}
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center text-sm text-red-600 hover:text-red-800"
            >
              <FiX className="mr-1" />
              Réinitialiser
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FiUsers className="mr-2 text-blue-500" />
          Liste des Étudiants
        </h3>
        <StudentTable
          students={selectedModuleData?.students || []}
          moduleKey={selectedModule}
          onrecharge={onrecharge}
        />
      </div>
    </div>
  );
};

export default Saisi;