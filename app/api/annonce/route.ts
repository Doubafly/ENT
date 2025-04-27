import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";

// Récupération de toutes les annonces et création d'une annonce

// GET /api/annonces
export async function GET() {
  try {
    const annonces = await prisma.annonce.findMany({
      select: {
        id_annonce: true,
        titre: true,
        contenu: true,
        date_creation: true,
        admin: {
          select: {
            id_admin: true,
            utilisateur: {
              select: {
                nom: true,
                prenom: true,
                email: true,
              }
            }
          }
        }
      },
    });
 
    return NextResponse.json(
      { message: "Annonces récupérées avec succès", annonces },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: e.message },
      { status: 500 }
    );
  }
}

// POST /api/annonces
export async function POST(request: NextRequest) {
  try {
    const { titre, contenu, id_admin } = await request.json();

    if (!titre || !contenu || !id_admin) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    const annonce = await prisma.annonce.create({
      data: {
        titre,
        contenu,
        id_admin,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Annonce créée avec succès",
        data: annonce,
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
        error: e.message,
      },
      { status: 500 }
    );
  }
}
