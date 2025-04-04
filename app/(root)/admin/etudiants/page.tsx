"use client";

import { useState } from "react";
// import EtudiantList from "@/components/list/EnseignantList";
// import AbscenceProfList from "@/components/list/AbscenceProfList";
// import GroupConfigProf from "@/components/list/GroupConfigProf";
import EtudiantList from "@/components/list/EtudiantList";
import AbscenceEtudiantList from "@/components/list/AbscenceEtudiantList";
import GroupConfigProf from "@/components/list/GroupConfigProf";
import { Tabs, Tab, Box } from "@mui/material";

export default function Page() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ padding: 2 }}>
      {/* Conteneur des onglets aligné à droite */}
      <Box sx={{ display: "flex", marginLeft: "50px" }}>
        <Tabs
          value={tabIndex}
          onChange={(_, newIndex) => setTabIndex(newIndex)}
        >
          <Tab label="Etudiants" />
          <Tab label="Absences" />
          {/* <Tab label="Configuration Groupes" /> */}
        </Tabs>
      </Box>

      {/* Contenu selon l'onglet actif */}
      {tabIndex === 0 && <EtudiantList />}
      {tabIndex === 1 && <AbscenceEtudiantList />}
      {/* {tabIndex === 2 && <GroupConfigProf />} */}
    </Box>
  );
}
