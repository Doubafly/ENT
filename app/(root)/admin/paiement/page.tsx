"use client";

import { useState } from "react";
import Enseignant from "@/components/paiement/Enseignant";
import AbscenceProfList from "@/components/list/AbscenceProfList";
import GroupConfigProf from "@/components/list/GroupConfigProf";
import { Tabs, Tab, Box } from "@mui/material";
import Etudiant from "@/components/paiement/Etudiant";
import Depense from "@/components/paiement/Depense";

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
          <Tab label="Etudiants " />
          <Tab label="Enseignants" />
          <Tab label="Depences" />
        </Tabs>
      </Box>

      {/* Contenu selon l'onglet actif */}
      {tabIndex === 0 && <Etudiant></Etudiant>}
      {tabIndex === 1 && <Enseignant />}
      {tabIndex === 2 && <Depense />}
    </Box>
  );
}
