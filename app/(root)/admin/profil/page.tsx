"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ProfilePage from "@/components/profil/Profil";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<{
    id: string;
    email: string;
    nom: string;
    prenom: string;
    type: "Etudiant" | "Enseignant" | "Admin";
  }>({
    id: "",
    email: "",
    nom: "",
    prenom: "",
    type: "Etudiant",
  });

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          console.error("Failed to fetch user session");
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    };

    fetchUserSession();
  }, []);
  return (
    <div className="mt-7 justify-center items-center">
      <ProfilePage user={user} />
    </div>
  );
}
