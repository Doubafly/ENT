import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id_filiere_module, id_professeur, id_sessions, semestre } =
      await request.json();

    // Validation des champs
    if (!id_filiere_module || !id_professeur || !id_sessions || !semestre) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    // Vérification des relations
    const [filiereModuleExists, professeurExists, sessionExists] =
      await Promise.all([
        prisma.filiereModule.findUnique({ where: { id_filiere_module } }),
        prisma.enseignants.findUnique({ where: { id: id_professeur } }),
        prisma.sessions.findUnique({ where: { id_sessions } }),
      ]);

    if (!filiereModuleExists) {
      return NextResponse.json(
        { message: "L'association filière-module spécifiée n'existe pas" },
        { status: 404 }
      );
    }

    if (!professeurExists) {
      return NextResponse.json(
        { message: "L'enseignant spécifié n'existe pas" },
        { status: 404 }
      );
    }

    if (!sessionExists) {
      return NextResponse.json(
        { message: "La session spécifiée n'existe pas" },
        { status: 404 }
      );
    }

    // Vérification des doublons
    const existingCours = await prisma.cours.findFirst({
      where: {
        id_filiere_module,
        id_sessions,
        semestre,
        id_professeur,
      },
    });

    if (existingCours) {
      return NextResponse.json(
        {
          message: "Un cours identique existe déjà pour cette combinaison",
          data: existingCours,
        },
        { status: 409 }
      );
    }

    // Création du cours
    const cours = await prisma.cours.create({
      data: {
        id_filiere_module,
        id_professeur,
        id_sessions,
        semestre,
      },
      include: {
        filiere_module: {
          include: {
            module: true,
          },
        },
        sessions: true,
        enseignant: {
          include: {
            utilisateur: true,
          },
        },
      },
    });

    // Formater la réponse
    const response = {
      id_cours: cours.id_cours,
      semestre: cours.semestre,
      module: {
        id_module: cours.filiere_module.module.id_module,
        nom: cours.filiere_module.module.nom,
      },
      sessions: {
        id_sessions: cours.sessions.id_sessions,
        annee_academique: cours.sessions.annee_academique,
      },
      enseignant: {
        id: cours.enseignant.id,
        nom: cours.enseignant.utilisateur.nom,
        prenom: cours.enseignant.utilisateur.prenom,
      },
    };

    return NextResponse.json(
      {
        message: "Cours créé avec succès",
        data: response,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du cours:", error);

    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de la création du cours",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const id_cours = parseInt(id || "");

    if (isNaN(id_cours)) {
      return NextResponse.json(
        { message: "ID de cours invalide" },
        { status: 400 }
      );
    }

    // Vérifier l'existence du cours
    const coursExists = await prisma.cours.findUnique({
      where: { id_cours },
    });

    if (!coursExists) {
      return NextResponse.json(
        { message: "Le cours spécifié n'existe pas" },
        { status: 404 }
      );
    }

    // Supprimer le cours
    await prisma.cours.delete({
      where: { id_cours },
    });

    return NextResponse.json(
      { message: "Cours supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du cours:", error);

    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de la suppression du cours",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
