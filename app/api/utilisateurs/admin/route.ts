import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prisma";
import { UtilisateursType } from "@prisma/client";

export async function GET() {
  try {
    const utilisateurs = await prisma.admin.findMany({
      select: {
        id_admin: true,
        utilisateur: {
          select: {
            id_utilisateur: true,
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

    return NextResponse.json(
      { message: "utilissateur recuperer avec succes", utilisateurs },
      { status: 200 }
    );
  } catch (error: any) {
    console.error({
      message: "Erreur lors de la récupération des utilisateurs :",
      error,
    });
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
      permissions.length === 0
    ) {
      return NextResponse.json(
        { message: "Veuillez remplir tous les champs correctement" },
        { status: 400 }
      );
    }

    // Hash du mot de passe
    const hashPass = await bcrypt.hash(mot_de_passe, 10);

    // Création de l'utilisateur
    const utilisateur = await prisma.utilisateurs.create({
      data: {
        nom,
        prenom,
        email,
        sexe,
        type: UtilisateursType.Admin,
        mot_de_passe: hashPass,
        telephone,
        adresse,
        profil: "/profils/default2.jpg", // Provide a default or appropriate value for 'profil'
      },
    });
    //creation des permissions
    const permission = await prisma.permission.create({
      data: {
        id_utilisateur: utilisateur.id_utilisateur,
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
    // Création de l'admin et des permissions en une seule requête
    const admin = await prisma.admin.create({
      data: {
        id_utilisateur: utilisateur.id_utilisateur,
      },
    });

    return NextResponse.json(
      { message: "Utilisateur et admin créés avec succès", admin },
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
