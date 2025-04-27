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
  students: Semestre[]; // Correspond au type passé depuis Resultat
}


const Imprimer = (students:ImprimerProps) => {
  // Données des matières (à remplir avec toutes les données du tableau)
  const matieres = [
    {
      codeUE: "TEC12101",
      intituleUE: "Techniques quantitatives",
      matiere: "Analyse -2",
      noteClasse: "14.00",
      noteExamen: "19.00",
      noteMatiere: "17.33",
      creditEQUE: "2",
      creditUE: "4",
      moyenneUE: "16,00",
      noteCoeff: "64,00",
      resultat: "Validée",
    },
    {
      codeUE: "TEC12101",
      intituleUE: "Techniques quantitatives",
      matiere: "Analyse -2",
      noteClasse: "14.00",
      noteExamen: "19.00",
      noteMatiere: "17.33",
      creditEQUE: "2",
      creditUE: "4",
      moyenneUE: "16,00",
      noteCoeff: "64,00",
      resultat: "Validée",
    },
    // Ajouter toutes les autres matières ici...
  ];
  const matiere = students.students.flatMap((semestre) =>
    semestre.modules.flatMap((module) =>
      module.students.map((student) => ({
        codeUE: module.id.toString(), // ID du module comme codeUE
        intituleUE: module.name, // Nom du module
        matiere: module.name, // Nom de l'étudiant
        noteClasse: student.notes[0].note_class?.toFixed(2) || "N/A", // Note de classe
        noteExamen: student.notes[0].note_exam?.toFixed(2) || "N/A", // Note d'examen
        noteMatiere: (
          ((student.notes[0].note_class|| 0) + (student.notes[0].note_exam|| 0)) /
          2
        ).toFixed(2), // Moyenne des notes
        creditEQUE: student.notes[0].coefficient?.toString() || "N/A", // Coefficient
        creditUE: "4", // Exemple : valeur fixe ou calculée
        moyenneUE: (
          ((student.notes[0].note_class|| 0) + (student.notes[0].note_exam|| 0)) /
          2
        ).toFixed(2), // Moyenne UE
        noteCoeff: (
          ((student.notes[0].note_class|| 0) + (student.notes[0].note_exam|| 0)) *
          (student.notes[0].coefficient|| 1)
        ).toFixed(2), // Note coefficientée
        resultat: ((student.notes[0].note_class|| 0) + (student.notes[0].note_exam|| 0)) / 2 >=
          10
          ? "Validée"
          : "Non Validée", // Résultat basé sur la moyenne
      }))
    )
  );

  console.log(matiere);

  return (
    <div className="max-w-4xl mx-auto p-5 border border-gray-300 shadow-md my-8 font-sans">
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
        <p className="font-bold">MAMADOU BA</p>
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
            {matieres.map((matiere, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{matiere.codeUE}</td>
                <td className="border border-gray-300 p-2">
                  {matiere.intituleUE}
                </td>
                <td className="border border-gray-300 p-2">
                  {matiere.matiere}
                </td>
                <td className="border border-gray-300 p-2">
                  {matiere.noteClasse}
                </td>
                <td className="border border-gray-300 p-2">
                  {matiere.noteExamen}
                </td>
                <td className="border border-gray-300 p-2">
                  {matiere.noteMatiere}
                </td>
                <td className="border border-gray-300 p-2">
                  {matiere.creditEQUE}
                </td>
                <td className="border border-gray-300 p-2">
                  {matiere.creditUE}
                </td>
                <td className="border border-gray-300 p-2">
                  {matiere.moyenneUE}
                </td>
                <td className="border border-gray-300 p-2">
                  {matiere.noteCoeff}
                </td>
                <td className="border border-gray-300 p-2 text-green-600 italic">
                  {matiere.resultat}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Résultats semestre */}
      <div className="mb-5">
        <p>
          <strong>Moyenne du Semstre 2:</strong>
        </p>
        <p>
          <strong>Observations / Appréciations:</strong>
          <br />
          Tres Bien
        </p>

        <div className="flex justify-between mt-3">
          <div>
            <p>
              <strong>Total crédit valides</strong>
              <br />
              30
            </p>
          </div>
          <div>
            <p>
              <strong>Total Notes coefficientes</strong>
              <br />
              30130
            </p>
          </div>
        </div>

        <p className="text-xl font-bold text-center mt-3">17,02 / 20</p>
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
              <th className="border border-gray-300 p-2">
                Observations / Résultat
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">16,42</td>
              <td className="border border-gray-300 p-2">60/60</td>
              <td className="border border-gray-300 p-2">-</td>
              <td className="border border-gray-300 p-2">Admis(e)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pied de page */}
      <footer className="text-xs">
        <p>
          <strong>Observations / Appréciations:</strong>
          <br />
          Tres Bien
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
          Autrichez l'obtention N° 1669498 MESSRS - Quarentines; N° 152898; N°
          114589 - 244600 - N° 226401 - Système LMD - B.P.: E3123 - Iid: 20
          29.01 54 - État: 20 29.24 09 - Sur: www.technoisib-isia.net / Email:
          technoisib@mailjaw.com, Banako, MAU
        </p>
      </footer>
    </div>
  );
};

export default Imprimer;
