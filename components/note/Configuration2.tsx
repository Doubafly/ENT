import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";

interface Student {
  id: number;
  name: string;
  note_class?: number;
  note_exam?: number;
}

interface Module {
  id: number;
  name: string;
  students: Student[];
}

interface Semestre {
  id: number;
  name: string;
  modules: Module[];
}

interface Classe {
  id: number;
  name: string;
  semestres: Semestre[];
}

interface NoteEntryProps {
  classes: Classe[];
}

const Configuration: React.FC<NoteEntryProps> = ({ classes }) => {
  const [selectedClass, setSelectedClass] = useState(1);
  const [selectedFormateur, setSelectedFormateur] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [matieres, setMatieres] = useState([
    { id: 1, name: "JAVA", formateur: "Monsieur Konaté" },
    { id: 2, name: "C++", formateur: "Mosieur Niangado" },
    { id: 3, name: "PHP", formateur: " Monsieur Madibaba" },
  ]);
  const formateurs = ["Moussa CISSE", "Moussa BAGAYOKO", "KASONGUE"];
  const matieresOptions = ["JAVA", "C++", "PHP", "Statistique"];

  const handleAdd = () => {
    if (selectedMatiere && selectedFormateur) {
      setMatieres([
        ...matieres,
        {
          id: matieres.length + 1,
          name: selectedMatiere,
          formateur: selectedFormateur,
        },
      ]);
      setSelectedMatiere("");
      setSelectedFormateur("");
    }
  };

  const handleDelete = (id: number) => {
    setMatieres(matieres.filter((matiere) => matiere.id !== id));
  };

  return (
    <Box flex={1}>
      {/* Filtres */}
      <Box display="flex" gap={2} mb={2}>
        <Select
          value={selectedFormateur}
          onChange={(e) => setSelectedFormateur(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Formateur
          </MenuItem>
          {formateurs.map((formateur) => (
            <MenuItem key={formateur} value={formateur}>
              {formateur}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={selectedMatiere}
          onChange={(e) => setSelectedMatiere(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Matière
          </MenuItem>
          {matieresOptions.map((matiere) => (
            <MenuItem key={matiere} value={matiere}>
              {matiere}
            </MenuItem>
          ))}
        </Select>
        <input
          className=" border rounded max-w-40"
          placeholder="Coefficient"
          type="number"
        />
        <Button variant="contained" onClick={handleAdd}>
          Ajouter
        </Button>
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
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(matiere.id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default Configuration;
