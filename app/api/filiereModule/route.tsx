import { NextRequest,NextResponse } from "next/server";
import prisma from "../prisma";

export async function GET() {
  try {
    const filiereModules = await prisma.filiereModule.findMany({
      include: {
        filiere: {
          select: {
            nom: true,
            niveau: true,
            montant_annuel: true,
            annexe: {
              select: { nom: true }
            }
          },
        },
        module: {
          select: {
            nom: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Succes", filiereModules },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la recuperation des FiliereModules :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue"},
      { status: 500 }
    );
  }
} 


export async function POST(request: Request) {
  try {
    const { id_module, id_filiere, code_module, volume_horaire, syllabus } = await request.json();

    if (!id_module || !id_filiere || !code_module) {
      return NextResponse.json(
        { message: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const filiereModule = await prisma.filiereModule.create({
      data: {
        syllabus,
        volume_horaire,
        code_module,
        module: {
          connect: { id_module: id_module },
        },
        filiere: {
          connect: { id_filiere: id_filiere },
        },
      },
    });

    return NextResponse.json(
      { message: "success", filiereModule },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
