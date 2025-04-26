import { useState } from "react";
import Imprimer from "../imprimerBulletin/Imprimer";
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
const Resultat: React.FC<NoteEntryProps> = ({ classes }) => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState('');

  const handleClassChange = (classId: number) => {
    setSelectedClass(classId);
    setSelectedSemester(null);
  };

  const handleSemesterChange = (semesterId: string) => {
    setSelectedSemester(semesterId);
  };

  return <div>

<div className="mt-4">
      <div className="md:flex p-4">
  {/* Sélection session */}
      <div className="mb-4 ml-2">
          <label className="block font-medium mb-1">
            Sélectionner une Année Académique
          </label>
          <select
            title="Sélectionner une Année Académique"
            className="p-2 border rounded w-full"
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            <option value="">-- Choisir --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
      </div>

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

      </div>
    </div>
    
    {/* <Imprimer 
      students={
        classes
          .find((cls) => cls.id === selectedClass)
          ?.semestres.find((sem) => sem.id === selectedSemester)
          ?.modules.find((mod) => mod.id === selectedModule)?.students ||
        []
      } /> */}
  </div>;
}
export default Resultat;