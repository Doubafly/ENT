import prisma from "@/app/api/prisma";

export async function GET( request: Request, { params }: { params: { id: string } }) {
  try {
    const annexe = await prisma.annexes.findUnique({
      where: { id_annexe: parseInt(params.id) },
    });

    if (!annexe) {
      return new Response(
        JSON.stringify({ message: "Annexe introuvable" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(annexe), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

export async function PUT( req: Request, { params }: { params: { id: string } }) {
  const { nom, adresse, ville, region } = await req.json();

  try {
    const annexe = await prisma.annexes.update({
      where: { id_annexe: parseInt(params.id) },
      data: {
        nom,
        adresse,
        ville,
        region,
      },
    });

    return new Response(JSON.stringify(annexe), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

export async function DELETE( request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.annexes.delete({
      where: { id_annexe: parseInt(params.id) },
    });

    return new Response(
      JSON.stringify({ message: "Annexe supprimée" }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}
