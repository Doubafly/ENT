import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const { nom, description, filiere_module } = await request.json();
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "ID invalide ou manquant" },
        { status: 400 }
      );
    }

    // Mettre à jour le module et ses associations en une transaction
    const updatedModule = await prisma.$transaction(async (prisma) => {
      // 1. Mettre à jour le module
      const module = await prisma.modules.update({
        where: { id_module: parseInt(id) },
        data: { nom, description },
      });

      // 2. Mettre à jour les associations
      if (filiere_module && filiere_module.length > 0) {
        await Promise.all(
          filiere_module.map((fm: any) =>
            prisma.filiereModule.update({
              where: { id_filiere_module: fm.id_filiere_module },
              data: {
                code_module: fm.code_module,
                volume_horaire: fm.volume_horaire,
                // coefficient: fm.coefficient, // Removed as it does not exist in the Prisma schema
                syllabus: fm.syllabus,
                id_filiere: fm.id_filiere,
              },
            })
          )
        );
      }

      return module;
    });

    return NextResponse.json(
      { message: "Module modifié avec succès", module: updatedModule },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la modification:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la modification" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "ID invalide ou manquant" },
        { status: 400 }
      );
    }

    // Suppression en transaction
    await prisma.$transaction(async (prisma) => {
      // 1. Supprimer les associations
      await prisma.filiereModule.deleteMany({
        where: { id_module: parseInt(id) },
      });

      // 2. Supprimer le module
      await prisma.modules.delete({
        where: { id_module: parseInt(id) },
      });
    });

    return NextResponse.json(
      { message: "Module supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la suppression" },
      { status: 500 }
    );
  }
}
 
export async function GET(request: NextRequest) {
  // Récupère l'ID depuis l'URL
  const id = request.nextUrl.pathname.split("/").pop();

  // Verifie si l'id est valide
  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json(
      { message: "id invalide ou manquant" },
      { status: 400 }
    );
  }

  try {
    const module = await prisma.modules.findUnique({
      where: { id_module: parseInt(id) },
      include: {
        filiere_module: {
          include: {
            filiere: {
              select: {
                nom: true,
                niveau: true,
                montant_annuel: true,
              },
            },
          },
        },
      },
    });

    if (!module) {
      return NextResponse.json(
        { message: "Module non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Succès", module }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du module :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
