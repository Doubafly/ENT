"use client";
import { useEffect, useState } from "react";
import Saisi from "./Saisi";
import Resultat from "./resultat";
import { Tabs, Tab, Box } from "@mui/material";

interface NoteRegistreProps {
  classes: any;
}

export default function NoteRegistre({ classes }: NoteRegistreProps) {
  const [tabIndex, setTabIndex] = useState(0);

  const [selectedSession, setSelectedSession] = useState("");

  // Extraire toutes les sessions, supprimer les doublons
  const allSessions: string[] = Array.from(
    new Set(
      classes.flatMap((cls: any) =>
        Array.isArray(cls.sessions) ? cls.sessions : [cls.sessions]
      )
    )
  ) as string[];

  useEffect(() => {
    if (selectedSession=="" && allSessions.length > 0) {
      setSelectedSession(allSessions[allSessions.length - 1]);
    }
  }, [allSessions]);

  // Filtrer les classes par session sélectionnée
  const filteredClasses = selectedSession
    ? classes.filter((cls: any) =>
        Array.isArray(cls.sessions)
          ? cls.sessions.includes(selectedSession)
          : cls.sessions === selectedSession
      )
    : classes;
    

    // setSelectedSession(allSessions[0]);

  return  (
    <div>
      <Box sx={{ padding: 2 }}>
        <h1 className="text-2xl">Les Notes </h1>

        {/* Tabs */}
        <Box sx={{ display: "flex", marginLeft: "50px" }}>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
          >
            <Tab label="Saisi" />
            <Tab label="Resultat" />
          </Tabs>
        </Box>

        {/* Sélection session */}
        <div className="mb-4 ml-2 text-right">
          <label className="block font-medium mb-1">Année Académique</label>
          <select
            title="Sélectionner une Année Académique"
            className="p-2 border rounded w-1/12"
            onChange={(e) => setSelectedSession(e.target.value)}
            value={selectedSession}
          >
            <option value="m">-- Choisir --</option>
            {allSessions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>
        

        {/* Contenu selon l'onglet actif */}
        {tabIndex === 0 && <Saisi classes={filteredClasses} />}
        {tabIndex === 1 && <Resultat classes={filteredClasses} />}
      </Box>
    </div>
  );
}

// const NoteRegistre: React.FC<NoteEntryProps> = ({ classes }) => {
//   const [selectMenu, setSelectMenu] = useState(1);

//   const handleMenurChange = (num: number) => {
//     setSelectMenu(num);
//   };

//   return (
//     <div className="p-6 w-full">
//       <h1 className="text-2xl font-semibold m-0  bg-gray-100">
//         Gestion des Notes
//       </h1>
//       {/* partie menu */}
//       <div className="flex w-full  bg-gray-100">
//         <div
//           className={cn(
//             " px-4 ",
//             selectMenu == 1 ? "bg-white" : "bg-gray-200 "
//           )}
//         >
//           <button onClick={(e) => handleMenurChange(1)}>Saisir</button>
//         </div>
//         <div
//           className={cn(
//             "ml-1 px-4 ",
//             selectMenu == 2 ? "bg-white" : "bg-gray-200 "
//           )}
//         >
//           <button onClick={(e) => handleMenurChange(2)}>Configuration</button>
//         </div>
//         <div
//           className={cn(
//             "ml-1 px-4 ",
//             selectMenu == 3 ? "bg-white" : "bg-gray-200 "
//           )}
//         >
//           <button onClick={(e) => handleMenurChange(3)}>Resultat</button>
//         </div>
//       </div>
//     </div>
//   );
// };
