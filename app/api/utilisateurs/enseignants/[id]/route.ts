import prisma from "@/app/api/prisma";
import { UtilisateursType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const enseignant = await prisma.enseignants.findMany({
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
    if (!enseignant) {
      return NextResponse.json(
        { message: "Enseignant non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "recuperation avec id succes", enseignant },
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
      specialite,
    } = await req.json();

    // Validation des données
    if (
      !nom?.trim() ||
      !prenom?.trim() ||
      !email?.trim() ||
      !sexe?.trim() ||
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
    // Vérifier que le mot de passe n'est pas vide
    let hashPass = mot_de_passe;
    if (mot_de_passe && mot_de_passe.trim() !== "") {
      hashPass = await bcrypt.hash(mot_de_passe, 10);
    } else {
      // Si le mot de passe est vide, ne pas tenter de le hacher
      console.warn("Mot de passe vide, le mot de passe ne sera pas modifié.");
    }

    const updatedEnseignant = await prisma.enseignants.update({
      where: {
        id_utilisateur: id ? parseInt(id) : 0,
      },
      data: {
        matricule,
        specialite,
        utilisateur: {
          update: {
            nom,
            prenom,
            email,
            sexe,
            mot_de_passe: hashPass === "" ? undefined : hashPass,
            telephone,
            adresse,
            profil,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Enseignant modifié avec succèss",
        updatedEnseignant,
      },
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

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const enseignant = await prisma.enseignants.findUnique({
      where: { id_utilisateur: id ? parseInt(id) : 0 },
    });

    if (!enseignant) {
      return new Response(
        JSON.stringify({ message: "Enseignant non trouvé" }),
        { status: 404 }
      );
    }

    // Supprime l'enseignant
    await prisma.utilisateurs.delete({
      where: { id_utilisateur: id ? parseInt(id) : 0 },
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