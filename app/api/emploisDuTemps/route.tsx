import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";

// 🔹 Récupération de tous les emplois du temps :: GET /api/emplois-du-temps
export async function GET() {
  try {
    const emploisDuTemps = await prisma.emploisDuTemps.findMany({
      select: {
        id_emploi: true,
        jour: true,
        heure_debut: true,
        heure_fin: true,
        salle: true,
        cours: {
          select: {
            id_cours: true,
            semestre: true,
            filiere_module: {
              select: {
                code_module: true,
                volume_horaire: true,
                filiere: { select: { nom: true } },
                module: { select: { nom: true } },
              },
            },
            enseignant: {
              select: {
                id: true,
                specialite: true,
                utilisateur: { select: { nom: true, prenom: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Emplois du temps récupérés avec succès", emploisDuTemps },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: e instanceof Error ? e.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}

// 🔹 Création d'un emploi du temps :: POST /api/emplois-du-temps
export async function POST(request: NextRequest) {
  try {
    const { id_cours, jour, heure_debut, heure_fin, salle } = await request.json();

    // Vérification des champs obligatoires
    if (!id_cours || !jour || !heure_debut || !heure_fin) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    // Vérification de la superposition des cours (éviter les conflits)
    const conflit = await prisma.emploisDuTemps.findFirst({
      where: {
        id_cours,
        jour,
        OR: [
          { heure_debut: { lt: heure_fin }, heure_fin: { gt: heure_debut } },
        ],
      },
    });

    if (conflit) {
      return NextResponse.json(
        { message: "Conflit d'emploi du temps détecté" },
        { status: 400 }
      );
    }

    // Création de l'emploi du temps
    const emploiDuTemps = await prisma.emploisDuTemps.create({
      data: {
        id_cours,
        jour,
        heure_debut: new Date(heure_debut),
        heure_fin: new Date(heure_fin),
        salle,
      },
    });

    return NextResponse.json(
      { message: "Emploi du temps ajouté avec succès", emploiDuTemps },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: e instanceof Error ? e.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}
