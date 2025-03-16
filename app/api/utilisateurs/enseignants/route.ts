import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prisma";
import { UtilisateursType } from "@prisma/client";
export async function GET() {
  try {
    const utilisateurs = await prisma.enseignants.findMany({
      select: {
        id: true,
        specialite: true,
        matricule: true,
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
          },
  
      },
    });

    return NextResponse.json(
      { message: "enseignant recuperer avec succes", utilisateurs },
      { status: 200 }
    );
  } catch (error: any) {
    console.error({
      message: "Erreur lors de la récupération des enseignants :",
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
      matricule,
      specialite,
      email,
      sexe,
      mot_de_passe,
      telephone,
      adresse,
      profil,
      matricule,
      specialite,
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
      !matricule?.trim() ||
      !specialite?.trim()
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
        type: UtilisateursType.Enseignant,
        mot_de_passe: hashPass,
        telephone,
        adresse,
        profil,
      },
    });

    // Création de l'admin et des permissions en une seule requête
    const enseignant = await prisma.enseignants.create({
      data: {
        matricule,
        specialite,
        id_utilisateur: utilisateur.id_utilisateur,
      },
    });

    return NextResponse.json(
      { message: "Utilisateur et enseignant créés avec succès", enseignant },
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
