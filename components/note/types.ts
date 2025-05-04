export interface User {
    id: number;
    nom: string;
    prenom: string;
    // ... autres propriétés
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
  
  export interface Enseignant {
    utilisateur?: any;
    id: number;
    nom: string;
    prenom: string;
    specialite: string;
  }
  
  export interface Cours {
    id_cours: number;
    semestre: "Semestre1" | "Semestre2";
    sessions: Session;
    enseignant: Enseignant;
  }
  
  export interface FiliereModule {
    id_filiere_module: number;
    id_module: number;
    module: Module;
    coefficient: number;
    volume_horaire?: number;
    code_module?: string;
    cours?: Cours[];
  }
  
  export interface Classe {
    id_filiere: number;
    nom: string;
    description: string | null;
    niveau: string;
    montant_annuel: number;
    id_annexe: number | null;
    annexe?: {
      id_annexe: number;
      nom: string;
      ville: string;
    };
    enseignants?: User[];
    effectif?: number;
    etudiants?: User[];
    filtreEtudiant?: User[];
    filiere_module?: FiliereModule[];
  }
  
  export interface FiliereData {
    filiere: {
      id: number;
      nom: string;
      niveau: string;
    };
    enseignants: Enseignant[];
    allModules: Module[];
    modules?: FiliereModule[];
    allsession: Session[];
  }
  
  export interface ModuleConfig {
    coefficient: number;
    volume_horaire: number;
    code_module: string;
  }
  
  export type ConfigStep = "selectModule" | "configureModule" | "createCours";