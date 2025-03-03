import { useState } from "react";
import Semesters from "./SemestreTableau";

export default function FiliereTable({ setFiliere, filieresData }) {
  const [selectedfiliere, setSelectedfiliere] = useState("");
  return (
    <div className="w-1/12 ml-4">
      <ul className="space-y-1">
        {filieresData.map((filiere) => (
          <li key={filiere}>
            <button
              onClick={() => setSelectedfiliere(filiere)}
              className={`w-full text-left px-4 py-2 rounded ${
                selectedfiliere === filiere
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {filiere}
            </button>
          </li>
        ))}
      </ul>
      {selectedfiliere === "" ? <span></span> : setFiliere(selectedfiliere)}
    </div>
  );
}
