import prisma from "../../prisma";

export async function GET() {
  try {
    const utilisateurs = await prisma.utilisateurs.findMany({
      where: {
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

export async function POST(request: Request) {
  try {
    const {
      nom,
      prenom,
      email,
      sexe,
      mot_de_passe,
      telephone,
      adresse,
      profil,
      permissions, // [1, 2, 3] la liste des permissions c'est bizarre je sais
    } = await request.json();
    if (
      !nom ||
      !prenom ||
      !email ||
      !sexe ||
      !mot_de_passe ||
      !telephone ||
      !adresse ||
      !profil ||
      !permissions
    ) {
      return new Response(
        JSON.stringify({ message: "Veuillez remplir tous les champs" }),
        { status: 400 }
      );
    }

    const utilisateur = await prisma.utilisateurs.create({
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

    await prisma.admin.create({
      data: {
        id_utilisateur: utilisateur.id_utilisateur,
        permissions: {
          create: permissions.map((permissionId: number) => ({
            id_permission: permissionId,
          })),
        },
      },
    });

    return new Response(JSON.stringify(utilisateur), { status: 201 });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}
