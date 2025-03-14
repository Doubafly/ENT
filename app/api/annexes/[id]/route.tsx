import prisma from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

// Récupération par Id : GET /api/annexes/[id]
export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    const annexe = await prisma.annexes.findUnique({
      where: { id_annexe: id ? parseInt(id) : 0 },
    });

    if (!annexe) {
      return NextResponse.json(
        { message: "Annexe introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "annexe trouver", annexe },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// Mise à jour par id : PUT /api/annexes/[id]
export async function PUT(request: NextRequest) {
  const { nom, adresse, ville, region } = await request.json();
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    const annexe = await prisma.annexes.update({
      where: { id_annexe: id ? parseInt(id) : 0 },
      data: {
        nom,
        adresse,
        ville,
        region,
      },
    });

    return NextResponse.json(
      { message: "modifier avec succe", annexe },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// Suppression par id: DELETE /api/annexes/[id]
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    await prisma.annexes.delete({
      where: { id_annexe: id ? parseInt(id) : 0 },
    });

    return NextResponse.json({ message: "Annexe supprimée" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
