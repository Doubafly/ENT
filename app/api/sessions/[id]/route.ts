import prisma from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

// Récupération par Id : GET /api/sessions/[id]
export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    const session = await prisma.sessions.findUnique({
      where: { id_sessions: id ? parseInt(id) : 0 },
    });

    if (!session) {
      return NextResponse.json(
        { message: "Session introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Session trouvée", session },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// Mise à jour par id : PUT /api/sessions/[id]
export async function PUT(request: NextRequest) {
  const { annee_academique } = await request.json();
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    const session = await prisma.sessions.update({
      where: { id_sessions: id ? parseInt(id) : 0 },
      data: {
        annee_academique,
      },
    });

    return NextResponse.json(
      { message: "Session modifiée avec succès", session },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// Suppression par id: DELETE /api/sessions/[id]
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    await prisma.sessions.delete({
      where: { id_sessions: id ? parseInt(id) : 0 },
    });

    return NextResponse.json({ message: "Session supprimée" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
