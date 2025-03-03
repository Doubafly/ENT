import { useState } from "react";
export default function Semestre({ semestreData, setSemestre }) {
  const [selectedSemestre, setSelectedSemestre] = useState("");

  return (
    <div className="ml-4">
      {/* Liste des semestres */}
      <div className="w-11/12">
        <ul className="space-y-1">
          {Object.keys(semestreData).map((semestre) => (
            <li key={semestre}>
              <button
                onClick={() => setSelectedSemestre(semestre)}
                className={`w-full text-left px-4 py-2 rounded ${
                  selectedSemestre === semestre
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {semestre}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 pl-6">
        {selectedSemestre === "" ? (
          <span></span>
        ) : (
          setSemestre(selectedSemestre)
        )}
      </div>
    </div>
  );
}
