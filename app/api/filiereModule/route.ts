import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      id_module,
      id_filiere,
      volume_horaire,
      code_module,
      coefficient,
      syllabus,
    } = await request.json();

    // Validation des champs obligatoires
    if (!id_module || !id_filiere || !code_module) {
      return NextResponse.json(
        {
          message: "Paramètres manquants",
          details: "id_module, id_filiere et code_module sont obligatoires",
        },
        { status: 400 }
      );
    }

    // Vérification de l'existence des entités
    const [filiereExists, moduleExists, existingAssociation] =
      await Promise.all([
        prisma.filieres.findUnique({ where: { id_filiere } }),
        prisma.modules.findUnique({ where: { id_module } }),
        prisma.filiereModule.findFirst({
          where: {
            id_filiere,
            id_module,
          },
        }),
      ]);

    if (!filiereExists) {
      return NextResponse.json(
        { message: "La filière spécifiée n'existe pas" },
        { status: 404 }
      );
    }

    if (!moduleExists) {
      return NextResponse.json(
        { message: "Le module spécifié n'existe pas" },
        { status: 404 }
      );
    }

    if (existingAssociation) {
      return NextResponse.json(
        {
          message: "Ce module est déjà associé à cette filière",
          data: existingAssociation,
        },
        { status: 409 }
      );
    }

    // Création de l'association
    const filiereModule = await prisma.filiereModule.create({
      data: {
        id_filiere,
        id_module,
        volume_horaire: volume_horaire ? parseInt(volume_horaire) : null,
        code_module,
        coefficient: coefficient ? parseInt(coefficient) : 1,
        syllabus: syllabus || null,
      },
      include: {
        module: true,
        filiere: true,
      },
    });

    return NextResponse.json(
      {
        message: "Association filière-module créée avec succès",
        data: {
          id_filiere_module: filiereModule.id_filiere_module,
          module: {
            id_module: filiereModule.module.id_module,
            nom: filiereModule.module.nom,
            description: filiereModule.module.description,
          },
          coefficient: filiereModule.coefficient,
          volume_horaire: filiereModule.volume_horaire,
          code_module: filiereModule.code_module,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'association:", error);

    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de la création",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }

}