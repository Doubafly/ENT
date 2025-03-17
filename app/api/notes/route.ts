import { NextResponse } from "next/server";
import prisma from "../prisma";

// GET : Récupérer toutes les notes
export async function GET() {
  try {
    // Récupérer toutes les notes avec les relations cours et étudiant
    const notes = await prisma.notes.findMany({
      select: {
        id_note: true,
        id_etudiant: true,
        id_cours: true,
        note_class: true,
        note_exam: true,
        commentaire: true,
        date_saisie: true,
        cours: true,
        etudiant: true,
      },
    });

    // Retourner les notes récupérées
    return NextResponse.json(notes, { status: 200 });
  } catch (error: any) {
    // Journaliser l'erreur et retourner une réponse d'erreur
    console.error("Erreur lors de la récupération des notes :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}

// POST : Créer une nouvelle note
export async function POST(request: Request) {
  try {
    // Extraire les données de la requête
    const { id_etudiant, id_cours, note_class, note_exam, commentaire } =
      await request.json();

    // Validation des données
    if (
      !id_etudiant ||
      !id_cours ||
      note_class === undefined ||
      note_exam === undefined
    ) {
      return NextResponse.json(
        { message: "Veuillez fournir tous les champs obligatoires" },
        { status: 400 }
      );
    }

    // Créer une nouvelle note dans la base de données
    const nouvelleNote = await prisma.notes.create({
      data: {
        id_etudiant,
        id_cours,
        note_class,
        note_exam,
        commentaire,
        date_saisie: new Date(), // Date de saisie automatique
      },
    });

    // Retourner la note créée avec un statut 201 (Created)
    return NextResponse.json(
      { message: "Note créée avec succès", note: nouvelleNote },
      { status: 201 }
    );
  } catch (error: any) {
    // Journaliser l'erreur et retourner une réponse d'erreur
    console.error("Erreur lors de la création de la note :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue", erreur: error.message },
      { status: 500 }
    );
  }
}