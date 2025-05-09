import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cours = await prisma.cours.findMany({
      include: {
        filiere_module: {
          include: {
            filiere: {
              include: {
                annexe: true,
              },
            },
            module: true,
            documents: true, // Les documents sont maintenant inclus via filiere_module
          },
        },
        sessions: true,
        enseignant: {
          include: {
            utilisateur: true,
          },
        },
        // documents: true, // Cette ligne est supprimée car les documents ne sont plus directement liés à Cours
      },
    });

    return NextResponse.json(
      { message: "Cours récupérés avec succès", cours },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { message: "Une erreur est survenue", erreur: e.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Une erreur inconnue est survenue" },
      { status: 500 }
    );
  }
}