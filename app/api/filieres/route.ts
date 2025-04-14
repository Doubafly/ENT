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
                id_cours: true,
                semestre: true,
                enseignant: {
                  select: {
                    id: true,
                    specialite: true,
                    matricule: true,
                    utilisateur: {
                      select: {
                        id_utilisateur: true,
                        nom: true,
                        prenom: true,
                        mot_de_passe: true,
                        email: true,
                        sexe: true,
                        telephone: true,
                        adresse: true,
                        profil: true,
                        date_creation: true,
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
            id: true,
            matricule: true,
            date_inscription: true,
            date_naissance: true,
            utilisateur: {
              select: {
                id_utilisateur: true,
                nom: true,
                prenom: true,
                email: true,
                sexe: true,
                profil: true,
                telephone: true,
                adresse: true,
              },
            },
            notes: {
              select: {
                id_note: true,
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
