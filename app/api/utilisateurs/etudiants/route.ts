import { UtilisateursType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prisma";

// GET : Récupérer tous les étudiants avec leurs informations liées
export async function GET() {
  try {
    const etudiants = await prisma.etudiants.findMany({
      include: {
        utilisateur: {
          select: {
            id_utilisateur: true,
            nom: true,
            prenom: true,
            email: true,
            sexe: true,
            telephone: true,
            adresse: true,
            profil: true,
            date_creation: true,
          },
        },
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
                sessions: {
                  select: {
                    annee_academique: true,
                  },
                },
              },
            },
          },
        }, // Notes avec détails du cours et du module
        paiements: true, // Paiements de l'étudiant
      },
    });

    if (!etudiants || etudiants.length === 0) {
      return NextResponse.json(
        { message: "Aucun étudiant trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Étudiants récupérés avec succès", etudiants },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la récupération des étudiants :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}

// POST : Créer un nouvel étudiant
export async function POST(request: NextRequest) {
  try {
    // Vérifier si le body est valide
    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { message: "Le corps de la requête est vide ou invalide" },
        { status: 400 }
      );
    }

    console.log("Données reçues :", body);

    const {
      nom,
      prenom,
      email,
      sexe,
      mot_de_passe,
      telephone,
      adresse,
      matricule,
      date_naissance,
      date_inscription,
      id_filiere,
    } = body;

    // Convertir id_filiere en entier
    const filiereId = parseInt(id_filiere, 10);
    if (isNaN(filiereId)) {
      return NextResponse.json(
        { message: "id_filiere doit être un nombre valide" },
        { status: 400 }
      );
    }

    // Validation des données
    if (
      !nom?.trim() ||
      !prenom?.trim() ||
      !email?.trim() ||
      !sexe?.trim() ||
      !mot_de_passe ||
      !telephone?.trim() ||
      !adresse?.trim() ||
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

    // Vérifier si l'email ou le matricule existent déjà
    const existingUser = await prisma.utilisateurs.findFirst({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    const existingMatricule = await prisma.etudiants.findFirst({
      where: { matricule },
    });
    if (existingMatricule) {
      return NextResponse.json(
        { message: "Un étudiant avec ce matricule existe déjà" },
        { status: 409 }
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
        profil: "/profils/default.jpg",
      },
    });

    // Création de l'étudiant
    const etudiant = await prisma.etudiants.create({
      data: {
        matricule,
        date_naissance: new Date(date_naissance),
        date_inscription: new Date(date_inscription),
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
