"use client";
import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import Reclamation from "./Reclamation";
import Saisi from "./Saisi";
import Resultat from "./resultat";
import { FiCalendar } from "react-icons/fi";

interface NoteRegistreProps {
  classes: any;
  onrecharge: () => void;
}

export default function NoteRegistre({ classes, onrecharge }: NoteRegistreProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedSession, setSelectedSession] = useState("");

  // Extraire toutes les sessions, supprimer les doublons
  const allSessions: string[] = Array.from(
    new Set(
      classes.flatMap((cls: any) =>
        Array.isArray(cls.sessions) ? cls.sessions : [cls.sessions]
      )
    )
  ) as string[];

  useEffect(() => {
    if (selectedSession === "" && allSessions.length > 0) {
      setSelectedSession(allSessions[allSessions.length - 1]);
    }
  }, [allSessions]);

  // Filtrer les classes par session sélectionnée
  const filteredClasses = selectedSession
    ? classes.filter((cls: any) =>
        Array.isArray(cls.sessions)
          ? cls.sessions.includes(selectedSession)
          : cls.sessions === selectedSession
      )
    : classes;

  return (
    <div className="container mx-auto px-4 py-6">
      <Box sx={{ padding: 2 }}>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Notes</h1>

        {/* Header avec Tabs et Sélection de session */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={tabIndex}
              onChange={(_, newIndex) => setTabIndex(newIndex)}
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#3b82f6', // bleu-500
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'medium',
                  '&.Mui-selected': {
                    color: '#3b82f6', // bleu-500
                  },
                },
              }}
            >
              <Tab label="Saisie des notes" />
              <Tab label="Résultats" />
              <Tab label="Réclamations" />
            </Tabs>
          </Box>

          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2 border border-gray-200">
            <FiCalendar className="text-blue-500" />
            <select
              title="Sélectionner une Année Académique"
              className="p-1 border-none focus:ring-2 focus:ring-blue-500 rounded-md"
              onChange={(e) => setSelectedSession(e.target.value)}
              value={selectedSession}
            >
              {allSessions.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contenu selon l'onglet actif */}
        <div className="mt-6">
          {tabIndex === 0 && <Saisi classes={filteredClasses} onrecharge={onrecharge} />}
          {tabIndex === 1 && <Resultat classes={filteredClasses} />}
          {tabIndex === 2 && <Reclamation classes={filteredClasses} onrecharge={onrecharge} />}
        </div>
      </Box>
    </div>
  );
}