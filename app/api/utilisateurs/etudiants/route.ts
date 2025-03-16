import { UtilisateursType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prisma";

// Récupérer tous les étudiants avec leurs notes et paiements
export async function GET() {
  try {
    const etudiants = await prisma.etudiants.findMany({
      include: {
        utilisateur: true, // Informations de l'utilisateur
        filiere: true, // Informations de la filière
        notes: {
          include: {
            cours: {
              include: {
                filiere_module: {
                  include: {
                    module: true, // Informations du module
                  },
                },
              },
            },
          },
        }, // Notes avec détails du cours et du module
        paiements: true, // Paiements de l'étudiant
      },
    });

    return NextResponse.json(
      { message: "Étudiants récupérés avec succès", etudiants },
      { status: 200 }
    );
  } catch (error: any) {
    console.error({
      message: "Erreur lors de la récupération des étudiants :",
      error,
    });
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}

// Créer un nouvel étudiant
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
      date_naissance,
      date_inscription,
      id_filiere,
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
      !date_naissance ||
      !date_inscription ||
      !id_filiere
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
        type: UtilisateursType.Etudiant,
        mot_de_passe: hashPass,
        telephone,
        adresse,
        profil,
      },
    });

    // Création de l'étudiant
    const etudiant = await prisma.etudiants.create({
      data: {
        matricule,
        date_naissance: new Date(date_naissance),
        date_inscription: new Date(),
        id_filiere,
        id_utilisateur: utilisateur.id_utilisateur,
      },
    });

    return NextResponse.json(
      { message: "Étudiant créé avec succès", etudiant },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la création de l'étudiant :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}
