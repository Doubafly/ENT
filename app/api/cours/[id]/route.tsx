import prisma from "@/app/api/prisma";

// Récupération de tous les cours : GET /api/cours
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cours = await prisma.cours.findUnique({
      where: { id_cours: parseInt(params.id) },
      include: {
        filiere_module: true,
        sessions: true,
        enseignant: true,
      },
    });

    if (!cours) {
      return new Response(
        JSON.stringify({ message: "Cours introuvable" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(cours), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}



// Mise à jour d'un cours par ID : PUT /api/cours/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id_filiere_module, id_professeur, id_sessions, semestre } = await request.json();

    const cours = await prisma.cours.update({
      where: { id_cours: parseInt(params.id) },
      data: {
        id_filiere_module,
        id_professeur,
        id_sessions,
        semestre,
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

// Suppression d'un cours par ID : DELETE /api/cours/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.cours.delete({
      where: { id_cours: parseInt(params.id) },
    });

    return new Response(
      JSON.stringify({ message: "Cours supprimé" }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}
