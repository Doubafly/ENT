import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { id_module, nom, description } = await request.json();
    if (!id_module || !nom || !description) {
      return new Response(JSON.stringify({ message: "Paramètres manquants" }), {
        status: 400,
      });
    }
    const module = await prisma.modules.update({
      where: { id_module: id_module },
      data: {
        nom,
        description,
      },
    });
    return new Response(JSON.stringify({ message: "succes", module }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id_module } = await request.json();
    if (!id_module) {
      return new Response(JSON.stringify({ message: "Paramètres manquants" }), {
        status: 400,
      });
    }
    await prisma.modules.delete({
      where: { id_module: id_module },
    });
    return new Response(JSON.stringify({ message: "succes" }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const modules = await prisma.modules.findMany({
      where: { id_module: parseInt(params.id) },
    });

    if (!modules || modules.length === 0) {
      return new Response(JSON.stringify({ message: "Aucun module trouvé" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "succes", modules }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}
