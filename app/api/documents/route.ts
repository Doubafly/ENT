import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";
import { Document as PrismaDocument } from "@prisma/client";

// Types personnalisés pour nos réponses
type DocumentWithRelations = Omit<PrismaDocument, 'id_uploader' | 'id_classe'> & {
  uploader: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  filiere: {
    id: number;
    nom: string;
    code_filiere: string;
  };
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

type DocumentsResponse = ApiResponse<DocumentWithRelations[]>;
type DocumentResponse = ApiResponse<DocumentWithRelations>;

// Options de sélection communes
const documentSelectOptions = {
  id: true,
  titre: true,
  description: true,
  chemin_fichier: true,
  type_fichier: true,
  taille_fichier: true,
  date_upload: true,
  est_actif: true,
  uploader: {
    select: {
      id: true,
      nom: true,
      prenom: true,
      email: true,
    },
  },
  filiere: {
    select: {
      id: true,
      nom: true,
      code_filiere: true,
    },
  },
};

export async function GET(): Promise<NextResponse<DocumentsResponse>> {
  try {
    const documents = await prisma.document.findMany({
      select: documentSelectOptions,
      where: {
        est_actif: true,
      },
      orderBy: {
        date_upload: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Documents récupérés avec succès",
        data: documents as DocumentWithRelations[],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/documents error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
        error: "Échec de la récupération des documents",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<DocumentResponse>> {
  try {
    const requestData = await request.json();

    // Validation des données
    const requiredFields = ["titre", "chemin_fichier", "id_uploader", "id_classe"];
    const missingFields = requiredFields.filter((field) => !requestData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Données manquantes",
          error: `Champs requis: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Vérification de l'unicité
    const existingDocument = await prisma.document.findFirst({
      where: {
        titre: requestData.titre,
        id_classe: parseInt(requestData.id_classe),
      },
    });

    if (existingDocument) {
      return NextResponse.json(
        {
          success: false,
          message: "Conflit de données",
          error: "Un document avec ce titre existe déjà dans cette classe",
        },
        { status: 409 }
      );
    }

    // Création du document
    const newDocument = await prisma.document.create({
      data: {
        titre: requestData.titre,
        description: requestData.description || null,
        chemin_fichier: requestData.chemin_fichier,
        type_fichier: requestData.type_fichier || null,
        taille_fichier: requestData.taille_fichier
          ? parseInt(requestData.taille_fichier)
          : null,
        id_uploader: parseInt(requestData.id_uploader),
        id_classe: parseInt(requestData.id_classe),
      },
      select: documentSelectOptions,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document créé avec succès",
        data: newDocument as DocumentWithRelations,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/documents error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
        error: "Échec de la création du document",
      },
      { status: 500 }
    );
  }
}