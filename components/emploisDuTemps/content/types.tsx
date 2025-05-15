export interface Emploi {
  id_emploi: number;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  salle: string;
  cours: {
    id_cours: number;
    filiere_module: {
      filiere: {
        nom: string;
        niveau: string;
      };
      module: {
        nom: string;
      };
    };
    enseignant: {
      id_enseignant: number;
      utilisateur: {
        nom: string;
        prenom: string;
      };
    };
  };
}