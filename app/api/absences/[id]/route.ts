import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prisma";

interface Params {
  params: { id: string };
}

// GET : Récupérer une absence par ID
export async function GET(request: NextRequest, { params }: Params) {
  const id = parseInt(params.id);

  try {
    const absence = await prisma.absences.findUnique({
        where: { id_absence: id },
        select: {
          id_absence: true,
          date_absence: true,
          motif: true,
          cours: {
            select: {
              id_cours: true,
              enseignant: {
                select: {
                  utilisateur: {
                    select: {
                      nom: true,
                      prenom: true
                    }
                  },
                  specialite: true
                }
              },
              filiere_module: {
                select: {
                  module: {
                    select: {
                      nom: true
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
              etudiant: {
                select: {
                  matricule: true
                }
              }
            }
          },

        }
      });
      

    if (!absence) {
      return NextResponse.json({ message: "Absence non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Succès", absence }, { status: 200 });
  } catch (e) {
    console.error("Erreur GET absence :", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// PUT : Modifier une absence
export async function PUT(request: NextRequest, { params }: Params) {
  const id = parseInt(params.id);
  const { motif } = await request.json();

  try {
    const absenceModifiee = await prisma.absences.update({
      where: { id_absence: id },
      data: { motif }
    });

    return NextResponse.json(
      { message: "Absence modifiée avec succès", absence: absenceModifiee },
      { status: 200 }
    );
  } catch (e) {
    console.error("Erreur PUT absence :", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE : Supprimer une absence
export async function DELETE(request: NextRequest, { params }: Params) {
  const id = parseInt(params.id);

  try {
    await prisma.absences.delete({
      where: { id_absence: id }
    });

    return NextResponse.json({ message: "Absence supprimée" }, { status: 200 });
  } catch (e) {
    console.error("Erreur DELETE absence :", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
