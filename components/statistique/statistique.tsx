import React, { useEffect, useState, useContext } from "react";
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
import { UserContext } from "@/changerUtilisateur/utilisateur";
import "./statistique.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Statistique = ({ menuStat }) => {
  const [chartData, setChartData] = useState(null); // Données pour les graphiques
  const [doughnutData, setDoughnutData] = useState(null); // Données pour le graphique circulaire
  const user = useContext(UserContext); // Récupérer les informations de l'utilisateur connecté

  useEffect(() => {
    async function fetchCoursData() {
      try {
        const response = await fetch("/api/cours");
        const coursData = await response.json();

        // Filtrer les cours en fonction du rôle de l'utilisateur
        const filteredCours = coursData.cours.filter((cours) => {
          if (user.userRole === "etudiant") {
            return cours.filiere_module.filiere.etudiants.some(
              (etudiant) => etudiant.id === user.id
            );
          } else if (user.userRole === "enseignant") {
            return cours.id_professeur === user.id;
          }
          return true; // Administrateur voit tout
        });

        // Transformation des données pour les graphiques
        const labels = filteredCours.map((cours) => `Cours ${cours.id_cours}`);
        const etudiantsData = filteredCours.map((cours) => cours.notes.length); // Nombre de notes par cours
        const enseignantsData = filteredCours.map((cours) => cours.id_professeur); // ID des professeurs
        const classesData = filteredCours.map((cours) => cours.id_filiere_module); // ID des filières/modules

        // Données pour le graphique en barres
        const barData = {
          labels,
          datasets: [
            {
              label: "Étudiants",
              data: etudiantsData,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Enseignants",
              data: enseignantsData,
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
            {
              label: "Classes",
              data: classesData,
              backgroundColor: "rgba(255, 159, 64, 0.2)",
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 1,
            },
          ],
        };

        // Données pour le graphique circulaire
        const doughnutData = {
          labels: ["Hommes", "Femmes"],
          datasets: [
            {
              data: [60, 40], // Exemple : répartition hommes/femmes
              backgroundColor: ["#36A2EB", "#FF6384"],
              hoverBackgroundColor: ["#36A2EB", "#FF6384"],
            },
          ],
        };

        setChartData(barData);
        setDoughnutData(doughnutData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données des cours :", error);
      }
    }

    fetchCoursData();
  }, [user]); // Recharger les données si l'utilisateur change

  return (
    <div className="statistique">
      <h2 className="statistique-title">Statistiques</h2>
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
        <div className="chart doughnut-chart">
          <h3>Répartition Étudiants</h3>
          {doughnutData && <Doughnut data={doughnutData} />}
        </div>
        <div className="chart bar-chart">
          <h3>Statistiques des Cours</h3>
          {chartData && <Bar data={chartData} />}
        </div>
      </div>
    </div>
  );
};

export default Statistique;