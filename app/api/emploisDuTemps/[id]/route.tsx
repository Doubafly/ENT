import prisma from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

// 🔹 Récupération d'un emploi du temps par ID :: GET /api/emplois-du-temps/[id]
export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    const emploi = await prisma.emploisDuTemps.findUnique({
      where: { id_emploi: id ? parseInt(id) : 0 },
     });

    if (!emploi) {
      return NextResponse.json(
        { message: "Emploi du temps introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Emploi du temps trouvé", emploi },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// 🔹 Mise à jour d'un emploi du temps par ID :: PUT /api/emplois-du-temps/[id]
export async function PUT(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const { id_cours, jour, heure_debut, heure_fin, salle } = await request.json();

  try {
    const emploi = await prisma.emploisDuTemps.update({
      where: { id_emploi: id ? parseInt(id) : 0 },
      data: {
        id_cours,
        jour,
        heure_debut: new Date(heure_debut),
        heure_fin: new Date(heure_fin),
        salle,
      },
    });

    return NextResponse.json(
      { message: "Emploi du temps modifié avec succès", emploi },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// 🔹 Suppression d'un emploi du temps par ID :: DELETE /api/emplois-du-temps/[id]
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    await prisma.emploisDuTemps.delete({
      where: { id_emploi: id ? parseInt(id) : 0 },
    });

    return NextResponse.json({ message: "Emploi du temps supprimé" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
