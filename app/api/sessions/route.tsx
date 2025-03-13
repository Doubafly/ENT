import prisma from "../prisma";

// Récupération de toutes les sessions académiques : GET /api/sessions
export async function GET() {
  try {
    const sessions = await prisma.sessions.findMany();
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
      data: {
        annee_academique,
      },
    });

    return new Response(JSON.stringify(session), { status: 201 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}
