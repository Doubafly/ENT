import prisma from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

// Récupération par Id : GET /api/annonces/[id]
export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    const annonce = await prisma.annonce.findUnique({
      where: { id_annonce: id ? parseInt(id) : 0 },
      include: {
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
      }
    });

    if (!annonce) {
      return NextResponse.json(
        { message: "Annonce introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Annonce trouvée", annonce },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// Mise à jour par id : PUT /api/annonces/[id]
export async function PUT(request: NextRequest) {
  const { titre, contenu } = await request.json();
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    const annonce = await prisma.annonce.update({
      where: { id_annonce: id ? parseInt(id) : 0 },
      data: {
        titre,
        contenu,
      },
    });

    return NextResponse.json(
      { message: "Annonce modifiée avec succès", annonce },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// Suppression par id: DELETE /api/annonces/[id]
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    await prisma.annonce.delete({
      where: { id_annonce: id ? parseInt(id) : 0 },
    });

    return NextResponse.json({ message: "Annonce supprimée" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
