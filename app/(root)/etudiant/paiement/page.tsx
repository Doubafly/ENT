"use client";

import { useState } from "react";
import EtudiantPaiement from "@/components/paiement/EtudiantPaiement";
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
          <Tab label="PAiemnt " />
        
        </Tabs>
      </Box>

      {/* Contenu selon l'onglet actif */}
      {tabIndex === 0 && <EtudiantPaiement />}
     
    </Box>
  );
}
