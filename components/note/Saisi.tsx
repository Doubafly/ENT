import { useState } from "react";

interface Student {
  id: number;
  name: string;
  note_class?: number;
  note_exam?: number;
}

interface Module {
  id: number;
  name: string;
  students: Student[];
}

interface Semestre {
  id: string; // Correction : ID sous forme "id_filiere-Semestre1"
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
}

const StudentTable: React.FC<{ students: Student[]; moduleKey: number }> = ({
  students,
  moduleKey,
}) => {
  function submitNote() {
    alert("merci le monde");
  }

  return (
    <>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Étudiant</th>
            <th className="border p-2">Note Classe</th>
            <th className="border p-2">Note Examen</th>
          </tr>
        </thead>
        <tbody>
          {students.map(({ id, name, note_class, note_exam }) => (
            <tr key={id} className="border">
              <td className="p-2 border">{name}</td>
              <td className="p-2 border">
                <input
                  type="number"
                  className="border p-1 w-full"
                  defaultValue={note_class}
                  key={`${moduleKey}-${id}-note_class`}
                  title="Note Classe"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  className="border p-1 w-full"
                  defaultValue={note_exam}
                  key={`${moduleKey}-${id}-note_exam`}
                  title="Note Examen"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="float-right mt-4 border sidebar-link bg-green-100"
        onClick={submitNote}
      >
        {" "}
        Valider
      </button>
    </>
  );
};

const Saisi: React.FC<NoteEntryProps> = ({ classes }) => {
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

  return (
    <div className="mt-4">
      <div className="md:flex">
        {/* Sélection de la classe */}
        <div className="mb-4 ml-2">
          <label className="block font-medium mb-1">
            Sélectionner une classe
          </label>
          <select
            title="Sélectionner une classe"
            className="p-2 border rounded w-full"
            onChange={(e) => handleClassChange(Number(e.target.value))}
          >
            <option value="">-- Choisir --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sélection du semestre */}
        {selectedClass && (
          <div className="mb-4 ml-2">
            <label className="block font-medium mb-1">
              Sélectionner un semestre
            </label>
            <select
              title="Sélectionner un semestre"
              className="p-2 border rounded w-full"
              onChange={(e) => handleSemesterChange(e.target.value)}
            >
              <option value="">-- Choisir --</option>
              {classes
                .find((cls) => cls.id === selectedClass)
                ?.semestres.map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    {sem.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Sélection du module */}
        {selectedSemester && (
          <div className="mb-4 ml-2">
            <label className="block font-medium mb-1">
              Sélectionner un module
            </label>
            <select
              title="Sélectionner un module"
              className="p-2 border rounded w-full"
              onChange={(e) => setSelectedModule(Number(e.target.value))}
            >
              <option value="">-- Choisir --</option>
              {classes
                .find((cls) => cls.id === selectedClass)
                ?.semestres.find((sem) => sem.id === selectedSemester)
                ?.modules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.name}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Affichage des étudiants et saisie des notes */}
      {selectedModule && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Saisie des Notes</h2>
          <StudentTable
            students={
              classes
                .find((cls) => cls.id === selectedClass)
                ?.semestres.find((sem) => sem.id === selectedSemester)
                ?.modules.find((mod) => mod.id === selectedModule)?.students ||
              []
            }
            moduleKey={selectedModule}
          />
        </div>
      )}
    </div>
  );
};

export default Saisi;
