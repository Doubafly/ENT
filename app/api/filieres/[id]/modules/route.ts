import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filiereId = parseInt(params.id);
    if (isNaN(filiereId)) {
      return NextResponse.json(
        { message: "ID de filière invalide" },
        { status: 400 }
      );
    }

    const filiereExists = await prisma.filieres.findUnique({
      where: { id_filiere: filiereId },
    });

    if (!filiereExists) {
      return NextResponse.json(
        { message: "Filière non trouvée" },
        { status: 404 }
      );
    }

    const [enseignantsResponse, filiereModules] = await Promise.all([
      fetch(`${process.env.NEXTAUTH_URL}/api/utilisateurs/enseignants`),
      prisma.filiereModule.findMany({
        where: { id_filiere: filiereId },
        include: {
          module: true,
          cours: {
            include: {
              sessions: true,
              enseignant: {
                include: {
                  utilisateur: true,
                },
              },
            },
          },
        },
      }),
    ]);

    if (!enseignantsResponse.ok) {
      throw new Error("Erreur lors de la récupération des enseignants");
    }

    const enseignantsData = await enseignantsResponse.json();

    const response = {
      filiere: {
        id: filiereExists.id_filiere,
        nom: filiereExists.nom,
        niveau: filiereExists.niveau,
      },
      modules: filiereModules.map((fm) => ({
        id_filiere_module: fm.id_filiere_module,
        module: {
          id_module: fm.module.id_module,
          nom: fm.module.nom,
          description: fm.module.description || undefined,
        },
        coefficient: fm.coefficient,
        volume_horaire: fm.volume_horaire || undefined,
        code_module: fm.code_module,
        cours: fm.cours.map((c) => ({
          id_cours: c.id_cours,
          semestre: c.semestre,
          sessions: {
            id_sessions: c.sessions.id_sessions,
            annee_academique: c.sessions.annee_academique,
          },
          enseignant: {
            id: c.enseignant.id,
            nom: c.enseignant.utilisateur.nom,
            prenom: c.enseignant.utilisateur.prenom,
          },
        })),
      })),
      enseignants: enseignantsData.utilisateurs.map((e: any) => ({
        id: e.id,
        nom: e.utilisateur.nom,
        prenom: e.utilisateur.prenom,
        specialite: e.specialite,
      })),
    };

    return NextResponse.json(
      { message: "Données récupérées avec succès", data: response },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error fetching data:", e);
    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de la récupération des données",
      },
      { status: 500 }
    );
  }
}
