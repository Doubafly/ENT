import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";




// PUT : Mettre à jour une note spécifique par son ID
export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();


    // Extraire les données de la requête
    const { commentaire_etudiant, statut_reclamation } = await request.json();

    // Validation des données
    if (!commentaire_etudiant) { 
      return NextResponse.json(
        { message: "Aucune donnée à mettre à jour" },
        { status: 400 }
      );
    }

    // Mettre à jour la note
    const noteMaj = await prisma.notes.update({
      where: { id_note: id ? parseInt(id) : 0 },
      data: {
        commentaire_etudiant,
        statut_reclamation,
      },
    });

    // Retourner la note mise à jour
    return NextResponse.json(
      { message: "Note mise à jour avec succès", note: noteMaj },
      { status: 200 }
    );
  } catch (error: any) {
    // Journaliser l'erreur et retourner une réponse d'erreur
    console.error("Erreur lors de la mise à jour de la note :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}