import { useState } from "react";

export default function AttendancePage() {
  const classes = [
    { id: "class1", name: "Informatique 1" },
    { id: "class2", name: "Génie Civil 2" },
  ];

  const schedule = {
    class1: [
      { id: 1, name: "Ali Traoré" },
      { id: 2, name: "Fatou Diarra" },
    ],
    class2: [
      { id: 3, name: "Moussa Konaté" },
      { id: 4, name: "Awa Coulibaly" },
    ],
  };

  const [selectedClass, setSelectedClass] = useState(classes[0].id);
  const [attendance, setAttendance] = useState({});

  const handleCheckboxChange = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSubmit = () => {
    console.log("Présence enregistrée pour", selectedClass, attendance);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-100 rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center">Liste de Présence</h1>
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
      </div>
      <ul className="bg-white p-4 rounded-lg shadow-md">
        {schedule[selectedClass]?.map((student) => (
          <li
            key={student.id}
            className="flex items-center justify-between py-2 border-b"
          >
            <span className="font-medium">{student.name}</span>
            <input
              type="checkbox"
              checked={attendance[student.id] || false}
              onChange={() => handleCheckboxChange(student.id)}
              className="w-5 h-5"
            />
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800"
      >
        Enregistrer la Présence
      </button>
    </div>
  );
}
