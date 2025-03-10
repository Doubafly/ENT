import { Box, MenuItem, Select } from "@mui/material";
import { useState } from "react";

export default function Enseignant() {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [selectedFormateur, setSelectedFormateur] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");

  const formateurs = ["Moussa CISSE", "Moussa BAGAYOKO", "KASONGUE"];
  const matieresOptions = ["JAVA", "C++", "PHP", "Statistique"];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Paiement Enseignant</h1>

      <div className="mt-6">
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
                Etudiant
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
                Filiere
              </MenuItem>
              {matieresOptions.map((matiere) => (
                <MenuItem key={matiere} value={matiere}>
                  {matiere}
                </MenuItem>
              ))}
            </Select>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Montant à payer"
              className="border p-2 mt-2"
            />
            <button
              //   onClick={handlePayment}
              className="bg-blue-500 text-white p-2 mt-4 rounded-sm"
            >
              Payer
            </button>
          </Box>
        </Box>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Historique des paiements</h2>
        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Montant</th>
              <th className="border p-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment, index) => (
              <tr key={index}>
                <td className="border p-2">{13 / 10 / 2024}</td>
                <td className="border p-2">{100000} FCFA</td>
                <td className="border p-2">{"Salaire"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
