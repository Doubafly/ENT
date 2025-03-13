import prisma from "@/app/api/prisma";
export async function GET( request: Request,{ params }: { params: { id: string } }) {
  try {
    const utilisateurs = await prisma.utilisateurs.findMany({
      where: {
        id_utilisateur: parseInt(params.id),
        type: "Admin",
      },
    });
    return new Response(JSON.stringify(utilisateurs), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

export async function PUT( req: Request, { params }: { params: { id: string } }) {
  const { nom, prenom, email, sexe, mot_de_passe, telephone, adresse, profil } =
    await req.json();
  try {
    await prisma.utilisateurs.update({
      where: {
        id_utilisateur: parseInt(params.id),
      },
      data: {
        nom,
        prenom,
        email,
        sexe,
        mot_de_passe,
        telephone,
        adresse,
        profil,
        type: "Admin",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}
