import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return  NextResponse.json({ message: "ID manquant" }, {
      status: 400,
    });
  }
  try {
    const filiereModule = await prisma.filiereModule.findMany({
      where: { id_filiere_module: parseInt(id) },
      include: {
        module: {
          select: {
            nom: true,
            description: true, 
            id_module: true,
          },
        }, 
        filiere: {
          select: {
            nom: true,
            description: true,
            montant_annuel: true,
            niveau: true,
            id_filiere: true,
          }, 
        },
      },
    });

    if (!filiereModule || filiereModule.length === 0) {
      return  NextResponse.json({ message: "Aucun module trouvé" }, {
        status: 404,
      });
    }

    return  NextResponse.json({ message: "succes", filiereModule }, {
      status: 200,
    });
  } catch (e) {
    return  NextResponse.json({ message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const body = await request.json();
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "ID invalide ou manquant" },
        { status: 400 }
      );
    }

    const updated = await prisma.filiereModule.update({
      where: { id_filiere_module: parseInt(id) },
      data: body,
    });

    return NextResponse.json(
      { message: "Association mise à jour", filiere_module: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id_filiere_module } = await request.json();
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id_filiere_module) {
      return  NextResponse.json({ message: "Paramètres manquants" }, {
        status: 400,
      });
    }
    await prisma.filiereModule.delete({
      where: { id_filiere_module: id ? parseInt(id) : 0 },
    });
    return  NextResponse.json({ message: "succes" }, { status: 200 });
  } catch (e) {
    return  NextResponse.json({ message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
