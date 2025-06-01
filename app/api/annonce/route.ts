import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/prisma";

// GET: Récupère toutes les annonces
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Ajout des paramètres de filtre
    const dateDebut = searchParams.get('dateDebut');
    const dateFin = searchParams.get('dateFin');
    const anciennete = searchParams.get('anciennete');

    let where: any = {};

    // Filtre par date
    if (dateDebut && dateFin) {
      where.date_creation = {
        gte: new Date(dateDebut),
        lte: new Date(dateFin)
      };
    }

    // Filtre par ancienneté
    if (anciennete) {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch(anciennete) {
        case "1mois":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "3mois":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "6mois":
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case "1an":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      where.date_creation = {
        lt: cutoffDate
      };
    }

    const annonces = await prisma.annonce.findMany({
      where,
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
      orderBy: {
        date_creation: 'desc'
      }
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

// POST: Crée une nouvelle annonce
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

// DELETE: Suppression multiple
// DELETE: Suppression multiple
export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { message: "Format de données invalide" },
        { status: 400 }
      );
    }

    const { count } = await prisma.annonce.deleteMany({
      where: {
        id_annonce: { in: ids.map(id => Number(id)) }
      }
    });

    return NextResponse.json(
      { message: `${count} annonce(s) supprimée(s)`, count },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Erreur suppression multiple:", e);
    return NextResponse.json(
      { message: "Erreur lors de la suppression", error: e.message },
      { status: 500 }
    );
  }
}