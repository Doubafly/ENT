// app/api/documents/[id]/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = parseInt(params.id);

    if (isNaN(documentId)) {
      return NextResponse.json(
        { message: "ID du document invalide" },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: {
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
          },
        },
        filiere: {
          select: {
            id: true,
            nom: true,
            code_filiere: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Document non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Succès", document }, { status: 200 });
  } catch (e) {
    console.error("Erreur lors de la récupération du document :", e);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = parseInt(params.id);

    if (isNaN(documentId)) {
      return NextResponse.json(
        { message: "ID du document invalide" },
        { status: 400 }
      );
    }

    const { titre, description, est_actif, id_classe } = await request.json();

    // Vérification de l'existence du document
    const documentExistant = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!documentExistant) {
      return NextResponse.json(
        { message: "Document non trouvé" },
        { status: 404 }
      );
    }

    // Vérification de l'unicité du titre si modification
    if (titre && titre !== documentExistant.titre) {
      const titreExistant = await prisma.document.findFirst({
        where: {
          titre,
          id_classe: id_classe || documentExistant.id_classe,
          NOT: { id: documentId },
        },
      });

      if (titreExistant) {
        return NextResponse.json(
          {
            message: "Un document avec ce titre existe déjà dans cette classe",
          },
          { status: 409 }
        );
      }
    }

    // Mise à jour du document
    const documentModifie = await prisma.document.update({
      where: { id: documentId },
      data: {
        titre: titre !== undefined ? titre : documentExistant.titre,
        description:
          description !== undefined
            ? description
            : documentExistant.description,
        est_actif:
          est_actif !== undefined ? est_actif : documentExistant.est_actif,
        id_classe:
          id_classe !== undefined
            ? parseInt(id_classe)
            : documentExistant.id_classe,
      },
    });

    return NextResponse.json(
      { message: "Document modifié avec succès", document: documentModifie },
      { status: 200 }
    );
  } catch (e) {
    console.error("Erreur lors de la modification du document :", e);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = parseInt(params.id);

    if (isNaN(documentId)) {
      return NextResponse.json(
        { message: "ID du document invalide" },
        { status: 400 }
      );
    }

    // Vérification de l'existence du document
    const documentExistant = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!documentExistant) {
      return NextResponse.json(
        { message: "Document non trouvé" },
        { status: 404 }
      );
    }

    // Suppression du document
    await prisma.document.delete({
      where: { id: documentId },
    });

    return NextResponse.json(
      { message: "Document supprimé avec succès" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Erreur lors de la suppression du document :", e);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
