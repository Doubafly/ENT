import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prisma";

export async function GET() {
  try {
    const utilisateurs = await prisma.utilisateurs.findMany({
      where: {
        type: "Admin",
      },
    });

    return NextResponse.json(utilisateurs, { status: 200 });
  } catch (error: any) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
      permissions, // Ex: [1, 2, 3]
    } = await request.json();

    // Validation des données
    if (
      !nom?.trim() ||
      !prenom?.trim() ||
      !email?.trim() ||
      !sexe?.trim() ||
      !mot_de_passe ||
      !telephone?.trim() ||
      !adresse?.trim() ||
      !profil?.trim() ||
      !Array.isArray(permissions) ||
      permissions.length === 0 ||
      !permissions.every((p) => Number.isInteger(p))
    ) {
      return NextResponse.json(
        { message: "Veuillez remplir tous les champs correctement" },
        { status: 400 }
      );
    }

    // Hash du mot de passe
    const hashPass = await bcrypt.hash(mot_de_passe, 10);

    // Création de l'admin et des permissions en une seule requête
    const utilisateur = await prisma.admin.create({
      data: {
        utilisateur: {
          create: {
            nom,
            prenom,
            email,
            sexe,
            mot_de_passe: hashPass,
            telephone,
            adresse,
            profil,
            type: "Admin",
          },
        },
        permissions: {
          create: permissions.map((id_permission) => ({ id_permission })),
        },
      },
      include: {
        utilisateur: true,
        permissions: true,
      },
    });

    return NextResponse.json(
      { message: "Utilisateur et admin créés avec succès", utilisateur },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}
