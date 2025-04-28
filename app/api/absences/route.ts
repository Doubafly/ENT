import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";

// Récupérer toutes les absences
export async function GET() {
  try {
    const absences = await prisma.absences.findMany({
        select: {
          id_absence: true,
          date_absence: true,
          motif: true,
          cours: {
            select: {
              id_cours: true,
              filiere_module: {
                select: {
                  module: {
                    select: {
                      nom: true
                    }
                  }
                }
              },
              enseignant: {
                select: {
                  utilisateur: {
                    select: {
                      nom: true,
                      prenom: true
                    }
                  }
                }
              }
            }
          },
          utilisateur: {
            select: {
              nom: true,
              prenom: true,
              telephone: true,
              etudiant: {
                select: {
                  matricule: true
                }
              }
            }
          }
          
        }
      });
      

    return NextResponse.json(
      { message: "Liste des absences récupérée avec succès", absences },
      { status: 200 }
    );
  } catch (e) {
    console.error("Erreur lors de la récupération des absences :", e);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// Ajouter une nouvelle absence
export async function POST(request: NextRequest) {
  try {
    const { id_etudiant, id_cours, date, justification } = await request.json();

    if (!id_etudiant || !id_cours || !date) {
      return NextResponse.json(
        { message: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const nouvelleAbsence = await prisma.absences.create({
      data: {
        utilisateur: {
          connect: { id_utilisateur: id_etudiant }
        },
        cours: {
          connect: { id_cours: id_cours }
        },
        date_absence: new Date(date),
        motif: justification,
      }
    });

    return NextResponse.json(
      { message: "Absence enregistrée avec succès", absence: nouvelleAbsence },
      { status: 200 }
    );
  } catch (e) {
    console.error("Erreur lors de l'ajout de l'absence :", e);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
