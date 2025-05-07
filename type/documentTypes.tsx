export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  profil?: string;
}

export interface Filiere {
  id: number;
  nom: string;
  code_filiere: string;
  description?: string;
  est_actif: boolean;
}

export interface Module {
  id: number;
  nom: string;
  code_module: string;
  filiere_id: number;
  description?: string;
  est_actif: boolean;
}

export interface Document {
  id: number;
  titre: string;
  description?: string;
  chemin_fichier: string;
  type_fichier?: string;
  taille_fichier?: number;
  date_upload: string;
  est_actif: boolean;
  id_uploader: number;
  id_classe: number;
  filiere?: Filiere | null;
  module?: Module | null;
  uploader?: User | null;
}

// Types utilitaires pour les formulaires
export type DocumentFormData = Omit<Document, 'id' | 'date_upload'> & {
  date_upload?: string;
  file?: File;
};