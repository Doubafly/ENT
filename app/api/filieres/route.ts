import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";
import { Select } from "@mui/material";

export async function GET() {
  try {
    const filieres = await prisma.filieres.findMany({
      include: {
        annexe: {
          select: {
            nom: true,
            ville: true,
          },
        },
        filiere_module: {
          include: {
            cours: {
              select: {
                semestre: true,
                enseignant: {
                  select: {
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
            },
            module: {
              select: {
                nom: true,
                description: true,
              },
            },
          },
        },
        etudiants: {
          select: {
            matricule: true,
            utilisateur: {
              select: {
                nom: true,
                prenom: true,
              },
            },
            notes: {
              select: {
                note_class: true,
                note_exam: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(
      { message: "succes", filieres },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nom, description, niveau, montant_annuel, id_annexe } =
      await request.json();
    if (!nom || !description || !niveau || !montant_annuel || !id_annexe) {
      return NextResponse.json(
        { message: "Paramètres manquants" },
        {
          status: 400,
        }
      );
    }
    const filiere = await prisma.filieres.create({
      data: {
        nom,
        description,
        niveau,
        montant_annuel,
        id_annexe,
      },
    });
    return NextResponse.json(
      { message: "succes", filiere },
      {
        status: 201,
      }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
