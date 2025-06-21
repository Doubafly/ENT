"use client";

import React from "react";
import AnnonceList from "@/components/annonces/Admin_AnnonceList";

import { useState } from "react";
import Box from "@mui/material/Box";
import { Tab, Tabs } from "@mui/material";
import Corbeille from "@/components/annonces/corbeuilleAnnoce";
export default function AnnoncesPage() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ padding: 2 }}>
      {/* Conteneur des onglets aligné à droite */}
      <Box sx={{ display: "flex", marginLeft: "50px" }}>
        <Tabs
          value={tabIndex}
          onChange={(_, newIndex) => setTabIndex(newIndex)}
        >
          <Tab label="Annonces " />
          <Tab label="Gestion" />
        </Tabs>
      </Box>

      {/* Contenu selon l'onglet actif */}
      {tabIndex === 0 && <AnnonceList />}
      {tabIndex === 1 && <Corbeille />}
    </Box>
  );
}
