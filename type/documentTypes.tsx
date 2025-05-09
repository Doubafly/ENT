export interface User {
  id: number;
  specialite?: string; // Optionnel pour les non-enseignants
  matricule: string;
  id_utilisateur: number;
  utilisateur: {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    email: string;
    sexe: 'M' | 'F';
    telephone?: string;
    adresse?: string;
    profil?: string;
    date_creation: Date;
    type: 'Etudiant' | 'Enseignant' | 'Admin';
  };
}

export interface Filiere {
  id_filiere: number;
  nom: string;
  description?: string;
  niveau: 'Primaire' | 'Secondaire' | 'Licence' | 'Master1' | 'Master2' | 'Doctorat';
  id_annexe?: number;
  filiere_module: FiliereModule[];
  annexe?: {
    id_annexe: number;
    nom: string;
    adresse?: string;
    ville?: string;
    region?: string;
  };
}

export interface FiliereModule {
  id_filiere_module: number;
  id_filiere: number;
  id_module: number;
  syllabus?: string;
  volume_horaire?: number;
  code_module: string;
  coefficient: number;
  filiere: Filiere;
  module: Module;
  documents: Document[];
}

export interface Module {
  id_module: number;
  nom: string;
  description?: string;
}

export interface Session {
  id_sessions: number;
  annee_academique: string;
}

export interface Document {
  id: number;
  titre: string;
  description?: string;
  chemin_fichier: string;
  type_fichier?: string;
  taille_fichier?: number;
  date_upload: Date;
  est_actif: boolean;
  id_uploader: number;
  id_classe: number;
  uploader: {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
  };
  classe: {
    id_filiere_module: number;
    filiere: {
      id_filiere: number;
      nom: string;
      annexe?: {
        id_annexe: number;
        nom: string;
      };
    };
    module: {
      id_module: number;
      nom: string;
    };
    cours?: {
      id_cours: number;
      sessions: {
        id_sessions: number;
        annee_academique: string;
      };
      enseignant?: {
        id: number;
        utilisateur: {
          id_utilisateur: number;
          nom: string;
          prenom: string;
        };
      };
    }[];
  };
}

// Type pour les documents dans l'interface utilisateur
export interface ApiDocument {
  id: number;
  titre: string;
  description?: string;
  chemin_fichier: string;
  type_fichier?: string;
  taille_fichier?: number;
  id_uploader: number;
  id_classe: number;
  utilisateur: {
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
  };
  filiere: string;
  module: string;
  session?: string;
  annexe?: string;
  enseignant?: string;
  date_upload: Date;
}

// Types utilitaires pour les formulaires
export interface DocumentFormData {
  titre: string;
  description?: string;
  id_uploader: number;
  id_filiere?: number;
  id_module?: number;
  id_classe?: number; // Allow id_classe to be undefined
  file?: File;
}