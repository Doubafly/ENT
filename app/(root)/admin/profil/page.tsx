"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ProfilePage from "@/components/profil/Profil";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<{
    id_utilisateur: string;
    email: string;
    nom: string;
    prenom: string;
    type: "Etudiant" | "Enseignant" | "Admin";
    profil: string;
    isAdmin: boolean;
    adresse: string;
    sexe: string;
    password: string;
    telephone: string;
    date_creation: string;
    permissions: {
      admin: boolean|null;      
      annonces: boolean|null;
      classes: boolean|null;
      emplois_du_temps: boolean|null;
      enseignants: boolean|null;
      etudiants: boolean|null;
      note: boolean|null;      
      paiement: boolean|null;
      parametres: boolean|null;
    };
  }>({
    id_utilisateur: "",
    email: "",
    nom: "",
    prenom: "",
    type: "Etudiant",
    profil: "",
    isAdmin: false,
    adresse: "",
    sexe: "",
    password: "",
    telephone: "",
    date_creation: "",
    permissions: {
      admin: null,
      annonces: null,
      classes: null,
      emplois_du_temps: null,
      enseignants: null,
      etudiants: null,
      note: null,
      paiement: null,
      parametres: null,
    },
  });

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const userData = await response.json();
        

          setUser({
            id_utilisateur: userData.user.id_utilisateur,
            email: userData.user.email,
            nom: userData.user.nom,
            prenom: userData.user.prenom,
            type: userData.user.type,
            profil: userData.user.profil,
            isAdmin: userData.user.isAdmin,
            adresse: userData.user.adresse,
            sexe: userData.user.sexe,
            password: userData.user.mot_de_passe,
            telephone: userData.user.telephone,
            date_creation: userData.user.date_creation,
            permissions: {
              admin: userData.user.Permission[0].admin,
              annonces: userData.user.Permission[0].annonces,
              classes: userData.user.Permission[0].classes,
              emplois_du_temps: userData.user.Permission[0].emplois_du_temps,
              enseignants: userData.user.Permission[0].enseignants,
              etudiants: userData.user.Permission[0].etudiants,
              note: userData.user.Permission[0].note,
              paiement: userData.user.Permission[0].paiement,
              parametres: userData.user.Permission[0].parametres,
            },
          });
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
    <div className="mt-10 justify-center items-center">
      <ProfilePage user={user} />
    </div>
  );
}
