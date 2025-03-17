import prisma from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

// Récupération par Id : GET /api/cours/[id]
export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    const cours = await prisma.cours.findUnique({
      where: { id_cours: id ? parseInt(id) : 0 },
    });

    if (!cours) {
      return NextResponse.json(
        { message: "Cours introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Cours trouvé", cours },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// Mise à jour par id : PUT /api/cours/[id]
export async function PUT(request: NextRequest) {
  const { id_filiere_module, id_professeur, id_sessions, semestre } = await request.json();
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    const cours = await prisma.cours.update({
      where: { id_cours: id ? parseInt(id) : 0 },
      data: {
        id_filiere_module,
        id_professeur,
        id_sessions,
        semestre,
      },
    });

    return NextResponse.json(
      { message: "Cours modifié avec succès", cours },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// Suppression par id : DELETE /api/cours/[id]
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    await prisma.cours.delete({
      where: { id_cours: id ? parseInt(id) : 0 },
    });

    return NextResponse.json({ message: "Cours supprimé" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
