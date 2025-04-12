import prisma from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET : Récupérer une filière spécifique avec toutes ses relations
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();

    // Validation de l'ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "ID de filière invalide" },
        { status: 400 }
      );
    }

    const filiere = await prisma.filieres.findUnique({
      where: { id_filiere: parseInt(id) },
      include: {
        annexe: {
          select: {
            nom: true,
            ville: true,
          },
        },

        filiere_module: {
          include: {
            cours: {
              select: {
                semestre: true,
                enseignant: {
                  select: {
                    utilisateur: {
                      select: {
                        nom: true,
                        prenom: true,
                        email: true,
                      },
                    },
                  },
                },
                sessions: {
                  select: {
                    annee_academique: true,
                  },
                },
              },
            },
            module: {
              select: {
                nom: true,
                description: true,
              },
            },
          },
        },
        etudiants: {
          select: {
            matricule: true,
            utilisateur: {
              select: {
                nom: true,
                prenom: true,
              },
            },
            notes: {
              select: {
                note_class: true,
                note_exam: true,
              },
            },
          },
        },
      },
    });

    if (!filiere) {
      return NextResponse.json(
        { message: "Filière non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Filière récupérée avec succès",
        data: filiere,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`[FILIERE_GET_ERROR] ${error.message}`);
    return NextResponse.json(
      {
        message: "Erreur lors de la récupération de la filière",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT : Mettre à jour une filière existante
export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const { nom, description, niveau, montant_annuel, id_annexe } =
      await request.json();

    // Validation de l'ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "ID de filière invalide" },
        { status: 400 }
      );
    }

    // Validation des données
    if (!nom || !niveau || montant_annuel === undefined) {
      return NextResponse.json(
        {
          message: "Champs obligatoires manquants",
          required: ["nom", "niveau", "montant_annuel"],
        },
        { status: 400 }
      );
    }

    // Vérification de l'existence de la filière
    const filiereExistante = await prisma.filieres.findUnique({
      where: { id_filiere: parseInt(id) },
    });

    if (!filiereExistante) {
      return NextResponse.json(
        { message: "Filière non trouvée" },
        { status: 404 }
      );
    }

    // Vérification de l'unicité du nom si modifié
    if (nom !== filiereExistante.nom) {
      const nomExisteDeja = await prisma.filieres.findFirst({
        where: {
          nom,
          NOT: { id_filiere: parseInt(id) },
        },
      });

      if (nomExisteDeja) {
        return NextResponse.json(
          { message: "Une filière avec ce nom existe déjà" },
          { status: 409 }
        );
      }
    }

    // Vérification de l'annexe si fournie
    if (id_annexe) {
      const annexeExistante = await prisma.annexes.findUnique({
        where: { id_annexe },
      });

      if (!annexeExistante) {
        return NextResponse.json(
          { message: "L'annexe spécifiée n'existe pas" },
          { status: 404 }
        );
      }
    }

    // Mise à jour
    const filiereMaj = await prisma.filieres.update({
      where: { id_filiere: parseInt(id) },
      data: {
        nom,
        description: description || null,
        niveau,
        montant_annuel,
        id_annexe: id_annexe || null,
      },
      include: {
        annexe: true,
      },
    });

    return NextResponse.json(
      {
        message: "Filière mise à jour avec succès",
        data: filiereMaj,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`[FILIERE_PUT_ERROR] ${error.message}`);
    return NextResponse.json(
      {
        message: "Erreur lors de la mise à jour de la filière",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE : Supprimer une filière
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();

    // Validation de l'ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "ID de filière invalide" },
        { status: 400 }
      );
    }

    // Vérification de l'existence et des dépendances
    const filiere = await prisma.filieres.findUnique({
      where: { id_filiere: parseInt(id) },
      include: {
        etudiants: {
          select: { id: true },
          take: 1, // Juste pour vérifier s'il y a des étudiants
        },
        filiere_module: {
          select: { id_filiere_module: true },
          take: 1, // Juste pour vérifier s'il y a des modules
        },
      },
    });

    if (!filiere) {
      return NextResponse.json(
        { message: "Filière non trouvée" },
        { status: 404 }
      );
    }

    // Vérification des étudiants inscrits
    if (filiere.etudiants.length > 0) {
      return NextResponse.json(
        {
          message:
            "Impossible de supprimer: des étudiants sont inscrits dans cette filière",
          code: "HAS_STUDENTS",
        },
        { status: 400 }
      );
    }

    // Vérification des modules associés
    if (filiere.filiere_module.length > 0) {
      return NextResponse.json(
        {
          message:
            "Impossible de supprimer: des modules sont associés à cette filière",
          code: "HAS_MODULES",
        },
        { status: 400 }
      );
    }

    // Suppression
    await prisma.filieres.delete({
      where: { id_filiere: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Filière supprimée avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`[FILIERE_DELETE_ERROR] ${error.message}`);
    return NextResponse.json(
      {
        message: "Erreur lors de la suppression de la filière",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
        code: error.code || "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}
