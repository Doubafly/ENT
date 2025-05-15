import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";

// Récupération de toutes les sessions académiques :: GET /api/sessions
export async function GET() {
  try {
    const sessions = await prisma.sessions.findMany({

      select: {
        id_sessions: true,
        annee_academique: true,
        cours: {
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
                    id_utilisateur:true,
                    nom: true,
                    prenom: true,
                  },
                },
              }, 
            },
          },
        },

      },
    });

    return NextResponse.json({
      data: sessions.map((s) => ({
        id_sessions: s.id_sessions,
        annee_academique: s.annee_academique,
      })),
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des sessions" },
      { status: 500 }
    );
  }
}
// Création d'une session académique :: POST /api/sessions
export async function POST(request: NextRequest) {
  try {
    const { annee_academique } = await request.json();

    if (!annee_academique) {
      return NextResponse.json(
        { message: "L'année académique est obligatoire" },
        { status: 400 }
      );
    }

    const session = await prisma.sessions.create({
      data: {
        annee_academique,
      },
    });

    return NextResponse.json(session, { status: 201 });
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
