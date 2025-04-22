import { useEffect, useState } from "react";

export default function AttendancePage() {
  const classes = [
    { id: "class1", name: "Informatique 1" },
    { id: "class2", name: "Génie Civil 2" },
  ];

  // Simule un emploi du temps par jour pour chaque classe
  const emploisDuTemps: Record<string, Record<string, { id: number; name: string }[]>> = {
    class1: {
      lundi: [
        { id: 1, name: "Ali Traoré" },
        { id: 2, name: "Fatou Diarra" },
      ],
      mardi: [
        { id: 2, name: "Fatou Diarra" },
      ],
    },
    class2: {
      lundi: [
        { id: 3, name: "Moussa Konaté" },
      ],
      mercredi: [
        { id: 4, name: "Awa Coulibaly" },
      ],
    },
  };

  const [selectedClass, setSelectedClass] = useState(classes[0].id);
  const [day, setDay] = useState(""); // Lundi, Mardi...
  const [teachersToday, setTeachersToday] = useState<{ id: number; name: string }[]>([]);
  const [absences, setAbsences] = useState<Record<number, boolean>>({});

  // Déterminer automatiquement le jour actuel
  useEffect(() => {
    const jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    const today = new Date();
    setDay(jours[today.getDay()]);
  }, []);

  // Met à jour la liste des enseignants selon le jour/classe sélectionné
  useEffect(() => {
    if (day && emploisDuTemps[selectedClass]?.[day as keyof typeof emploisDuTemps[string]]) {
      setTeachersToday(emploisDuTemps[selectedClass][day]);
    } else {
      setTeachersToday([]);
    }
    setAbsences({}); // reset
  }, [selectedClass, day]);

  const handleCheckboxChange = (teacherId: number) => {
    setAbsences((prev) => ({
      ...prev,
      [teacherId]: !prev[teacherId],
    }));
  };

  const handleSubmit = () => {
    const absents = Object.entries(absences)
      .filter(([_, isAbsent]) => isAbsent)
      .map(([id]) => Number(id));

    console.log("Absents enregistrés :", absents);
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-md space-y-6">

      <h1 className="text-2xl font-bold text-center">Liste d'Absence</h1>

      <div>
        <label className="font-medium">Sélectionner une classe :</label>
        <select
          className="block w-full mt-1 p-2 border rounded-md"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-green-600">Jour actuel : <strong>{day}</strong></p>
      </div>

      {teachersToday.length === 0 ? (
        <p className="text-center text-gray-500">Aucun enseignant ce jour-là pour cette classe.</p>
      ) : (
        <ul className="bg-white p-4 rounded-lg shadow-md">
          {teachersToday.map((teacher) => (
            <li
              key={teacher.id}
              className="flex items-center justify-between py-2 border-b"
            >
              <span className="font-medium">{teacher.name}</span>
              <input
                type="checkbox"
                checked={absences[teacher.id] || false}
                onChange={() => handleCheckboxChange(teacher.id)}
                className="w-5 h-5"
                title="Cocher si l'enseignant est absent"
              />
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleSubmit}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800"
      >
        Enregistrer les absents
      </button>
    </div>
  );
}
