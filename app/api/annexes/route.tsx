import prisma from "../prisma";

// Récupération de toutes les annexes:: GET /api/annexes
export async function GET() {
  try {
    const annexes = await prisma.annexes.findMany();
    return new Response(JSON.stringify(annexes), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}


// Création d'une annexe :POST /api/annexes
export async function POST(request: Request) {
  try {
    const { nom, adresse, ville, region } = await request.json();

    if (!nom || !adresse) {
      return new Response(
        JSON.stringify({ message: "Nom et adresse sont obligatoires" }),
        { status: 400 }
      );
    }

    const annexe = await prisma.annexes.create({
      data: {
        nom,
        adresse,
        ville,
        region,
      },
    });

    return new Response(JSON.stringify(annexe), { status: 201 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}
