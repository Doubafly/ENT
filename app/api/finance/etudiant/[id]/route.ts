import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const etudiantId = Number(params.id);
    console.log("ID étudiant reçu :", etudiantId);

    if (isNaN(etudiantId)) {
      return NextResponse.json(
        { message: "ID étudiant invalide" },
        { status: 400 }
      );
    }

    // Vérifie si l'étudiant existe
    const etudiant = await prisma.etudiants.findUnique({
      where: { id: etudiantId },
    });

    if (!etudiant) {
      return NextResponse.json(
        { message: "Étudiant non trouvé" },
        { status: 404 }
      );
    }

    // Récupère les transactions de cet étudiant
    const transactions = await prisma.finance.findMany({
      where: {
        id_etudiant: etudiantId,
      },
      include: {
        utilisateur: {
          select: {
            nom: true,
            prenom: true,
          },
        },
        etudiant:{
          select:{
            filiere:{
              select:{
                montant_annuel:true,
              }
            }
          }
        }
      },
      orderBy: {
        date_transaction: "desc",
      },
    });

    return NextResponse.json({ transactions });
  } catch (e) {
    console.error("Erreur GET /finance/etudiant/[id]:", e);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
