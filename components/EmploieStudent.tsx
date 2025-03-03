"use client";
import { Checkbox } from "@mui/material";
import { useState } from "react";

const schedule = [
  [
    "Algèbre",
    "Physique ",
    "Programmation",
    "Chimie ",
    "Biologie ",
    "Philosophie ",
  ],
  [
    "Géométrie",
    "Mécanique",
    "Base de Données",
    "Chimie ",
    "Écologie",
    "Philosophie",
  ],
  [
    "Statistiques",
    "Électromagnétisme",
    "Développement Web",
    "Thermodynamique",
    "Génétique",
    "Logique",
  ],
];

const EmploieStudent = () => {
  // const [checkedModules, setCheckedModules] = useState(modules);

  // const toggleModule = (index: number) => {
  //   const newModules = [...checkedModules];
  //   newModules[index].completed = !newModules[index].completed;
  //   setCheckedModules(newModules);
  // };

  return (
    <div className="flex ">
      {/* Sidebar Modules
      <div className="bg-white p-4 rounded-lg shadow-md border-[1px] border-gray-300">
        <h2 className="text-lg font-bold mb-4">Module</h2>
        {checkedModules.map((module, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b"
          >
            <span>{module.name}</span>
            <Checkbox
              checked={module.completed}
              onChange={() => toggleModule(index)}
              color="primary"
            />
          </div>
        ))}
      </div> */}
      {/* Schedule Table */}
      <div className="bg-white p-0 md:p-1 rounded-lg shadow-md border-[1px] border-gray-300 w-full">
        <h2 className="md:text-lg font-bold mb-4 text-center">Emploi</h2>
        <table className="w-full border-collapse border border-gray-300 text-center md:text-base text-sm emploie">
          <thead>
            <tr className="bg-gray-200">
              {["LUN", "MAR", "MER", "JEU", "VEN", "SAM"].map((day) => (
                <th key={day} className="border border-gray-300 md:py-2">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((subject, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-300 p-1 text-gray-700"
                  >
                    {subject}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmploieStudent;
