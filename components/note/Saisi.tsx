import { useEffect, useState } from "react";
import Modal from "@/components/modal/ModalBox";

interface Student {
  id: number;
  matricule: string;
  id_note?: number;
  name: string;
  id_cours?: number;
  note_class?: number;
  note_exam?: number;
  coefficient?: number;
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
const StudentTable: React.FC<{ students: Student[]; moduleKey: number | null }> = ({
  students,
  moduleKey,
}) => {
// Initialise notes avec students, et met à jour quand students change
const [notes, setNotes] = useState<Array<{
  id: string | number;
  id_note: number;
  id_cours: number;
  coefficient: number;
  note_class: number;
  note_exam: number;
  name: string;
}>>([]);
const [modal, setModal] = useState<{
  message: string;
  status: "success" | "error" | "info";
} | null>(null);

// Effet pour synchroniser notes avec students quand students change
useEffect(() => {
  if (students && students.length > 0) {
    setNotes(
      students.map((stud) => ({
        id: stud.id,
        matricule: stud.matricule,
        id_note: stud.id_note || 0,
        id_cours: stud.id_cours || 0,
        coefficient: stud.coefficient || 0,
        note_class: stud.note_class || 0,
        note_exam: stud.note_exam || 0,
        name: stud.name || "",
      }))
    );
  }
}, [students]);

// useEffect(() => {
//   console.log("Notes:", notes);
//   console.log("Notes:", students);


// }, [students, notes]);

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

      const { id_note, id: id_etudiant, id_cours } = student;

      const payload = {
        note_class: note.note_class,
        note_exam: note.note_exam,
      };

      // S'il a déjà une note enregistrée → PUT
      if (id_note) {
        const res = await fetch(`/api/notes/${id_note}`, {
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

      // Sinon → POST
      const res = await fetch(`/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          id_etudiant,
          id_cours,
          commentaire: "", // Optionnel
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(`Erreur création pour ${student.name} : ${error.message}`);
      }

      return res.json();
    });
    const results = await Promise.all(updatePromises);
    setModal({ message: "Traitement success !", status: "success" });

  } catch (error: any) {
    setModal({ message: "Erreur pendant l'enregistrement des notes : " + error.message, status: "error" });
    
  }
};




  return (
    <>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Étudiant</th>
            <th className="border p-2">Note Classe</th>
            <th className="border p-2">Note Examen</th>
            <th className="border p-2">Coefficient</th>
            <th className="border p-2">Note Matiere</th>

          </tr>
        </thead>
        <tbody>
          {students.map(({ id,name, note_class, note_exam, coefficient }) => {
          
            return (
              <tr key={id} className="border">
                <td className="p-2 border">{name}</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    className="border p-1 w-full"
                    defaultValue={note_class}
                    onChange={(e) =>
                      handleInputChange(id, "note_class", Number(e.target.value))
                    }
                    key={`${moduleKey}-${id}-note_class`}
                    title="Note Classe"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    className="border p-1 w-full"
                    defaultValue={note_exam}
                    onChange={(e) =>
                      handleInputChange(id, "note_exam", Number(e.target.value))
                    }
                    key={`${moduleKey}-${id}-note_exam`}
                    title="Note Examen"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    className="border p-1 w-full"
                    defaultValue={coefficient}
               
                    key={`${moduleKey}-${id}-coefficient`}
                    title="Coefficient"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    className="border p-1 w-full"
                    defaultValue={((note_class || 0) + ((note_exam || 0) * 2))/3}
               
                    key={`${moduleKey}-${id}-coefficient`}
                    title="Coefficient"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        className="float-right mt-4 border sidebar-link bg-green-100"
        onClick={submitNote}
      >
        Valider
      </button>
        {/* Affichage de la modal */}
        {modal && <Modal message={modal.message} status={modal.status} />}
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
      <div className="md:flex p-4">
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
      { (
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
