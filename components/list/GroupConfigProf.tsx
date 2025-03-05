"use client";

import { useState } from "react";
import { Box, Button, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, List, ListItem, ListItemButton } from "@mui/material";

export default function GroupConfigProf() {
  const [selectedClass, setSelectedClass] = useState("GLDW");
  const [selectedFormateur, setSelectedFormateur] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [matieres, setMatieres] = useState([
    { id: 1, name: "JAVA", formateur: "Monsieur Konaté" },
    { id: 2, name: "C++", formateur: "Mosieur Niangado" },
    { id: 3, name: "PHP", formateur:" Monsieur Madibaba" },
  ]);

  const classes = ["GLDW", "MIAGE", "ISR", "MINES", "AP"];
  const formateurs = ["Moussa CISSE", "Moussa BAGAYOKO", "KASONGUE"];
  const matieresOptions = ["JAVA", "C++", "PHP", "Statistique"];

  const handleAdd = () => {
    if (selectedMatiere && selectedFormateur) {
      setMatieres([...matieres, { id: matieres.length + 1, name: selectedMatiere, formateur: selectedFormateur }]);
      setSelectedMatiere("");
      setSelectedFormateur("");
    }
  };

  const handleDelete = (id: number) => {
    setMatieres(matieres.filter((matiere) => matiere.id !== id));
  };

  return (
    <Box display="flex" gap={2} p={2}>
      {/* Liste des classes à gauche */}
      <Paper sx={{ width: "25%", height: "400px", overflow: "auto" }}>
        <Typography variant="h6" textAlign="center" p={1}>Nom de Classe</Typography>
        <List>
          {classes.map((classe) => (
            <ListItem key={classe}>
              <ListItemButton selected={selectedClass === classe} onClick={() => setSelectedClass(classe)}>
                {classe}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Section centrale avec filtres et table */}
      <Box flex={1}>
        {/* Filtres */}
        <Box display="flex" gap={2} mb={2}>
          <Select value={selectedFormateur} onChange={(e) => setSelectedFormateur(e.target.value)} displayEmpty>
            <MenuItem value="" disabled>Formateur</MenuItem>
            {formateurs.map((formateur) => (
              <MenuItem key={formateur} value={formateur}>{formateur}</MenuItem>
            ))}
          </Select>
          <Select value={selectedMatiere} onChange={(e) => setSelectedMatiere(e.target.value)} displayEmpty>
            <MenuItem value="" disabled>Matière</MenuItem>
            {matieresOptions.map((matiere) => (
              <MenuItem key={matiere} value={matiere}>{matiere}</MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={handleAdd}>Ajouter</Button>
        </Box>

        {/* Table des matières */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Matières de Formations</TableCell>
                <TableCell>Formateurs de Matières</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matieres.map((matiere) => (
                <TableRow key={matiere.id}>
                  <TableCell>{matiere.name}</TableCell>
                  <TableCell>{matiere.formateur}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(matiere.id)}>
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
