import { NextRequest } from "next/server";
import prisma from "../prisma";

export async function GET() {
  try {
    const modules = await prisma.modules.findMany({
      include: {
        filiere_module: {
          include: {
            filiere: true,
          },
        },
      },
    });
    return new Response(JSON.stringify({ message: "succes", modules }), {
      status: 200,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nom, description } = await request.json();
    if (!nom || !description) {
      return new Response(JSON.stringify({ message: "Paramètres manquants" }), {
        status: 400,
      });
    }
    const module = await prisma.modules.create({
      data: {
        nom,
        description,
      },
    });
    return new Response(JSON.stringify({ message: "succes", module }), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}
