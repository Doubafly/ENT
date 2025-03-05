import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";

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
    <Box display="flex" gap={2} p={2}>
      {/* Liste des classes à gauche */}
      <Paper sx={{ width: "25%", height: "400px", overflow: "auto" }}>
        <Typography variant="h6" textAlign="center" p={1}>
          Nom de Classe
        </Typography>
        <List>
          {classes.map((classe) => (
            <ListItem key={classe.id}>
              <ListItemButton
                selected={selectedClass === classe.id}
                onClick={() => setSelectedClass(classe.id)}
              >
                {classe.name}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Section centrale avec filtres et table */}
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
    </Box>

    // <div className="flex justify-between w-full">
    //   <table className=" mt-4 mr-2 border border-collapse min-h-full w-1/6">
    //     <tr className="bg-gray-300">
    //       <th>Les Filieres</th>
    //     </tr>
    //     {classes.map((classe, key) => (
    //       <tr key={key}>
    //         <td className="border p-2 cursor-pointer">{classe.name}</td>
    //       </tr>
    //     ))}
    //   </table>
    //   <table className=" mt-4 border border-collapse min-h-full w-5/6">
    //     <tr className="bg-gray-300">
    //       <th>Les Filieres</th>
    //       <th className=" max-w-4">Coefficient</th>
    //     </tr>
    //     {classes.map((classe, key) => (
    //       <tr key={key}>
    //         <td className="border p-2 cursor-pointer">{classe.name}</td>
    //         <td className="border p-2 cursor-pointer  max-w-4">
    //           <input title="coefficient" type="number " className="w-5/6" />
    //         </td>
    //       </tr>
    //     ))}
    //   </table>
    // </div>
  );
};
export default Configuration;
