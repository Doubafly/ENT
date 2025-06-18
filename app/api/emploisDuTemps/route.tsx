import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";

export async function GET() {
  try {
    const emploisDuTemps = await prisma.emploisDuTemps.findMany({
      select: {
        id_emploi:true,
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
                filiere: {
                  select: {
                    id_filiere:true,
                    nom: true,
                    niveau: true,
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
                utilisateur: {
                  select: {
                    nom: true,
                    prenom: true,
                    telephone: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Succès", emploisDuTemps },
      { status: 200 }
    );
  } catch (e) {
    console.error("Erreur lors de la récupération des emplois du temps :", e);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
    try {
        const { id_cours, jour, heure_debut, heure_fin, salle } = await request.json();
    
        // Vérification des données requises
        if (!id_cours || !jour || !heure_debut || !heure_fin || !salle) {
          return NextResponse.json(
            { message: "Paramètres manquants" },
            { status: 400 }
          );
        }
    
        // Création de l'emploi du temps
        const nouvelEmploi = await prisma.emploisDuTemps.create({
          data: {
            id_cours,
            jour,
            heure_debut: new Date(heure_debut),
            heure_fin: new Date(heure_fin),
            salle
          }
        });
    
        return NextResponse.json(
          { message: "Emploi du temps ajouté avec succès", emploi: nouvelEmploi },
          { status: 200 }
        );
      } catch (e) {
        console.error("Erreur lors de l'ajout de l'emploi du temps :", e);
        return NextResponse.json(
          { message: "Une erreur est survenue"},
          { status: 500 }
        );
      }
} 