import prisma from "@/app/api/prisma";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const utilisateurs = await prisma.etudiants.findMany({
      where: {
        id: parseInt(params.id),
      },
      include: {
        utilisateur: true,
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
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const {
    nom,
    prenom,
    email,
    sexe,
    mot_de_passe,
    telephone,
    adresse,
    profil,
    matricule,
    date_naissance,
    date_inscription,
    id_filiere,
  } = await req.json();
  try {
    const updatedEtudiant = await prisma.etudiants.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        matricule,
        date_naissance,
        date_inscription,
        id_filiere,
        utilisateur: {
          update: {
            nom,
            prenom,
            email,
            sexe,
            mot_de_passe,
            telephone,
            adresse,
            profil,
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        message: "Etudiant modifié avec succèss",
        updatedEtudiant,
      }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Une erreur est survenue" }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const enseignant = await prisma.etudiants.findUnique({
      where: { id: parseInt(params.id) },
      include: { utilisateur: true }, // Récupère l'utilisateur lié
    });

    if (!enseignant) {
      return new Response(
        JSON.stringify({ message: "Enseignant non trouvé" }),
        { status: 404 }
      );
    }

    // Supprime l'enseignant
    await prisma.etudiants.delete({
      where: { id: enseignant.id },
    });

    // Supprime l'utilisateur lié si l'enseignant a un utilisateur
    if (enseignant.utilisateur) {
      await prisma.utilisateurs.delete({
        where: { id_utilisateur: enseignant.utilisateur.id_utilisateur },
      });
    }

    return new Response(
      JSON.stringify({ message: "Enseignant et utilisateur supprimés" }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Erreur lors de la suppression :", error);
    return new Response(
      JSON.stringify({
        message: "Une erreur est survenue",
        erreur: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
