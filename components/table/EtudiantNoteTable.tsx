import { useState, useEffect } from "react";

export default function EtudiantNoteTable({ semesterName, data }) {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : {};
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleNoteChange = (index, type, value) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [index]: {
        ...prevNotes[index],
        [type]: value,
      },
    }));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{semesterName}</h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Prénom
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Nom
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left w-1/6">
                Note Classe
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left w-1/6">
                Note Compo
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {row.Prenom}
                </td>
                <td className="border border-gray-300 px-4 py-2">{row.Nom}</td>
                <td className="border border-gray-300 px-4 py-2 w-1/6">
                  <input
                    title="NClasse"
                    type="number"
                    value={row.NoteClasse ? row.NoteClasse : ""}
                    onChange={(e) =>
                      handleNoteChange(index, "NClasse", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 w-1/6">
                  <input
                    title="NCompo"
                    type="number"
                    value={notes[index]?.NCompo || ""}
                    onChange={(e) =>
                      handleNoteChange(index, "NCompo", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
