import prisma from "../prisma";

// Récupération des sessions (toutes ou par année académique) : GET /api/sessions ou GET /api/sessions?annee_academique=2024-2025
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const annee_academique = searchParams.get("annee_academique");

    let sessions;

    if (annee_academique) {
      // Filtrer par année académique
      sessions = await prisma.sessions.findMany({
        where: { annee_academique },
      });
    } else {
      // Récupérer toutes les sessions
      sessions = await prisma.sessions.findMany();
    }

    return new Response(JSON.stringify(sessions), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

// Création d'une session académique : POST /api/sessions
export async function POST(request: Request) {
  try {
    const { annee_academique } = await request.json();

    // Vérification des données
    if (!annee_academique) {
      return new Response(
        JSON.stringify({ message: "L'année académique est obligatoire" }),
        { status: 400 }
      );
    }

    const session = await prisma.sessions.create({
      data: { annee_academique },
    });

    return new Response(JSON.stringify(session), { status: 201 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}
