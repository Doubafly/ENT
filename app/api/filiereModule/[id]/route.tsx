import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return new Response(JSON.stringify({ message: "ID manquant" }), {
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
      return new Response(JSON.stringify({ message: "Aucun module trouvé" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "succes", filiereModule }), {
      status: 200,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      id_filiere_module,
      syllabus,
      id_module,
      id_filiere,
      code_module,
      volume_horaire,
    } = await request.json();
    if (
      !id_filiere_module ||
      !syllabus ||
      !id_module ||
      !id_filiere ||
      !code_module ||
      !volume_horaire
    ) {
      return new Response(JSON.stringify({ message: "Paramètres manquants" }), {
        status: 400,
      });
    }
    const filiereModule = await prisma.filiereModule.update({
      where: { id_filiere_module: id_filiere_module },
      data: {
        syllabus,
        id_module,
        id_filiere,
        code_module,
        volume_horaire,
      },
    });
    return new Response(JSON.stringify({ message: "succes", filiereModule }), {
      status: 200,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id_filiere_module } = await request.json();
    if (!id_filiere_module) {
      return new Response(JSON.stringify({ message: "Paramètres manquants" }), {
        status: 400,
      });
    }
    await prisma.filiereModule.delete({
      where: { id_filiere_module: id_filiere_module },
    });
    return new Response(JSON.stringify({ message: "succes" }), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}
