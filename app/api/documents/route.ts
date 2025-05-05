import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";

// Types de réponse API
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

// Type de réponse pour un ou plusieurs documents
type DocumentResponse = ApiResponse<any>;
type DocumentsResponse = ApiResponse<any[]>;

export async function GET(): Promise<NextResponse<DocumentsResponse>> {
  try {
    const documents = await prisma.document.findMany({
      where: { est_actif: true },
      orderBy: { date_upload: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Documents récupérés avec succès",
        data: documents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur GET /api/documents:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la récupération des documents",
        error: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<DocumentResponse>> {
  try {
    const body = await request.json();

    const requiredFields = [
      "titre",
      "chemin_fichier",
      "id_uploader",
      "id_classe",
    ];
    const missing = requiredFields.filter((field) => !body[field]);

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Champs requis manquants",
          error: `Champs manquants: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const newDocument = await prisma.document.create({
      data: {
        titre: body.titre,
        description: body.description || null,
        chemin_fichier: body.chemin_fichier,
        type_fichier: body.type_fichier || null,
        taille_fichier: body.taille_fichier
          ? parseInt(body.taille_fichier)
          : null,
        id_uploader: parseInt(body.id_uploader),
        id_classe: parseInt(body.id_classe),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document créé avec succès",
        data: newDocument,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur POST /api/documents:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la création du document",
        error: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
