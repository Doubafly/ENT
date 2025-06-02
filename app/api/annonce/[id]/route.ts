import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/prisma";

// GET: Récupère une annonce spécifique
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const annonce = await prisma.annonce.findUnique({
      where: { id_annonce: Number(params.id) },
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

// PUT: Met à jour une annonce
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { titre, contenu } = await request.json();
    
    const annonce = await prisma.annonce.update({
      where: { id_annonce: Number(params.id) },
      data: { titre, contenu },
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

// DELETE: Supprime une annonce
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.annonce.delete({
      where: { id_annonce: Number(params.id) },
    });

    return NextResponse.json(
      { message: "Annonce supprimée avec succès" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}