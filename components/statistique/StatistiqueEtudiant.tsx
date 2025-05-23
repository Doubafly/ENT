import React from "react";
import MiniSmallIconCard from "../card/MiniIconCard";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

interface StatistiqueEtudiantProps {
  stats: {
    link: string;
    value: string | number;
    nom: string;
  }[];
}

const StatistiqueEtudiant: React.FC<StatistiqueEtudiantProps> = ({ stats }) => {
  const chartData = {
    labels: stats.map(stat => stat.nom),
    datasets: [
      {
        label: "Statistiques",
        data: stats.map(stat => Number(stat.value)),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444"
        ],
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Statistiques Générales de l'Étudiant",
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Statistiques Étudiant</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, index) => (
          <MiniSmallIconCard
            key={index}
            photoName={stat.link}
            stats={stat.value}
            name={stat.nom}
          />
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default StatistiqueEtudiant;
