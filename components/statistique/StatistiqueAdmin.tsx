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
  Filler
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
  };
}

const iconMap: Record<string, JSX.Element> = {
  "Étudiants": <FaUserGraduate className="text-blue-500 text-3xl" />,
  "Enseignants": <FaChalkboardTeacher className="text-green-500 text-3xl" />,
  "Cours": <FaBook className="text-purple-500 text-3xl" />,
  "Utilisateurs": <FaUsers className="text-yellow-500 text-3xl" />,
};

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

        cours.forEach((coursItem) => {
          const nomFiliere = coursItem.filiere_module.filiere.nom;
          const enseignantId = coursItem.enseignant?.id;

          if (enseignantId) {
            if (!enseignantsParFiliere[nomFiliere]) {
              enseignantsParFiliere[nomFiliere] = new Set();
            }
            enseignantsParFiliere[nomFiliere].add(enseignantId);
          }
        });

        const lineData = {
          labels: Object.keys(enseignantsParFiliere),
          datasets: [
            {
              label: "Enseignants",
              data: Object.values(enseignantsParFiliere).map((set) => set.size),
              fill: true,
              borderColor: "#8A2BE2",
              backgroundColor: "rgba(138, 43, 226, 0.2)",
              tension: 0.4,
              pointBackgroundColor: "#fff",
              pointBorderColor: "#8A2BE2",
              pointRadius: 5,
            },
          ],
        };

        const etudiantsParFiliere: Record<string, number> = {};

        cours.forEach((coursItem) => {
          const filiere = coursItem.filiere_module.filiere.nom;
          const nbEtudiants = coursItem.filiere_module.filiere.etudiants?.length || 0;

          // Ne pas écraser si on a déjà compté cette filière
          if (!etudiantsParFiliere[filiere]) {
            etudiantsParFiliere[filiere] = nbEtudiants;
          }
        });


        const doughnutData = {
          labels: Object.keys(etudiantsParFiliere),
          datasets: [
            {
              data: Object.values(etudiantsParFiliere),
              backgroundColor: ["#3B82F6", "#F97316", "#FACC15"],
              hoverBackgroundColor: ["#60A5FA", "#FB923C", "#FDE047"],
              borderWidth: 0,
            },
          ],
        };

        setLineData(lineData);
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
            className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="mb-2 flex justify-center">
              {iconMap[stat.nom] || <FaUsers className="text-gray-400 text-3xl" />}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.nom}</div>
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
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Répartition Enseignants</h3>
          {lineData && <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Répartition Étudiants</h3>
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
