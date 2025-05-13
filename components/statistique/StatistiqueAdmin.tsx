import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import MiniSmallIconCard from "../card/MiniIconCard";
import "./statistique.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Type pour les props
interface StatistiqueAdminProps {
  menuStat: {
    link: string;
    value: number;
    nom: string;
  }[];
}

// Types partiels pour le cours
interface Cours {
  filiere_module: {
    filiere: {
      nom: string;
    };
  };
}

const StatistiqueAdmin: React.FC<StatistiqueAdminProps> = ({ menuStat }) => {
  const [barData, setBarData] = useState<any>(null);
  const [doughnutData, setDoughnutData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/cours");
        const data = await response.json();
        const cours: Cours[] = data.cours;

        // Répartition des enseignants par filière
const enseignantsParFiliere: Record<string, Set<string>> = {};

cours.forEach((coursItem) => {
  const nomFiliere = coursItem.filiere_module.filiere.nom;
  const enseignantId = coursItem.enseignant?.id; // supposé identifiant unique de l'enseignant

  if (enseignantId) {
    if (!enseignantsParFiliere[nomFiliere]) {
      enseignantsParFiliere[nomFiliere] = new Set();
    }
    enseignantsParFiliere[nomFiliere].add(enseignantId);
  }
});

const barData = {
  labels: Object.keys(enseignantsParFiliere),
  datasets: [
    {
      label: "Nombre d'Enseignants par Filière",
      data: Object.values(enseignantsParFiliere).map((set) => set.size),
      backgroundColor: "#7E57C2",
      borderColor: "#5E35B1",
      borderWidth: 1,
    },
  ],
};


        // Ajoute ceci dans le useEffect à la place de doughnutData actuel
const etudiantsParFiliere: Record<string, number> = {};

cours.forEach((coursItem) => {
  const filiere = coursItem.filiere_module.filiere.nom;
  coursItem.filiere_module.filiere.etudiants?.forEach(() => {
    etudiantsParFiliere[filiere] = (etudiantsParFiliere[filiere] || 0) + 1;
  });
});

const doughnutData = {
  labels: Object.keys(etudiantsParFiliere),
  datasets: [
    {
      data: Object.values(etudiantsParFiliere),
      backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
    },
  ],
};


        setBarData(barData);
        setDoughnutData(doughnutData);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques admin :", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="stat-admin">
      <h2 className="statistique-title">Statistiques Générales (Admin)</h2>

      <div className="gridStat">
        {menuStat.map((stat, index) => (
          <MiniSmallIconCard
            key={index}
            photoName={stat.link}
            stats={stat.value}
            name={stat.nom}
          />
        ))}
      </div>

      <div className="charts-container">
        <div className="chart bar-chart">
          <h3>Répartition Enseignants</h3>
          {barData && <Bar data={barData} />}
        </div>

        <div className="chart doughnut-chart">
          <h3>Répartition Étudiants</h3>
          {doughnutData && <Doughnut data={doughnutData} />}
        </div>
      </div>
    </div>
  );
};

export default StatistiqueAdmin;
