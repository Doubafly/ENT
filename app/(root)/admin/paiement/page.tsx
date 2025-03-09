"use client";

import { useState } from "react";
import EnseignantList from "@/components/list/EnseignantList";
import AbscenceProfList from "@/components/list/AbscenceProfList";
import GroupConfigProf from "@/components/list/GroupConfigProf";
import { Tabs, Tab, Box } from "@mui/material";

export default function Paiement() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ padding: 2 }}>
      {/* Conteneur des onglets aligné à droite */}
      <Box sx={{ display: "flex", marginLeft: "50px" }}>
        <Tabs
          value={tabIndex}
          onChange={(_, newIndex) => setTabIndex(newIndex)}
        >
          <Tab label="Enseignants" />
          <Tab label="Etudiants" />
          <Tab label="Depences" />
        </Tabs>
      </Box>

      {/* Contenu selon l'onglet actif */}
      {tabIndex === 0 && <EnseignantList />}
      {tabIndex === 1 && <AbscenceProfList />}
      {tabIndex === 2 && <GroupConfigProf />}
    </Box>
  );
}
