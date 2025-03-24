import prisma from "@/app/api/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// GET : Récupérer un ou plusieurs étudiants
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const etudiants = await prisma.etudiants.findMany({
      where: {
        id_utilisateur: id ? parseInt(id) : undefined, // Si un ID est fourni, filtrer par ID
      },
      include: {
        utilisateur: {
          select: {
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
        filiere: true, // Inclure les détails de la filière
        notes: true, // Inclure les notes de l'étudiant
        paiements: true, // Inclure les paiements de l'étudiant
      },
    });

    if (!etudiants || etudiants.length === 0) {
      return NextResponse.json(
        { message: "Aucun étudiant trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Récupération réussie", etudiants },
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
// PUT : Mettre à jour un étudiant
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
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

    // Mettre à jour l'étudiant et l'utilisateur associé
    const updatedEtudiant = await prisma.etudiants.update({
      where: {
        id_utilisateur: id ? parseInt(id) : 0,
      },
      data: {
        matricule,
        date_naissance: new Date(date_naissance),
        date_inscription: new Date(date_inscription),
        id_filiere,
        utilisateur: {
          update: {
            nom,
            prenom,
            email,
            sexe,
            mot_de_passe: hashPass,
            telephone,
            adresse,
            profil,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Étudiant modifié avec succès",
        updatedEtudiant,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'étudiant :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}

// DELETE : Supprimer un étudiant
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const etudiant = await prisma.etudiants.findUnique({
      where: { id_utilisateur: id ? parseInt(id) : 0 },
      include: { utilisateur: true }, // Inclure l'utilisateur associé
    });

    if (!etudiant) {
      return NextResponse.json(
        { message: "Étudiant non trouvé" },
        { status: 404 }
      );
    }

    // Supprimer l'étudiant
    await prisma.etudiants.delete({
      where: { id_utilisateur: etudiant.id_utilisateur },
    });

    // Supprimer l'utilisateur associé
    if (etudiant.utilisateur) {
      await prisma.utilisateurs.delete({
        where: { id_utilisateur: etudiant.utilisateur.id_utilisateur },
      });
    }

    return NextResponse.json(
      { message: "Étudiant et utilisateur supprimés avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la suppression de l'étudiant :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}
