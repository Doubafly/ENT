"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaCalendarTimes,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import EmploiDuTempsEtudiant from "../emploisDuTemps/EmploisEtudiant";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import "./statistique.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

interface StatistiqueEtudiantProps {
  stats: {
    link: string;
    value: string | number;
    nom: string;
  }[];
}

const StatistiqueEtudiant: React.FC<StatistiqueEtudiantProps> = ({ stats }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          let icon;
          let color;

          switch (stat.nom) {
            case "Nombre Module":
              icon = <FaBookOpen className="text-4xl text-white" />;
              color = "bg-blue-500";
              break;
            case "Nombre Abscence":
              icon = <FaCalendarTimes className="text-4xl text-white" />;
              color = "bg-red-500";
              break;
            case "Nbre Module Valider":
              icon = <FaCheckCircle className="text-4xl text-white" />;
              color = "bg-green-500";
              break;
            case "Nbre Module Non Valider":
              icon = <FaTimesCircle className="text-4xl text-white" />;
              color = "bg-yellow-500";
              break;
            default:
              icon = <FaBookOpen className="text-4xl text-white" />;
              color = "bg-gray-500";
          }

          return (
            <motion.div
              key={index}
              className={`rounded-xl p-5 text-center hover:shadow-lg transition-all shadow-md ${color} text-white`}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="mb-3 flex justify-center">{icon}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm mt-1">{stat.nom}</div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="bg-white p-6 rounded-xl shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <EmploiDuTempsEtudiant />
      </motion.div>
    </div>
  );
};

export default StatistiqueEtudiant;
