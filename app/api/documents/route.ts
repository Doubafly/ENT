import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";

// Types de réponse API
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

type DocumentResponse = ApiResponse<any>;
type DocumentsResponse = ApiResponse<any[]>;

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      include: {
        uploader: {
          select: {
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
        classe: {
          include: {
            filiere_module: {
              include: {
                filiere: {
                  select: {
                    nom: true,
                  },
                },
                module: {
                  select: {
                    nom: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    
    const formatted = documents.map((doc) => ({
      id: doc.id,
      titre: doc.titre,
      description: doc.description,
      niveau: null, // Replace with the correct property if it exists in your schema
      utilisateur: {
        nom: doc.uploader.nom,
        prenom: doc.uploader.prenom,
        email: doc.uploader.email,
        telephone: doc.uploader.telephone,
      },
      filiere: doc.classe?.filiere_module?.filiere?.nom || null,
      module: doc.classe?.filiere_module?.module?.nom || null,
      annexe: null, // Replace with a valid property if needed
    }));
    

    return NextResponse.json({
      success: true,
      message: "Documents récupérés avec succès",
      data: formatted,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des documents :", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la récupération des documents",
        error: "Erreur interne",
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
