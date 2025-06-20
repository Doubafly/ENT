import { useState } from "react";
import Image from "next/image";
import { FaPrint, FaExclamationTriangle } from "react-icons/fa";

interface Student {
  name: string;
  notes: any;
  id: number;
  matricule: string; // Nouveau champ pour les réclamations
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

const Reclamation: React.FC<NoteEntryProps> = ({ classes ,onrecharge}) => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [teacherComment, setTeacherComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

console.log(classes);

  // Fonction pour compter le nombre total de réclamations dans une classe
  const countReclamations = (classe: Classe): number => {
    let count = 0;
    
    classe.semestres.forEach(semestre => {
      semestre.modules.forEach(module => {
        module.students.forEach(student => {
          
          if (student?.notes[0]?.statut_reclamation=="EnAttente") count++;
        });
      });
    });
    return count;
  };

    // Fonction pour compter le nombre total de réclamations dans une classe
    const countNote = (classe: Classe): number => {
        let count = 0;
        classe.semestres.forEach(semestre => {
          semestre.modules.forEach(module => {
            module.students.forEach(student => {
                count= count+student.notes.length;
            });
          });
        });
        return count;
      };
  // Fonction pour compter le nombre total d'étudiants dans une classe
  const countStudents = (classe: Classe): number => {
    return classe.semestres[0]?.modules[0]?.students.length || 0;
  };

  // Fonction pour afficher les détails des réclamations d'une classe
  const showClassDetails = (classId: number) => {
    setSelectedClass(classId);
    setShowDetails(true);
  };

    // Fonction pour traiter la réclamation
    const handleProcessReclamation = async(status: "Acceptee" | "Rejetee") => {
        if (!selectedStudent) return;
        
        setIsSubmitting(true);
        
        // Ici vous devrez implémenter l'appel API pour sauvegarder les changements
          const payload = {
            statut_reclamation: status,
            statut_note:"Valide",
            note_class: selectedStudent.notes[0].note_class,
            note_exam: selectedStudent.notes[0].note_exam,
            commentaire_enseignant: teacherComment,
          };
          if (selectedStudent.notes[0].id_note) {
            const res = await fetch(`/api/reclamation/correction/${selectedStudent.notes[0].id_note}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });
      
            if (!res.ok) {
              const error = await res.json();
              throw new Error(`Erreur update pour : ${error.message}`);
            }
          }

        
        // Simulation de requête asynchrone
        setTimeout(() => {
          setIsSubmitting(false);
          setSelectedStudent(null);
          onrecharge();
        }, 1000);
      };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 flex items-center">
        <FaExclamationTriangle className="mr-2" />
        Gestion des Réclamations
      </h1>

      {/* Tableau des classes avec statistiques de réclamations */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Étudiants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Réclamations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taux
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((classe) => {
              const reclamations = countReclamations(classe);
              const students = countStudents(classe);
              const notes = countNote(classe);
              const taux = students > 0 ? ((reclamations / notes) * 100).toFixed(1) : 0;
              
              return (
                <tr key={classe.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {classe.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${reclamations > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {reclamations}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {taux}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => showClassDetails(classe.id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de détails des réclamations */}
      {showDetails && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">
                  Détails des réclamations - {classes.find(c => c.id === selectedClass)?.name}
                </h2>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {classes.find(c => c.id === selectedClass)?.semestres.map(semestre => (
                  <div key={semestre.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 font-medium">
                      {semestre.name}
                    </div>
                    <div className="divide-y">
                      {semestre.modules.map(module => {
                        const moduleReclamations = module.students.filter(s => s?.notes[0]?.statut_reclamation=="EnAttente").length;
                        
                        return (
                          <div key={module.id} className="p-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">{module.name}</h3>
                              <span className={`text-sm px-2 py-1 rounded-full 
                                ${moduleReclamations > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {moduleReclamations} réclamation(s)
                              </span>
                            </div>

                            {moduleReclamations > 0 && (
                              <div className="mt-3 bg-red-50 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-red-800 mb-2">
                                  Étudiants avec réclamations:
                                </h4>
                                <ul className="space-y-2">
                                  {module.students
                                    .filter(student => student?.notes[0]?.statut_reclamation=="EnAttente")
                                    .map(student => (
                                      <li key={student.id} className="flex justify-between items-center p-2 bg-white rounded">
                                        <span>
                                          {student.name}
                                        </span>
                                        <button 
                                            onClick={() => setSelectedStudent(student)}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                            Voir la réclamation
                                        </button>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

       {/* Modal pour voir et traiter une réclamation spécifique */}
       {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">
                  Réclamation de {selectedStudent.name}
                </h2>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Note de classe
                    </label>
                    <div className="mt-1 p-2 bg-gray-100 rounded">
                      {selectedStudent.notes[0].note_class}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Note d'examen
                    </label>
                    <div className="mt-1 p-2 bg-gray-100 rounded">
                      {selectedStudent.notes[0].note_exam}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Commentaire de l'étudiant
                  </label>
                  <div className="mt-1 p-2 bg-gray-100 rounded min-h-[80px]">
                    {selectedStudent.notes[0].commentaire_etudiant}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Votre commentaire (enseignant)
                  </label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows={3}
                    value={teacherComment}
                    onChange={(e) => setTeacherComment(e.target.value)}
                    placeholder="Entrez votre réponse à la réclamation..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => handleProcessReclamation("Rejetee")}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
                  >
                    {isSubmitting ? "Traitement..." : "Rejeter la réclamation"}
                  </button>
                  <button
                    onClick={() => handleProcessReclamation("Acceptee")}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
                  >
                    {isSubmitting ? "Traitement..." : "Accepter la réclamation"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reclamation;