import prisma from "@/app/api/prisma";
import { UtilisateursType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    const admin = await prisma.admin.findUnique({
      where: {
        id_utilisateur: id ? parseInt(id) : 0,
      },
      include: {
        utilisateur: {
          select: {
            nom: true,
            prenom: true,
            mot_de_passe: true,
            email: true,
            sexe: true,
            telephone: true,
            adresse: true,
            profil: true,
            date_creation: true,
            Permission: {
              select: {
                enseignants: true,
                etudiants: true,
                admin: true,
                classes: true,
                paiement: true,
                note: true,
                emplois_du_temps: true,
                parametres: true,
                annonces: true,
              },
            },
          },
        },
      },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Admin non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "recuperation avec id succes", admin },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la récupération de l'admin :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
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
      permissions,
    } = await req.json();

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
      permissions.length === 0
    ) {
      return NextResponse.json(
        { message: "Veuillez remplir tous les champs correctement" },
        { status: 400 }
      );
    }
    // Hash du mot de passe
    const hashPass = await bcrypt.hash(mot_de_passe, 10);

    const updatedUser = await prisma.utilisateurs.update({
      where: {
        id_utilisateur: id ? parseInt(id) : 0,
      },
      data: {
        nom,
        prenom,
        email,
        sexe,
        type: UtilisateursType.Admin,
        mot_de_passe: hashPass,
        telephone,
        adresse,
        profil,
      },
    });

    //modification des permissions
    const permission = await prisma.permission.update({
      where: {
        id_utilisateur: updatedUser.id_utilisateur,
      },
      data: {
        enseignants: permissions[0],
        etudiants: permissions[1],
        admin: permissions[2],
        classes: permissions[3],
        paiement: permissions[4],
        note: permissions[5],
        emplois_du_temps: permissions[6],
        parametres: permissions[7],
        annonces: permissions[8],
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

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  try {
    await prisma.utilisateurs.delete({
      where: {
        id_utilisateur: id ? parseInt(id) : 0,
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
