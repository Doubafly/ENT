import prisma from "@/lib/prisma";


import { NextRequest, NextResponse } from "next/server";
// GET : Récupérer une note spécifique par son ID
export async function GET(
  request: NextRequest,
) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();


    // Récupérer la note par son ID
    const note = await prisma.notes.findUnique({
      where: { id_note: id ? parseInt(id) : undefined, },
      include: {
        cours: true, // Inclure les détails du cours associé
        etudiant: true, // Inclure les détails de l'étudiant associé
      },
    });

    // Si la note n'existe pas
    if (!note) {
      return NextResponse.json(
        { message: "Note non trouvée" },
        { status: 404 }
      );
    }

    // Retourner la note trouvée
    return NextResponse.json(note, { status: 200 });
  } catch (error: any) {
    // Journaliser l'erreur et retourner une réponse d'erreur
    console.error("Erreur lors de la récupération de la note :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}

// PUT : Mettre à jour une note spécifique par son ID
export async function PUT(
  request: NextRequest,
) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();


    // Extraire les données de la requête
    const { note_class, note_exam, commentaire_enseignant } = await request.json();

    // Validation des données
    if (note_class === undefined && note_exam === undefined && !commentaire_enseignant) {
      return NextResponse.json(
        { message: "Aucune donnée à mettre à jour" },
        { status: 400 }
      );
    }

    // Mettre à jour la note
    const noteMaj = await prisma.notes.update({
      where: { id_note: id ? parseInt(id) : undefined, },
      data: {
        note_class,
        note_exam,
        commentaire_enseignant,
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

// DELETE : Supprimer une note spécifique par son ID
export async function DELETE(
  request: NextRequest,
) {
  try {
    
    const id = request.nextUrl.pathname.split("/").pop();
    // Supprimer la note
    await prisma.notes.delete({
      where: { id_note: id ? parseInt(id) : undefined, },
    });

    // Retourner une confirmation de suppression
    return NextResponse.json(
      { message: "Note supprimée avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    // Journaliser l'erreur et retourner une réponse d'erreur
    console.error("Erreur lors de la suppression de la note :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}