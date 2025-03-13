"use client";
import { useState } from "react";
import Saisi from "./Saisi";
import Configuration from "./configuration";
import Resultat from "./resultat";
import { Tabs, Tab, Box } from "@mui/material";

interface NoteRegistreProps {  
  classes: any;
}

export default function NoteRegistre({ classes }: NoteRegistreProps) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div>
      <Box sx={{ padding: 2 }}>
        <h1 className="text-2xl">Les Notes </h1>
        {/* Conteneur des onglets aligné à droite */}
        <Box sx={{ display: "flex", marginLeft: "50px" }}>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
          >
            <Tab label="Saisi" />
            <Tab label="Resultat" />
            <Tab label="Configuration " />
          </Tabs>
        </Box>

        {/* Contenu selon l'onglet actif */}
        {tabIndex === 0 && <Saisi classes={classes} />}
        {tabIndex === 1 && <Resultat />}
        {tabIndex === 2 && <Configuration classes={classes} />}
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
