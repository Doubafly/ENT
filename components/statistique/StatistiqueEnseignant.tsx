import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from "chart.js";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );  
import MiniSmallIconCard from "../card/MiniIconCard";
import "./statistique.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const StatistiqueEnseignant = () => {
  const [barData, setBarData] = useState<any>(null);
  const [doughnutData, setDoughnutData] = useState<any>(null);
  const [menuStat, setMenuStat] = useState([
    { link: "/icons/text-books.png", value: "0", nom: "Nombre Filiere" },
    { link: "/icons/friends.png", value: "0", nom: "Nombre etudiant" },
    { link: "/icons/teach.png", value: "0", nom: "Nombre Module" },
  ]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const sessionRes = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const sessionData = await sessionRes.json();
        const enseignant = sessionData.user?.enseignant;
  
        if (!enseignant) return;
  
        const coursRes = await fetch("/api/cours");
        const coursData = await coursRes.json();
        const cours = coursData.cours || [];
  
        const coursEnseignant = cours.filter(
          (c: any) => c.enseignant.id === enseignant.id
        );
  
        // === Cartes Statistiques ===
        const filieresSet = new Set(
          coursEnseignant.map((c: any) => c.filiere_module.filiere.nom)
        );
        const modulesSet = new Set(
          coursEnseignant.map((c: any) => c.filiere_module.module.nom)
        );
        const etudiantsSet = new Set(
          coursEnseignant.flatMap((c: any) =>
            c.filiere_module.filiere.etudiants?.map((e: any) => e.matricule) || []
          )
        );
  
        setMenuStat([
          {
            link: "/icons/text-books.png",
            value: filieresSet.size.toString(),
            nom: "Nombre Filiere",
          },
          {
            link: "/icons/friends.png",
            value: etudiantsSet.size.toString(),
            nom: "Nombre etudiant",
          },
          {
            link: "/icons/teach.png",
            value: modulesSet.size.toString(),
            nom: "Nombre Module",
          },
        ]);
  
        // === Line Chart: cours par filière ===
        const coursParFiliere: Record<string, number> = {};
        coursEnseignant.forEach((c: any) => {
          const nomFiliere = c.filiere_module.filiere.nom;
          coursParFiliere[nomFiliere] = (coursParFiliere[nomFiliere] || 0) + 1;
        });
  
        setBarData({
          labels: Object.keys(coursParFiliere),
          datasets: [
            {
              label: "Cours par Filière",
              data: Object.values(coursParFiliere),
              borderColor: "#42A5F5",
              backgroundColor: "rgba(66,165,245,0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        });
  
        // === Doughnut Chart: étudiants par filière ===
        const etudiantsParFiliere: Record<string, number> = {};
        coursEnseignant.forEach((c: any) => {
          const nomFiliere = c.filiere_module.filiere.nom;
          const nbEtudiants = c.filiere_module.filiere.etudiants?.length || 0;
          etudiantsParFiliere[nomFiliere] = (etudiantsParFiliere[nomFiliere] || 0) + nbEtudiants;
        });

        setDoughnutData({
          labels: Object.keys(etudiantsParFiliere),
          datasets: [
            {
              data: Object.values(etudiantsParFiliere),
              backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
              hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
            },
          ],
        });
      } catch (err) {
        console.error("Erreur Statistique Enseignant :", err);
      }
    }
  
    fetchStats();
  }, []);
  
  return (
    <div className="stat-admin">
      <h2 className="statistique-title">Statistiques Enseignant</h2>

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
          <h3>Cours par Filière</h3>
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

export default StatistiqueEnseignant;
