import prisma from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        id_admin: parseInt(params.id),
      },
      include: {
        utilisateur: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Admin non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(admin, { status: 200 });
  } catch (error: any) {
    console.error("Erreur lors de la récupération de l'admin :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      nom,
      prenom,
      email,
      sexe,
      mot_de_passe,
      telephone,
      adresse,
      profil,
    } = await req.json();

    const updatedUser = await prisma.utilisateurs.update({
      where: {
        id_utilisateur: parseInt(params.id),
      },
      data: {
        nom,
        prenom,
        email,
        sexe,
        mot_de_passe,
        telephone,
        adresse,
        profil,
        type: "Admin",
      },
    });

    return NextResponse.json(
      { message: "Utilisateur mis à jour avec succès", updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.utilisateurs.delete({
      where: {
        id_utilisateur: parseInt(params.id),
      },
    });

    return NextResponse.json(
      { message: "Utilisateur supprimé avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la suppression :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}
