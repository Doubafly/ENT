import prisma from "@/app/api/prisma";

// Récupération par Id : GET /api/sessions/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await prisma.sessions.findUnique({
      where: { id_sessions: parseInt(params.id) },
    });

    if (!session) {
      return new Response(
        JSON.stringify({ message: "Session introuvable" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(session), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}





// Mise à jour par id : PUT /api/sessions/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { annee_academique } = await req.json();

    if (!annee_academique) {
      return new Response(
        JSON.stringify({ message: "L'année académique est obligatoire" }),
        { status: 400 }
      );
    }

    const session = await prisma.sessions.update({
      where: { id_sessions: parseInt(params.id) },
      data: {
        annee_academique,
      },
    });

    return new Response(JSON.stringify(session), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

// Suppression par id : DELETE /api/sessions/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.sessions.delete({
      where: { id_sessions: parseInt(params.id) },
    });

    return new Response(
      JSON.stringify({ message: "Session supprimée" }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}
