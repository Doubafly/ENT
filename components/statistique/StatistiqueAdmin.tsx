import React, { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { motion } from "framer-motion";
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaUsers } from "react-icons/fa";
import "./statistique.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

interface StatistiqueAdminProps {
  menuStat: {
    link: string;
    value: number;
    nom: string;
  }[];
}

interface Cours {
  filiere_module: {
    filiere: {
      nom: string;
      etudiants?: any[];
    };
  };
  enseignant?: {
    id: string;
    utilisateur: {
      sexe: string;
    };
  };
}

const StatistiqueAdmin: React.FC<StatistiqueAdminProps> = ({ menuStat }) => {
  const [lineData, setLineData] = useState<any>(null);
  const [doughnutData, setDoughnutData] = useState<any>(null);

  useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch("/api/cours");
      const data = await response.json();
      const cours: Cours[] = data.cours;

      const enseignantsParFiliere: Record<string, Set<string>> = {};
const etudiantsParFiliere: Record<string, number> = {};

const etudiantsDejaComptes = new Set<string>();
const enseignantsDejaComptes = new Set<string>(); // 👈 nouveau

let nbEtudH = 0, nbEtudF = 0, nbEnsH = 0, nbEnsF = 0;

cours.forEach((coursItem) => {
  const nomFiliere = coursItem.filiere_module.filiere.nom;
  const enseignantId = coursItem.enseignant?.id;

  // ⬇️ Comptage des enseignants par filière
  if (enseignantId) {
    if (!enseignantsParFiliere[nomFiliere]) {
      enseignantsParFiliere[nomFiliere] = new Set();
    }
    enseignantsParFiliere[nomFiliere].add(enseignantId);

    // ⬇️ Comptage unique des enseignants par sexe
    if (!enseignantsDejaComptes.has(enseignantId)) {
      enseignantsDejaComptes.add(enseignantId);
      const sexeEns = coursItem.enseignant?.utilisateur?.sexe;
      if (sexeEns === "M") nbEnsH++;
      else if (sexeEns === "F") nbEnsF++;
    }
  }

  // ⬇️ Comptage unique des étudiants par sexe
  coursItem.filiere_module.filiere.etudiants?.forEach((etudiant) => {
    const idEtudiant = etudiant.id || etudiant.utilisateur?.id;
    if (!etudiantsDejaComptes.has(idEtudiant)) {
      etudiantsDejaComptes.add(idEtudiant);
      const sexe = etudiant.utilisateur?.sexe;
      if (sexe === "M") nbEtudH++;
      else if (sexe === "F") nbEtudF++;
    }
  });

  // ⬇️ Comptage des étudiants par filière
  const nbEtudiants = coursItem.filiere_module.filiere.etudiants?.length || 0;
  if (!etudiantsParFiliere[nomFiliere]) {
    etudiantsParFiliere[nomFiliere] = nbEtudiants;
  }
});


      const labels = Object.keys(enseignantsParFiliere);

      const barData = {
        labels,
        datasets: [
          {
            label: "Enseignants",
            data: labels.map((filiere) => enseignantsParFiliere[filiere]?.size || 0),
            borderColor: "#4F46E5",
            backgroundColor: "rgba(79, 70, 229, 0.2)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#4F46E5",
          },
          {
            label: "Étudiants",
            data: labels.map((filiere) => etudiantsParFiliere[filiere] || 0),
            borderColor: "#10B981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#10B981",
          },
        ],
      };

      const doughnutData = {
        labels: ["Étudiants Hommes", "Étudiants Femmes", "Enseignants Hommes", "Enseignants Femmes"],
        datasets: [
          {
            data: [nbEtudH, nbEtudF, nbEnsH, nbEnsF],
            backgroundColor: ["#3B82F6", "#F472B6", "#10B981", "#F59E0B"],
            hoverBackgroundColor: ["#60A5FA", "#FB7185", "#34D399", "#FBBF24"],
            borderWidth: 0,
          },
        ],
      };

      console.log({ nbEtudH, nbEtudF, nbEnsH, nbEnsF });

      setLineData(barData);
      setDoughnutData(doughnutData);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques admin :", error);
    }
  }

  fetchData();
}, []);


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Dashboard Admin</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {menuStat.map((stat, index) => (
          <motion.div
          key={index}
          className={`rounded-xl p-5 text-center hover:shadow-lg transition-all shadow-md ${stat.color || 'bg-gray-100'} text-white`}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <div className="mb-3 flex justify-center">
          {stat.icon}
        </div>

          <div className="text-3xl font-bold">{stat.value}</div>
          <div className="text-sm mt-1">{stat.nom}</div>
        </motion.div>

        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-md col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Répartition Enseignants & Étudiants</h3>
          {lineData && <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: true } } }} />}
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Répartition par Sexe</h3>
          {doughnutData && (
            <Doughnut
              data={doughnutData}
              options={{
                cutout: "65%",
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                  },
                  datalabels: {
                    color: "#000",
                    formatter: (value: number, context: any) => {
                      const total = context.chart.data.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      return `${percentage}%`;
                    },
                  },
                },
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StatistiqueAdmin;
