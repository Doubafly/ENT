"use client";
import React, { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
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
import { Bar, Doughnut } from "react-chartjs-2";
import EmploiDuTempsEnseignant from "../emploisDuTemps/EmploiProf";
import "./statistique.css";

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

const StatistiqueEnseignant = () => {
  const [barData, setBarData] = useState<any>(null);
  const [doughnutData, setDoughnutData] = useState<any>(null);
  const [menuStat, setMenuStat] = useState<any[]>([]);
  const [enseignantId, setEnseignantId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
 // Récupération des données depuis localStorage
                const userDataString = localStorage.getItem("user");
                if (!userDataString) {
                    throw new Error("Aucune donnée utilisateur trouvée");
                }

                const userData = JSON.parse(userDataString);
                const enseignant = userData?.user?.enseignant || userData?.enseignant;
                console.log("Données utilisateur :", userData);
                console.log("Données enseignant :", enseignant);
                if (!enseignant) {
                    console.error("Aucune donnée enseignant trouvée");
                    return;
                }
        const coursRes = await fetch("/api/cours");
        const coursData = await coursRes.json();
        const cours = coursData.cours || [];

        const coursEnseignant = cours.filter(
          (c: any) => c.enseignant.id === enseignant.id
        );

        // === Statistiques ===
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
        const absencesEnseignant = coursEnseignant.reduce(
          (acc: number, c: any) => acc + (c.absences?.length || 0),
          0
        );

        setMenuStat([
          {
            icon: <FaBookOpen className="text-4xl text-white" />,
            value: filieresSet.size.toString(),
            nom: "Nombre Filière",
            color: "bg-blue-500",
          },
          {
            icon: <FaUserGraduate className="text-4xl text-white" />,
            value: etudiantsSet.size.toString(),
            nom: "Nombre Étudiant",
            color: "bg-green-500",
          },
          {
            icon: <FaChalkboardTeacher className="text-4xl text-white" />,
            value: modulesSet.size.toString(),
            nom: "Nombre Module",
            color: "bg-purple-500",
          },
          {
            icon: <FaCalendarTimes className="text-4xl text-white" />,
            value: absencesEnseignant.toString(),
            nom: "Mes Absences",
            color: "bg-red-500",
          },
        ]);

        // === Graphiques ===
        const coursParFiliere: Record<string, number> = {};
        const etudiantsParFiliere: Record<string, number> = {};

        coursEnseignant.forEach((c: any) => {
          const filiere = c.filiere_module.filiere.nom;
          coursParFiliere[filiere] = (coursParFiliere[filiere] || 0) + 1;

          const nbEtud = c.filiere_module.filiere.etudiants?.length || 0;
          etudiantsParFiliere[filiere] = (etudiantsParFiliere[filiere] || 0) + nbEtud;
        });

        setBarData({
          labels: Object.keys(coursParFiliere),
          datasets: [
            {
              label: "Cours par Filière",
              data: Object.values(coursParFiliere),
              borderColor: "#4F46E5",
              backgroundColor: "rgba(79, 70, 229, 0.2)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#4F46E5",
            },
          ],
        });

        setDoughnutData({
          labels: Object.keys(etudiantsParFiliere),
          datasets: [
            {
              data: Object.values(etudiantsParFiliere),
              backgroundColor: [
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#6366F1",
                "#14B8A6",
              ],
              hoverBackgroundColor: [
                "#60A5FA",
                "#34D399",
                "#FBBF24",
                "#F87171",
                "#818CF8",
                "#2DD4BF",
              ],
              borderWidth: 0,
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
  <div className="p-6 bg-gray-50 min-h-screen">
    {/* <h2 className="text-3xl font-semibold mb-6 text-gray-800">Dashboard Enseignant</h2> */}

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
        {/* Utilise une icône selon le nom ou une par défaut */}
        {stat.icon ?? <FaBookOpen className="text-4xl text-white" />}
      </div>
      <div className="text-3xl font-bold">{stat.value}</div>
      <div className="text-sm mt-1">{stat.nom}</div>
    </motion.div>
  ))}
</div>

    {/* Conteneur stylé pour Emploi du temps */}
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <EmploiDuTempsEnseignant />
    </motion.div>
  </div>
);

};

export default StatistiqueEnseignant;
