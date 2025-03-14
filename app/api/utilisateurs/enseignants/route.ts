import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prisma";
import { UtilisateursType } from "@prisma/client";

// Récupérer tous les enseignants avec leurs informations complètes
export async function GET() {
  try {
    const enseignants = await prisma.enseignants.findMany({
      include: {
        utilisateur: true, // Informations de l'utilisateur
        cours: {
          include: {
            filiere_module: {
              include: {
                module: true, // Informations du module
                filiere: true, // Informations de la filière
              },
            },
            sessions: true, // Informations de la session
            emplois_du_temps: true, // Emplois du temps associés au cours
          },
        }, // Cours enseignés avec détails
      },
    });

    return NextResponse.json(
      { message: "Enseignants récupérés avec succès", enseignants },
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

// Créer un nouvel enseignant
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

    // Création de l'enseignant
    const enseignant = await prisma.enseignants.create({
      data: {
        matricule,
        specialite,
        id_utilisateur: utilisateur.id_utilisateur,
      },
    });

    return NextResponse.json(
      { message: "Enseignant créé avec succès", enseignant },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la création de l'enseignant :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}