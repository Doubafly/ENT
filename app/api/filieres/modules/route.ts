import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
) {
  try {
 
    // Récupérer les données en parallèle
    const [enseignantsResponse, allModules, allsession] = await Promise.all(
      [
        fetch(`${process.env.NEXTAUTH_URL}/api/utilisateurs/enseignants`),
        prisma.modules.findMany(), // Tous les modules disponibles
        prisma.sessions.findMany(),
      ]
    );

    if (!enseignantsResponse.ok) {
      throw new Error("Erreur lors de la récupération des enseignants");
    }

    const enseignantsData = await enseignantsResponse.json();

    // Formater la réponse
    const response = {
     
      enseignants: enseignantsData.utilisateurs.map((e: any) => ({
        id: e.id,
        nom: e.utilisateur.nom,
        prenom: e.utilisateur.prenom,
        specialite: e.specialite,
      })),
      allModules: allModules.map((m) => ({
        id_module: m.id_module,
        nom: m.nom,
        description: m.description || undefined,
      })),
      allsession:allsession,
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
        error: e instanceof Error ? e.message : "Erreur inconnue",

      },
      { status: 500 }
    );
  }
}
