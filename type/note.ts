export interface Session {
    annee_academique: string;
  }
  
  export interface Module {
    id_module: number;
    nom: string;
    description: string;
    code_module: string;
  }
  
  export interface FiliereModule {
    id_filiere_module: number;
    syllabus: string | null;
    id_filiere: number;
    id_module: number;
    volume_horaire: number;
    coefficient: number;
    module: Module;
  }
  
  export interface Cours {
    id_cours: number;
    id_filiere_module: number;
    id_professeur: number;
    id_sessions: number;
    semestre: string;
    sessions: Session;
    filiere_module: FiliereModule;
  }
  
  export interface Note {
    id_note: number;
    id_cours: number;
    statut_reclamation: string;
    statut_note:string;
    commentaire_etudiant: string;
    id_etudiant: number;
    note_class: number;
    note_exam: number;
    date_saisie: string;
    commentaire_enseignant: string;
    cours: Cours;
  }
  
  export interface Etudiant {
    id: number;
    nom: string;
    prenom: string;
    notes: Note[];
  }
  