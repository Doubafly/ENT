import prisma from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { nom, description, niveau, montant_annuel, id_annexe } =
      await request.json();
    const id = request.nextUrl.pathname.split("/").pop();
    if (!nom || !description || !niveau || !montant_annuel || !id_annexe) {
      return NextResponse.json(
        { message: "Paramètres manquants" },
        {
          status: 400,
        }
      );
    } 
    const filiere = await prisma.filieres.update({
      where: { id_filiere: id ? parseInt(id) : 0 },
      data: {
        nom, 
        description,
        niveau,
        montant_annuel,
        id_annexe,
      },
    });
    return NextResponse.json({ message: "Succès", filiere }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { message: "Paramètres manquants" },
        {
          status: 400,
        } 
      );
    }
    await prisma.filieres.delete({
      where: { id_filiere: id ? parseInt(id) : 0 },
    });
    return NextResponse.json({ message: "succes" }), { status: 200 };
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    const filieres = await prisma.filieres.findMany({
      where: { id_filiere: id ? parseInt(id) : 0 },
      include: {
        filiere_module: {
          include: {
            module: {
              select: {
                nom: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!filieres || filieres.length === 0) {
      return NextResponse.json(
        { message: "Aucune filiere trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "succes", filieres },
      {
        status: 200,
      }
    ); 
  } catch (e) {
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
