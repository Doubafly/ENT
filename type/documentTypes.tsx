export interface User {
  id: number;
  specialite: string;
  matricule: string;
  utilisateur: {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    mot_de_passe: string;
    email: string;
    sexe: string;
    telephone: string;
    adresse: string;
    profil: string;
    date_creation: Date;
  };
}

export interface Filiere {
  id_filiere: number;
  nom: string;
  niveau: string;
  filiere_module: {
    module: Module;
  }[];
  description?: string;
}

export interface Module {
  id_module: number;
  nom: string;
  description: string;
}

export interface ApiDocument {
  id: number;
  titre: string;
  description: string;
  chemin_fichier: string;
  type_fichier: string;
  taille_fichier: number;
  id_uploader: number;
  id_classe: number;
  utilisateur: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  } | null;
  filiere: string | null;
  module: string | null;
}

// Types utilitaires pour les formulaires
export type DocumentFormData = Omit<Document, "id" | "date_upload"> & {
  date_upload?: string;
  file?: File;
};
