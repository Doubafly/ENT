import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { nom, description } = await request.json();
    const id = request.nextUrl.pathname.split("/").pop();
    if (!nom || !description) {
      return NextResponse.json(
        { message: "Paramètres manquants" },
        {
          status: 400,
        }
      );
    }
    const module = await prisma.modules.update({
      where: { id_module: id ? parseInt(id) : 0 },
      data: {
        nom,
        description,
      },
    });
    return NextResponse.json(
      { message: "succes", module },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id_module } = await request.json();
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id_module) {
      return NextResponse.json(
        { message: "Paramètres manquants" },
        {
          status: 400,
        }
      );
    }
    await prisma.modules.delete({
      where: { id_module: id ? parseInt(id) : 0 },
    });
    return NextResponse.json({ message: "succes" }), { status: 200 };
  } catch (error) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
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
