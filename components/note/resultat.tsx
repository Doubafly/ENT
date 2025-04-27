import { useState } from "react";
import Imprimer from "../imprimerBulletin/Imprimer";
import Image from "next/image";
import {  FaPrint } from "react-icons/fa";
import { Key } from "lucide-react";

interface Student {
  notes: any;
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
  const [filterClasse, setfilterClasse] = useState<Classe >(classes[0]);
  const [ImprimeModal, setImprimeModal] = useState<boolean>(false);
  const[imprimeData, setImprimeData] = useState<Semestre[]>(classes[0].semestres);


  const [ShowModal, setShowModal] = useState<boolean>(false);
let resultat;

  const handleClassChange = (classId: number) => {
    setSelectedClass(classId);
    resultat = classes.filter((item)=> {
      return item.id == classId
    });
    console.log(resultat);
    setfilterClasse(resultat[0])
    
  };

  const handleSemesterChange = (semesterId: string) => {
    setSelectedSemester(semesterId);
  };
  


  function handleSelectSemestre(id: string) {
    resultat = filterClasse?.semestres.filter((item) => {
      return item.id == id;
    });
    setImprimeData([resultat[0]]);
    // console.log(resultat);
    // setfilterClasse(resultat[0])
  }

  return <div>

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

      </div>
    </div>

          {/* Tableau des classes */}
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3 text-left">Filere</th>
                <th className="p-3 text-left">Nombre de semestre</th>
                <th className="p-3 text-left">Nombre d'etudiant</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classe) => (
                <tr
                  key={classe.id}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="p-3">{classe.name}</td>
                  <td className="p-3">{classe.semestres.length}</td>
                  <td className="p-3">{classe.semestres[0].modules[0].students.length}</td>


                  {/* <td className="p-3">{classe}</td>
                  <td className="p-3">{classe.montant_annuel} FCFA</td>
                  <td className="p-3">{classe.effectif || 0}</td> */}
                  <td className="p-3 flex gap-2"> 
                    <button
                      onClick={() => {
                        handleClassChange(classe.id);
                        setShowModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition duration-200"
                      title="Voir les détails"
                    >
                     <Image
                        src="/icons/eye.png"
                        alt="Détails"
                        width={20}
                        height={20}
                      />
                    </button>
                    <button
                      // onClick={() => {
                      //   handleClassChange(classe.id);
                      //   setShowModal(true);
                      // }}
                      className="text-blue-500 hover:text-blue-700 transition duration-200"
                      title="IMPRIMER"
                    >
                     <FaPrint />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    

      {/* Modale de détails */}
      {ShowModal && selectedClass && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-5xl shadow-xl overflow-y-auto max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-500">
              Détails de la classe
            </h2>

            <div className="space-y-6">
              {/* Section Nom et Niveau */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={filterClasse?.name}
                  />
                </div>
              </div>

              {/* Section semestres */}
             <div>
                <button
                  // onClick={() => setShowTeachers(!showTeachers)}
                  className="flex items-center justify-between w-full bg-blue-100 p-3 rounded-lg hover:bg-blue-200 transition duration-200"
                >
                  <span className="text-lg font-semibold text-blue-500">
                    semestre ({filterClasse?.semestres?.length || 0})
                  </span>
                
                </button>

               
                  <div className="mt-4 space-y-4">
                    {filterClasse?.semestres?.length === 0 && (
                      <div className="text-gray-500 text-center py-4">
                        Aucun enseignant inscrit dans cette classe.
                      </div>
                    )}
                      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                      <thead className="bg-blue-500 text-white w-full">
                        <tr>
                          <th className="p-3 text-left">Semestre</th>
                          <th className="p-3 text-left">Nombre de module</th>
                          <th className="p-3 text-left">Actions</th>
                        </tr>
                      </thead> 
                      <tbody>
                          {(filterClasse?.semestres || []).map((semestre) => (
                          <tr key={semestre.id} className="border-b hover:bg-gray-50 transition duration-150 ">
                            <td className="p-3">{semestre.name}</td>
                            <td className="p-3">{semestre.modules.length}</td>
                            <td className="p-3 flex gap-2">
                            <button
                              onClick={() => {
                                handleSelectSemestre(semestre.id);
                                setImprimeModal(true);
                              }}
                              className="text-blue-500 hover:text-blue-700 transition duration-200"
                              title="IMPRIMER"
                            >
                              <FaPrint />
                            </button>
                            </td>
                          </tr>
                          ))}
                       </tbody>
                      </table>
                  </div>
              </div> 

              {/* Section Étudiants */}
              <div>
                {/* <button
                  onClick={() => setShowStudents(!showStudents)}
                  className="flex items-center justify-between w-full bg-blue-100 p-3 rounded-lg hover:bg-blue-200 transition duration-200"
                >
                  <span className="text-lg font-semibold text-blue-500">
                    Étudiants ({selectedClass.effectif || 0})
                  </span>
                  <span className="text-blue-500">
                    {showStudents ? "▲" : "▼"}
                  </span>
                </button> */}
{/* 
                {showStudents && (
                  <div className="mt-4 space-y-4">
                    {selectedClass.effectif === 0 && (
                      <div className="text-gray-500 text-center py-4">
                        Aucun étudiant inscrit dans cette classe.
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedClass.filtreEtudiant
                        ?.slice(0, selectedClass.effectif || 0)
                        .map((etudiant: User) => (
                          <ListCard
                            type="etudiant"
                            key={etudiant.id}
                            item={etudiant}
                            onDelete={() => {}}
                            onEdit={() => {}}
                            onSelect={() => {}}
                            onrecharge={() => {}}
                          />
                        ))}
                    </div>
                  </div>
                )} */}
              </div>

            </div>

          </div>
        </div>
      )}
        {/* Modale de détails */}
      {ImprimeModal && (
        <div  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={() => setImprimeModal(false)}>
          <div 
            className="bg-white p-6 rounded-lg w-full max-w-5xl shadow-xl overflow-y-auto max-h-screen"
            onClick={(e) => e.stopPropagation()}>
            <Imprimer
            students={imprimeData}
          />
          </div>
          
        </div>
      
      )}

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