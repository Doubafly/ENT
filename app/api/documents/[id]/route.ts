import prisma from "@/lib/prisma"; // Assurez-vous que le chemin est correct
import { Document as PrismaDocument } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Types personnalisés
type DocumentWithRelations = Omit<
  PrismaDocument,
  "id_uploader" | "id_classe"
> & {
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

type DocumentResponse = ApiResponse<DocumentWithRelations>;
type BasicResponse = ApiResponse<null>;

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<DocumentResponse>> {
  try {
    const documentId = parseInt(params.id);

    if (isNaN(documentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Requête invalide",
          error: "L'ID du document doit être un nombre",
        },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: documentSelectOptions,
    });

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document introuvable",
          error: "Aucun document trouvé avec cet ID",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document récupéré avec succès",
        data: document as DocumentWithRelations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`GET /api/documents/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
        error: "Échec de la récupération du document",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<DocumentResponse>> {
  try {
    const documentId = parseInt(params.id);

    if (isNaN(documentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Requête invalide",
          error: "L'ID du document doit être un nombre",
        },
        { status: 400 }
      );
    }

    const requestData = await request.json();
    const { titre, description, est_actif, id_classe } = requestData;

    // Vérification de l'existence du document
    const existingDocument = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!existingDocument) {
      return NextResponse.json(
        {
          success: false,
          message: "Document introuvable",
          error: "Aucun document trouvé avec cet ID",
        },
        { status: 404 }
      );
    }

    // Validation de l'unicité du titre si modification
    if (titre && titre !== existingDocument.titre) {
      const sameTitleDocument = await prisma.document.findFirst({
        where: {
          titre,
          id_classe: id_classe || existingDocument.id_classe,
          NOT: { id: documentId },
        },
      });

      if (sameTitleDocument) {
        return NextResponse.json(
          {
            success: false,
            message: "Conflit de données",
            error: "Un document avec ce titre existe déjà dans cette classe",
          },
          { status: 409 }
        );
      }
    }

    // Mise à jour du document
    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        titre: titre ?? existingDocument.titre,
        description: description ?? existingDocument.description,
        est_actif: est_actif ?? existingDocument.est_actif,
        id_classe: id_classe ? parseInt(id_classe) : existingDocument.id_classe,
      },
      select: documentSelectOptions,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document mis à jour avec succès",
        data: updatedDocument as DocumentWithRelations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`PUT /api/documents/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
        error: "Échec de la mise à jour du document",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<BasicResponse>> {
  try {
    const documentId = parseInt(params.id);

    if (isNaN(documentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Requête invalide",
          error: "L'ID du document doit être un nombre",
        },
        { status: 400 }
      );
    }

    // Vérification de l'existence du document
    const existingDocument = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!existingDocument) {
      return NextResponse.json(
        {
          success: false,
          message: "Document introuvable",
          error: "Aucun document trouvé avec cet ID",
        },
        { status: 404 }
      );
    }

    // Suppression du document
    await prisma.document.delete({
      where: { id: documentId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document supprimé avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/documents/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
        error: "Échec de la suppression du document",
      },
      { status: 500 }
    );
  }
}
