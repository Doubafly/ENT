import React from "react";

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
  id: string;
  name: string;
  modules: Module[];
}

interface ImprimerProps {
  students: Semestre[];
}

const Imprimer = ({ students }: ImprimerProps) => {
  type ModuleResult = {
    id: number;
    id_cours: number;
    codeUE: string;
    intituleUE: string;
    matiere: string;
    noteClasse: string;
    noteExamen: string;
    noteMatiere: string;
    creditEQUE: string;
    creditUE: string;
    moyenneUE: string;
    noteCoeff: string;
    resultat: string;
  };

  type GroupedStudent = {
    id: number;
    matricule: string;
    nom: string;
    modules: ModuleResult[];
  };

  // Helper function to safely get and format note values
  const getNoteValue = (note: any, key: 'note_class' | 'note_exam' | 'coefficient', defaultValue: any = 0) => {
    try {
      const value = note?.[0]?.[key];
      return value !== undefined ? value : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Calculate module results for a student
  const calculateModuleResults = (module: Module, student: Student): ModuleResult => {
    const noteClass = getNoteValue(student.notes, 'note_class');
    const noteExam = getNoteValue(student.notes, 'note_exam');
    const coefficient = getNoteValue(student.notes, 'coefficient', 1);
    
    const moyenne = (noteClass + noteExam) / 2;
    const noteCoeff = moyenne * coefficient;
    const resultat = moyenne >= 10 ? "Validée" : "Non Validée";

    return {
      id: module.id,
      id_cours: student?.id_cours || 0,
      codeUE: module.id.toString(),
      intituleUE: module.name,
      matiere: module.name,
      noteClasse: noteClass?.toFixed(2) || "N/A",
      noteExamen: noteExam?.toFixed(2) || "N/A",
      noteMatiere: moyenne.toFixed(2),
      creditEQUE: coefficient?.toString() || "N/A",
      creditUE: "4", // Valeur fixe ou à calculer
      moyenneUE: moyenne.toFixed(2),
      noteCoeff: noteCoeff.toFixed(2),
      resultat,
    };
  };

  // Group students by modules with error handling
  function groupStudentsByModules(semester: Semestre): GroupedStudent[] {
    const grouped: Record<number, GroupedStudent> = {};
    const studentsWithMissingNotes: string[] = [];

    semester.modules.forEach((module) => {
      module.students.forEach((student) => {
        if (!grouped[student.id]) {
          grouped[student.id] = {
            id: student.id,
            matricule: student.matricule,
            nom: student.name,
            modules: [],
          };
        }

        try {
          grouped[student.id].modules.push(calculateModuleResults(module, student));
        } catch (error) {
          studentsWithMissingNotes.push(student.name);
        }
      });
    });

    if (studentsWithMissingNotes.length > 0) {
      alert(`Les notes manquent pour les étudiants suivants: ${studentsWithMissingNotes.join(', ')}`);
    }

    return Object.values(grouped);
  }

  const matieres = students.flatMap((semestre) => groupStudentsByModules(semestre));

  // Calculate semester averages and totals
  const calculateSemesterStats = (modules: ModuleResult[]) => {
    const validCredits = modules.filter(m => m.resultat === "Validée").length * 4;
    const totalCoeffNotes = modules.reduce((sum, m) => sum + parseFloat(m.noteCoeff || '0'), 0);
    const average = totalCoeffNotes / modules.length;

    return {
      validCredits,
      totalCoeffNotes: totalCoeffNotes.toFixed(2),
      average: average.toFixed(2),
    };
  };

  return (
    <div>
      {matieres.map((matiere, index) => {
        const { validCredits, totalCoeffNotes, average } = calculateSemesterStats(matiere.modules);

        return (
          <div key={index} className="max-w-4xl mx-auto p-5 border border-gray-300 shadow-md my-8 font-sans">
            {/* En-tête */}
            <header className="text-center mb-5">
              <h1 className="text-lg font-bold">
                Institut Supérieur de Technologies Appliquées
                <br />
                (TechnoLAB - ISTA)
              </h1>
              <p className="text-sm">
                Formation continue et spécialisée, Expertise, fourniture et
                prestations en Nouvelles Technologies, Techniques Commerciales
              </p>
            </header>

            {/* Informations étudiant */}
            <div className="mb-5">
              <h2 className="text-base font-bold border-b border-black">
                NOM et PRENOM (S) : CLASSE
              </h2>
              <p className="font-bold">{matiere.nom}</p>
              <p>
                <strong>Licence 1</strong>
                <br />
                Licence - Sciences et Technologies
              </p>
              <p>
                <strong>Spécialité :</strong> Analyse Programmation
              </p>
              <p>
                <strong>Année académique:</strong> 2022/2023 - Semestre 2
              </p>
            </div>

            {/* Tableau des résultats */}
            <div className="overflow-x-auto mb-5">
              <table className="min-w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Code UE</th>
                    <th className="border border-gray-300 p-2">Intitulé des UE</th>
                    <th className="border border-gray-300 p-2">Matières</th>
                    <th className="border border-gray-300 p-2">Note Classe</th>
                    <th className="border border-gray-300 p-2">Note Examen</th>
                    <th className="border border-gray-300 p-2">Note Matière</th>
                    <th className="border border-gray-300 p-2">Crédit EQUE</th>
                    <th className="border border-gray-300 p-2">Crédit UE</th>
                    <th className="border border-gray-300 p-2">Moyenne UE</th>
                    <th className="border border-gray-300 p-2">Note Coeff</th>
                    <th className="border border-gray-300 p-2">
                      Résultat / Validation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {matiere.modules.map((mod, modIndex) => (
                    <tr key={`${mod.id}-${modIndex}`}>
                      <td className="border border-gray-300 p-2">{mod.codeUE}</td>
                      <td className="border border-gray-300 p-2">{mod.intituleUE}</td>
                      <td className="border border-gray-300 p-2">{mod.matiere}</td>
                      <td className="border border-gray-300 p-2">{mod.noteClasse}</td>
                      <td className="border border-gray-300 p-2">{mod.noteExamen}</td>
                      <td className="border border-gray-300 p-2">{mod.noteMatiere}</td>
                      <td className="border border-gray-300 p-2">{mod.creditEQUE}</td>
                      <td className="border border-gray-300 p-2">{mod.creditUE}</td>
                      <td className="border border-gray-300 p-2">{mod.moyenneUE}</td>
                      <td className="border border-gray-300 p-2">{mod.noteCoeff}</td>
                      <td className={`border border-gray-300 p-2 ${
                        mod.resultat === "Validée" ? "text-green-600" : "text-red-600"
                      } italic`}>
                        {mod.resultat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Résultats semestre */}
            <div className="mb-5">
              <p>
                <strong>Moyenne du Semstre 2:</strong> {average}
              </p>
              <p>
                <strong>Observations / Appréciations:</strong>
                <br />
                {parseFloat(average) >= 16 ? "Très Bien" : 
                 parseFloat(average) >= 14 ? "Bien" :
                 parseFloat(average) >= 12 ? "Assez Bien" : "Passable"}
              </p>

              <div className="flex justify-between mt-3">
                <div>
                  <p>
                    <strong>Total crédit valides</strong>
                    <br />
                    {validCredits}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Total Notes coefficientes</strong>
                    <br />
                    {totalCoeffNotes}
                  </p>
                </div>
              </div>

              <p className="text-xl font-bold text-center mt-3">{average} / 20</p>
            </div>

            {/* Résultats annuels */}
            <div className="mb-5">
              <p className="text-right">Réité à Banako, le 12 septembre 2023</p>
              <h3 className="text-base font-bold my-3">RESULTATS ANNUELS</h3>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Moyenne annuelle</th>
                    <th className="border border-gray-300 p-2">Total Crédits</th>
                    <th className="border border-gray-300 p-2">UE Non Validée (s)</th>
                    <th className="border border-gray-300 p-2">Observations / Résultat</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">{average}</td>
                    <td className="border border-gray-300 p-2">{validCredits}/60</td>
                    <td className="border border-gray-300 p-2">
                      {matiere.modules.filter(m => m.resultat === "Non Validée").length || '-'}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {parseFloat(average) >= 10 ? "Admis(e)" : "Non Admis(e)"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pied de page */}
            <footer className="text-xs">
              <p>
                <strong>Observations / Appréciations:</strong>
                <br />
                {parseFloat(average) >= 16 ? "Très Bien" : 
                 parseFloat(average) >= 14 ? "Bien" :
                 parseFloat(average) >= 12 ? "Assez Bien" : "Passable"}
              </p>

              <p className="mt-2">
                Plus Directeur académique/PO
                <br />
                Responsable du centre Annexe SOTURA
              </p>

              <ul className="list-disc pl-5 mt-2">
                <li>
                  <strong>Légende</strong>
                </li>
                <li>
                  <strong>Définition BAH</strong>
                </li>
              </ul>

              <p className="mt-4 text-[10px]">
                Autrichez l'obtention N° 1669498 MESSRS - Quarentines; N° 152898;
                N° 114589 - 244600 - N° 226401 - Système LMD - B.P.: E3123 - Iid:
                20 29.01 54 - État: 20 29.24 09 - Sur: www.technoisib-isia.net /
                Email: technoisib@mailjaw.com, Banako, MAU
              </p>
            </footer>
          </div>
        );
      })}
    </div>
  );
};

export default Imprimer;