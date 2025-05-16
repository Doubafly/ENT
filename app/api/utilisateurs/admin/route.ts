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
      password,
      telephone,
      adresse,
      permissions,
    } = await request.json();
    console.log(permissions);
    

    // Validation des données
    if (
      !nom?.trim() ||
      !prenom?.trim() ||
      !email?.trim() ||
      !sexe?.trim() ||
      !password ||
      !telephone?.trim() ||
      !adresse?.trim() 
    ) {
      return NextResponse.json(
        { message: "Veuillez remplir tous les champs correctement" },
        { status: 400 }
      );
    }

    // Hash du mot de passe
    const hashPass = await bcrypt.hash(password, 10);

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
        profil: "/profils/default.jpg",
      },
    });
    //creation des permissions
    const permission = await prisma.permission.create({
      data: {
        id_utilisateur: utilisateur.id_utilisateur,
        enseignants: permissions.enseignants,
        etudiants: permissions.etudiants,
        admin: permissions.admin,
        classes: permissions.classes,
        emplois_du_temps: permissions.emplois_du_temps,
        parametres: permissions.parametres,
        annonces: permissions.annonces,
        note: permissions.note,
        paiement: permissions.paiement,
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
