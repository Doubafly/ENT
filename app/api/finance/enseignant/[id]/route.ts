import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Récupère toutes les transactions d'un enseignant
export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier que l'ID est valide
    const enseignantId = Number(params.id);
    console.log("Paramètre reçu :", enseignantId);
    if (isNaN(enseignantId)) {
      return NextResponse.json(
        { message: "ID enseignant invalide" },
        { status: 400 }
      );
    }

    // Récupérer les transactions avec les relations nécessaires
    const transactions = await prisma.finance.findMany({
      where: { 
        id_enseignant: enseignantId,
        // Vous pourriez ajouter d'autres filtres ici si nécessaire
      },
      include: {
        utilisateur: { 
          select: { 
            nom: true, 
            prenom: true 
          } 
        },
        // Autres relations si nécessaires
      },
      orderBy: {
        date_transaction: 'desc' // Plus récent en premier
      }
    });

    return NextResponse.json({ transactions });
  } catch (e) {
    console.error("Erreur GET /finance/enseignant/[id]:", e);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}