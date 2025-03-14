import prisma from "../prisma";

// Récupération de tous les cours : GET /api/cours
export async function GET() {
  try {
    const cours = await prisma.cours.findMany({
      include: {
        filiere_module: true,
        sessions: true,
        enseignant: true,
      },
    });
    return new Response(JSON.stringify(cours), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

// Création d'un cours : POST /api/cours
export async function POST(request: Request) {
  try {
    const { id_filiere_module, id_professeur, id_sessions, semestre } = await request.json();

    if (!id_filiere_module || !id_professeur || !id_sessions || !semestre) {
      return new Response(
        JSON.stringify({ message: "Tous les champs sont obligatoires" }),
        { status: 400 }
      );
    }

    const cours = await prisma.cours.create({
      data: {
        id_filiere_module,
        id_professeur,
        id_sessions,
        semestre,
      },
    });

    return new Response(JSON.stringify(cours), { status: 201 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}