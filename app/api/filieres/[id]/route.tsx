import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { id_filiere, nom, description, niveau, montant_annuel, id_annexe } =
      await request.json();
    if (
      !id_filiere ||
      !nom ||
      !description ||
      !niveau ||
      !montant_annuel ||
      !id_annexe
    ) {
      return new Response(JSON.stringify({ message: "Paramètres manquants" }), {
        status: 400,
      });
    }
    const filiere = await prisma.filieres.update({
      where: { id_filiere: id_filiere },
      data: {
        nom,
        description,
        niveau,
        montant_annuel,
        id_annexe,
      },
    });
    return new Response(JSON.stringify({ message: "succes", filiere }), {
      status: 200,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id_filiere } = await request.json();
    if (!id_filiere) {
      return new Response(JSON.stringify({ message: "Paramètres manquants" }), {
        status: 400,
      });
    }
    await prisma.filieres.delete({
      where: { id_filiere: id_filiere },
    });
    return new Response(JSON.stringify({ message: "succes" }), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filieres = await prisma.filieres.findMany({
      where: { id_filiere: parseInt(params.id) },
      include: {
        filiere_module: {
          include: {
            module: true,
          },
        },
      },
    });

    if (!filieres || filieres.length === 0) {
      return new Response(
        JSON.stringify({ message: "Aucune filiere trouvée" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ message: "succes", filieres }), {
      status: 200,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}
