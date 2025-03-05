"use client";
import { cn } from "@/lib/utils";
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
  id: number;
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
      <button className="float-right mt-4 border sidebar-link bg-green-100">
        {" "}
        Valider
      </button>
    </>
  );
};

const NoteRegistre: React.FC<NoteEntryProps> = ({ classes }) => {
  const [selectedClass, setSelectedClass] = useState<number | null>(1);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectMenu, setSelectMenu] = useState(1);

  const handleClassChange = (classId: number) => {
    // alert("bombe");
    setSelectedClass(classId);
    setSelectedSemester(null);
    setSelectedModule(null);
  };

  const handleSemesterChange = (semesterId: number) => {
    setSelectedSemester(semesterId);
    setSelectedModule(null);
  };
  const handleMenurChange = (num: number) => {
    setSelectMenu(num);
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold m-0  bg-gray-100">
        Gestion des Notes
      </h1>
      {/* partie menu */}
      <div className="flex w-full  bg-gray-100">
        <div
          className={cn(
            " px-4 ",
            selectMenu == 1 ? "bg-white" : "bg-gray-200 "
          )}
        >
          <button onClick={(e) => handleMenurChange(1)}>Saisir</button>
        </div>
        <div
          className={cn(
            "ml-1 px-4 ",
            selectMenu == 2 ? "bg-white" : "bg-gray-200 "
          )}
        >
          <button onClick={(e) => handleMenurChange(2)}>Configuration</button>
        </div>
        <div
          className={cn(
            "ml-1 px-4 ",
            selectMenu == 3 ? "bg-white" : "bg-gray-200 "
          )}
        >
          <button onClick={(e) => handleMenurChange(3)}>Resultat</button>
        </div>
      </div>
      {selectMenu == 1 && (
        <div>
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
                onClick={(e) =>
                  handleClassChange(
                    Number((e.target as HTMLSelectElement).value)
                  )
                }
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
                  onChange={(e) => handleSemesterChange(Number(e.target.value))}
                  onClick={(e) =>
                    handleSemesterChange(
                      Number((e.target as HTMLSelectElement).value)
                    )
                  }
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
                  onClick={(e) =>
                    setSelectedModule(
                      Number((e.target as HTMLSelectElement).value)
                    )
                  }
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
                    ?.modules.find((mod) => mod.id === selectedModule)
                    ?.students || []
                }
                moduleKey={selectedModule}
              />
            </div>
          )}
        </div>
      )}
      {selectMenu == 2 && (
        <div>
          <div className="md:flex">
            {/* Sélection du module */}
            {/* 
            <div className="mb-4 ml-2">
              <select
                title="Sélectionner un module"
                className="p-2 border rounded w-full"
                onChange={(e) => setSelectedModule(Number(e.target.value))}
                onClick={(e) =>
                  setSelectedModule(
                    Number((e.target as HTMLSelectElement).value)
                  )
                }
              >
                <option value="">-- Choisir --</option>
                {classes
                  .find((cls) => cls.id === cls.id)
                  ?.semestres.find((sem) => sem.id === sem.id)
                  ?.modules.map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      {mod.name}
                    </option>
                  ))}
              </select>
            </div> */}
            <div className="flex justify-between w-full">
              <table className=" mt-4 mr-2 border border-collapse min-h-full w-1/6">
                <thead className="bg-gray-300">
                  <th>Les Filieres</th>
                </thead>
                <tbody className="flex flex-col">
                  {classes.map((classe, key) => (
                    <td key={key} className="border p-2 cursor-pointer">
                      {classe.name}
                    </td>
                  ))}
                </tbody>
              </table>
              <table className=" mt-4 border border-collapse min-h-full w-5/6">
                <tr className="bg-gray-300">
                  <th>Les Filieres</th>
                  <th className=" max-w-4">Coefficient</th>
                </tr>
                {classes.map((classe, key) => (
                  <tr key={key}>
                    <td className="border p-2 cursor-pointer">{classe.name}</td>
                    <td className="border p-2 cursor-pointer  max-w-4">
                      <input
                        title="coefficient"
                        type="number "
                        className="w-5/6"
                      />
                    </td>
                  </tr>
                ))}
              </table>
            </div>
            <div></div>
          </div>

          {/* Affichage des étudiants et saisie des notes */}
          {
            // selectedModule && (
            //   <div>
            //     <h2 className="text-lg font-semibold mb-2">Saisie des Notes</h2>
            //     <StudentTable
            //       students={
            //         classes
            //           .find((cls) => cls.id === selectedClass)
            //           ?.semestres.find((sem) => sem.id === selectedSemester)
            //           ?.modules.find((mod) => mod.id === selectedModule)
            //           ?.students || []
            //       }
            //       moduleKey={selectedModule}
            //     />
            //   </div>
            // )
          }
        </div>
      )}
    </div>
  );
};
export default NoteRegistre;
