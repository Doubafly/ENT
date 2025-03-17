import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";
import { UtilisateursType } from "@prisma/client";

// teste de premier niveau a chaque fois

// Récupération de tous les cours :: GET /api/cours
export async function GET() {
  try {
    const cours = await prisma.cours.findMany({
      select: {
        id_cours: true,
        semestre: true,
        filiere_module: {
          select: {
            code_module: true,
            volume_horaire: true,
            filiere: {
              select: {
                nom: true,
              },
            },
            module: {
              select: {
                nom: true,
              },
            },
          },
        },
        enseignant: {
          select: {
            id: true,
            specialite: true,
            utilisateur: {
              select: {
                nom: true,
                prenom: true,
                email: true,
              },
            },
          },
        },
        sessions: {
          select: {
            annee_academique: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Cours récupérés avec succès", cours },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { message: "Une erreur est survenue", erreur: e.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Une erreur inconnue est survenue" },
      { status: 500 }
    );
  }
}

// Création d'un cours :: POST /api/cours
export async function POST(request: NextRequest) {
  try {
    const { id_filiere_module, id_professeur, id_sessions, semestre } = await request.json();

    if (!id_filiere_module || !id_professeur || !id_sessions || !semestre) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    const cours = await prisma.cours.create({
      data: {
        id_filiere_module,
        id_professeur,
        id_sessions,
        semestre,
      },
    });

    return NextResponse.json(cours, { status: 201 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { message: "Une erreur est survenue", erreur: e.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Une erreur inconnue est survenue" },
      { status: 500 }
    );
  }
}