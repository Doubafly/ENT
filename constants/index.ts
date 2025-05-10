let AdminLinks: Array<{ image: string; path: string; title: string }> = [];

const fetchUser = async () => {
  try {
    const res = await fetch("/api/auth/session", {
      credentials: "include",
    });

    const data = await res.json();
    const user = data.user;

    const permissions = user.Permission[0];

    // Générer dynamiquement les liens AdminLinks en fonction des permissions
    AdminLinks = [
      permissions.admin && {
        image: "/icons/home.png",
        path: "/admin",
        title: "Acceuil",
      },
      permissions.classes && {
        image: "/icons/presentation.png",
        path: "/admin/classes",
        title: "Classes",
      },
      permissions.enseignants && {
        image: "/icons/friends.png",
        path: "/admin/enseignants",
        title: "Enseignants",
      },
      permissions.etudiants && {
        image: "/icons/graduation-cap.png",
        path: "/admin/etudiants",
        title: "Etudiant",
      },
      permissions.emplois_du_temps && {
        image: "/icons/ordre-du-jour.png",
        path: "/admin/emploisDuTemps",
        title: "Emplois Du Temps",
      },

      permissions.annonces && {
        image: "/icons/promotion.png",
        path: "/admin/annonces",
        title: "Annonces",
      },
      permissions.note && {
        image: "/icons/grades.png",
        path: "/admin/note",
        title: "Note",
      },
      {
        image: "/icons/email.png",
        path: "/admin/messages",
        title: "Messages",
      }, // Messages toujours affiché
      permissions.paiement && {
        image: "/icons/finance.svg",
        path: "/admin/paiement",
        title: "Finance",
      },
      {
        image: "/icons/documentation.png",
        path: "/admin/documents",
        title: "Documents",
      },
      {
        image: "/icons/assessment.png",
        path: "/admin/sujets",
        title: "Sujets",
      }, // Sujets toujours affiché
      {
        image: "/icons/user.png",
        path: "/admin/profil",
        title: "Profil",
      }, // Profil toujours affiché
      permissions.parametres && {
        image: "/icons/settings.png",
        path: "/admin/parametre",
        title: "parametre",
      },
      {
        image: "/icons/out.png",
        path: "/deconnexion",
        title: "Déconnexion",
      }, // Déconnexion toujours affiché
    ].filter(Boolean);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
  }
};

fetchUser();

export { AdminLinks };

export const EtudiantLinks = [
  {
    image: "/icons/home.png",
    path: "/etudiant",
    title: "Acceuil",
  },
  // {
  //   image: "/icons/presentation.png",
  //   path: "/etudiant/classe",
  //   title: "Classe",
  // },
  {
    image: "/icons/promotion.png",
    path: "/etudiant/annonces",
    title: "Annonces",
  },
  {
    image: "/icons/grades.png",
    path: "/etudiant/result",
    title: "Résulat",
  },
  // {
  //   image: "/icons/email.png",
  //   path: "/etudiant/messages",
  //   title: "Messages",
  // },
  {
    image: "/icons/grades.png",
    path: "/etudiant/note",
    title: "Note",
  },
  {
    image: "/icons/documentation.png",
    path: "/etudiant/documents",
    title: "Documents",
  },
  {
    image: "/icons/user.png",
    path: "/etudiant/profil",
    title: "Profil",
  },
  {
    image: "/icons/out.png",
    path: "/deconnexion",
    title: "Déconnexion",
  },
];

//TODO A Modifier selon le Besoin
export const ProfesseurLinks = [
  {
    image: "/icons/home.png",
    path: "/professeur",
    title: "Acceuil",
  },
  {
    image: "/icons/presentation.png",
    path: "/professeur/classe",
    title: "Classe",
  },
  {
    image: "/icons/graduation-cap.png",
    path: "/professeur/etudiant",
    title: "Etudiant",
  },
  {
    image: "/icons/promotion.png",
    path: "/professeur/annonces",
    title: "Annonces",
  },
  {
    image: "/icons/grades.png",
    path: "/professeur/note",
    title: "Note",
  },
  {
    image: "/icons/email.png",
    path: "/professeur/messages",
    title: "Messages",
  },
  {
    image: "/icons/assessment.png",
    path: "/professeur/sujets",
    title: "Sujets",
  },
  {
    image: "/icons/documentation.png",
    path: "/professeur/documents",
    title: "Documents",
  },

  {
    image: "/icons/user.png",
    path: "/professeur/profil",
    title: "Profil",
  },
  {
    image: "/icons/settings.png",
    path: "/professeur/parametre",
    title: "parametre",
  },
  {
    image: "/icons/out.png",
    path: "/deconnexion",
    title: "Déconnexion",
  },
];
