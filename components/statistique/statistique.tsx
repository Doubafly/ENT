import React, { useContext } from "react";
import "./statistique.css";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { ArcElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MiniSmallIconCard from "../card/MiniIconCard";
import { UserContext } from "@/changerUtilisateur/utilisateur";
import EmploieStudent from "../EmploieStudent";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Étudiants",
      data: [400, 300, 200, 278, 189, 239, 349],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
    {
      label: "Enseignants",
      data: [240, 139, 980, 390, 480, 380, 430],
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      borderColor: "rgba(153, 102, 255, 1)",
      borderWidth: 1,
    },
    {
      label: "Classes",
      data: [240, 221, 229, 200, 218, 250, 300],
      backgroundColor: "rgba(255, 159, 64, 0.2)",
      borderColor: "rgba(255, 159, 64, 1)",
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Statistiques de l'école",
    },
  },
};

const Statistique = ({ menuStat }) => {
  const user = useContext(UserContext);

  const data2 = {
    labels: ["Hommes", "Femmes"],
    datasets: [
      {
        data: [60, 40], // Remplacez par vos données dynamiques
        backgroundColor: ["#A4D8F0", "#F7DD72"],
        hoverBackgroundColor: ["#82C4E6", "#F5C144"],
      },
    ],
  };
  return (
    <div className="statistique">
      <h2>Statistiques</h2>
      <div className="gridStat">
        {menuStat.map((stat) => (
          <MiniSmallIconCard
            photoName={stat.link}
            stats={stat.value}
            name={stat.nom}
          />
        ))}
      </div>
      {user.userRole === "etudiant" ? (
        <EmploieStudent />
      ) : (
        <div className="flex md:flex-row flex-col">
          <div className="bg-white rounded-2xl shadow-md p-4 md:w-1/4 flex flex-col items-center md:mr-2 md:mb-0 mb-2">
            <h2 className="text-lg font-bold mb-2">Students</h2>
            <Doughnut data={data} />
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 md:w-3/4 ml-2">
            <Bar data={data} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistique;
