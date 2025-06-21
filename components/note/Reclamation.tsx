import Modal from "@/components/modal/ModalBox";
import { useState } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiEdit,
  FiEye,
  FiX,
  FiXCircle,
} from "react-icons/fi";

interface Student {
  name: string;
  notes: any;
  id: number;
  matricule: string;
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

const Reclamation: React.FC<NoteEntryProps> = ({ classes, onrecharge }) => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [teacherComment, setTeacherComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    status: "success" | "error" | "info";
  } | null>(null);

  // Fonction pour compter le nombre total de réclamations dans une classe
  const countReclamations = (classe: Classe): number => {
    let count = 0;
    classe.semestres.forEach((semestre) => {
      semestre.modules.forEach((module) => {
        module.students.forEach((student) => {
          if (student?.notes[0]?.statut_reclamation === "EnAttente") count++;
        });
      });
    });
    return count;
  };

  // Fonction pour compter le nombre total de notes dans une classe
  const countNote = (classe: Classe): number => {
    let count = 0;
    classe.semestres.forEach((semestre) => {
      semestre.modules.forEach((module) => {
        module.students.forEach((student) => {
          count = count + student.notes.length;
        });
      });
    });
    return count;
  };

  // Fonction pour compter le nombre total d'étudiants dans une classe
  const countStudents = (classe: Classe): number => {
    return classe.semestres[0]?.modules[0]?.students.length || 0;
  };

  // Fonction pour traiter la réclamation
  const handleProcessReclamation = async (status: "Acceptee" | "Rejetee") => {
    if (!selectedStudent) return;

    setIsSubmitting(true);

    try {
      const payload = {
        statut_reclamation: status,
        statut_note: "Valide",
        note_class: selectedStudent.notes[0].note_class,
        note_exam: selectedStudent.notes[0].note_exam,
        commentaire_enseignant: teacherComment,
      };

      if (selectedStudent.notes[0].id_note) {
        const res = await fetch(
          `/api/reclamation/correction/${selectedStudent.notes[0].id_note}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          throw new Error("Erreur lors du traitement de la réclamation");
        }
      }

      setNotification({
        message:
          status === "Acceptee"
            ? "Réclamation acceptée avec succès"
            : "Réclamation rejetée avec succès",
        status: "success",
      });
    } catch (error) {
      setNotification({
        message: "Une erreur est survenue lors du traitement",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
      setSelectedStudent(null);
      setTeacherComment("");
      onrecharge();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiAlertTriangle className="text-yellow-500 mr-2" />
            Gestion des Réclamations
          </h1>

          {/* Tableau des classes avec statistiques de réclamations */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Étudiants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Réclamations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Taux
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classes.map((classe) => {
                  const reclamations = countReclamations(classe);
                  const students = countStudents(classe);
                  const notes = countNote(classe);
                  const taux =
                    students > 0
                      ? ((reclamations / notes) * 100).toFixed(1)
                      : 0;

                  return (
                    <tr key={classe.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {classe.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {students}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            reclamations > 0
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {reclamations}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {taux}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedClass(classe.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                        >
                          <FiEye className="mr-1" /> Détails
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de détails des réclamations */}
      {selectedClass !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-auto max-h-[90vh]">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  <FiAlertTriangle className="inline mr-2 text-yellow-500" />
                  Réclamations -{" "}
                  {classes.find((c) => c.id === selectedClass)?.name}
                </h2>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4 mt-6">
                {classes
                  .find((c) => c.id === selectedClass)
                  ?.semestres.map((semestre) => (
                    <div
                      key={semestre.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-100 px-4 py-3 font-medium flex justify-between items-center">
                        <span>{semestre.name}</span>
                      </div>
                      <div className="divide-y">
                        {semestre.modules.map((module) => {
                          const moduleReclamations = module.students.filter(
                            (s) =>
                              s?.notes[0]?.statut_reclamation === "EnAttente"
                          ).length;

                          return (
                            <div key={module.id} className="p-4">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium">{module.name}</h3>
                                <span
                                  className={`text-sm px-2 py-1 rounded-full 
                                ${
                                  moduleReclamations > 0
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                                >
                                  {moduleReclamations} réclamation(s)
                                </span>
                              </div>

                              {moduleReclamations > 0 && (
                                <div className="mt-3 bg-red-50 rounded-lg p-3">
                                  <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                                    <FiAlertTriangle className="mr-1" />
                                    Étudiants avec réclamations:
                                  </h4>
                                  <ul className="space-y-2">
                                    {module.students
                                      .filter(
                                        (student) =>
                                          student?.notes[0]
                                            ?.statut_reclamation === "EnAttente"
                                      )
                                      .map((student) => (
                                        <li
                                          key={student.id}
                                          className="flex justify-between items-center p-2 bg-white rounded border border-gray-200"
                                        >
                                          <span className="font-medium">
                                            {student.name}
                                          </span>
                                          <button
                                            onClick={() =>
                                              setSelectedStudent(student)
                                            }
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                          >
                                            <FiEye className="mr-1" /> Voir
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
            </div>
          </div>
        </div>
      )}

      {/* Modal pour voir et traiter une réclamation spécifique */}
      {selectedStudent !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  <FiAlertTriangle className="inline mr-2 text-yellow-500" />
                  Traiter la réclamation
                </h2>
                <button
                  onClick={() => {
                    setSelectedStudent(null);
                    setTeacherComment("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800">
                    {selectedStudent?.name}
                  </h3>
                  <p className="text-sm text-blue-600">
                    Matricule: {selectedStudent?.matricule}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note de classe
                    </label>
                    <div className="p-2 bg-gray-100 rounded text-gray-800">
                      {selectedStudent?.notes[0].note_class}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note d'examen
                    </label>
                    <div className="p-2 bg-gray-100 rounded text-gray-800">
                      {selectedStudent?.notes[0].note_exam}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commentaire de l'étudiant
                  </label>
                  <div className="p-3 bg-gray-100 rounded text-gray-800 min-h-[80px]">
                    {selectedStudent?.notes[0].commentaire_etudiant ||
                      "Aucun commentaire"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiEdit className="mr-1" />
                    Votre réponse
                  </label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={teacherComment}
                    onChange={(e) => setTeacherComment(e.target.value)}
                    placeholder="Entrez votre réponse à la réclamation..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => handleProcessReclamation("Rejetee")}
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
                  >
                    <FiXCircle className="mr-1" />
                    {isSubmitting ? "En cours..." : "Rejeter"}
                  </button>
                  <button
                    onClick={() => handleProcessReclamation("Acceptee")}
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400"
                  >
                    <FiCheck className="mr-1" />
                    {isSubmitting ? "En cours..." : "Accepter"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notification && (
        <Modal message={notification.message} status={notification.status} />
      )}
    </div>
  );
};

export default Reclamation;
