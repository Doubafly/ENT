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

    // Afficher les données reçues
    console.log("Données reçues:", {
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
    });

    // Vérifier les champs manquants
    const champsManquants = [];
    if (!nom?.trim()) champsManquants.push("nom");
    if (!prenom?.trim()) champsManquants.push("prenom");
    if (!email?.trim()) champsManquants.push("email");
    if (!sexe?.trim()) champsManquants.push("sexe");
    if (!telephone?.trim()) champsManquants.push("telephone");
    if (!adresse?.trim()) champsManquants.push("adresse");
    if (!profil?.trim()) champsManquants.push("profil");
    if (!matricule?.trim()) champsManquants.push("matricule");
    if (!date_naissance) champsManquants.push("date_naissance");
    if (!date_inscription) champsManquants.push("date_inscription");
    if (!id_filiere) champsManquants.push("id_filiere");

    // Afficher les champs manquants
    if (champsManquants.length > 0) {
      console.error("Champs manquants :", champsManquants.join(", "));
      return NextResponse.json(
        {
          message: "Veuillez remplir tous les champs correctement",
          champsManquants,
        },
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
            mot_de_passe: hashPass === mot_de_passe ? undefined : hashPass, // Ne pas modifier le mot de passe si vide
            telephone,
            adresse,
            profil: profil?.trim() ? profil : undefined, // Ne pas forcer un profil vide
          },
        },
      },
    });

    // Afficher les données de l'étudiant mis à jour
    console.log("Étudiant mis à jour:", updatedEtudiant);

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
