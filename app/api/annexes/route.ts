import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";
import { UtilisateursType } from "@prisma/client";

// teste de premier niveau a chaque fois

// Récupération de toutes les annexes:: GET /api/annexes
export async function GET() {
  // les infos directement lier aussi doivent etre recuperer
  try {
    const annexes = await prisma.annexes.findMany({
      select: {
        id_annexe: true,
        nom: true,
        adresse: true,
        ville: true,
        region: true,
        filieres: {
          select: {
            nom: true,
            description: true,
            niveau: true,
            montant_annuel: true,
          },
        },
      },
    });
    return NextResponse.json(
      { message: "Annexes récupérées avec succès", annexes },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: e.message },
      { status: 500 }
    );
  }
}

// Création d'une annexe :POST /api/annexes
export async function POST(request: NextRequest) {
  try {
    const { nom, adresse, ville, region } = await request.json();

    if (!nom || !adresse || !ville || !region) {
      return new Response(
        JSON.stringify({ message: "Tous les champs sont obligatoires" }),
        { status: 400 }
      );
    }

    const annexe = await prisma.annexes.create({
      data: {
        nom,
        adresse,
        ville,
        region,
      },
    });

    return new Response(JSON.stringify(annexe), { status: 201 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
} 