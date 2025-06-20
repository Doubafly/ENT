import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Récupère une transaction spécifique
export async function GET(request: NextRequest) {

  const id = request.nextUrl.pathname.split("/").pop();
  try {
    const transaction = await prisma.finance.findUnique({
      where: { id_finance :id ? parseInt(id) : 0  },
      include: {
        utilisateur: { select: { nom: true, prenom: true } },
        etudiant: {
          select: {
            matricule: true,
            utilisateur: { select: { nom: true, prenom: true } }
          }
        },
        enseignant: {
          select: {
            matricule: true,
            utilisateur: { select: { nom: true, prenom: true } }
          }
        }
      }
    });

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ transaction });
  } catch (e) {
    console.error("Erreur GET /finance/[id]:", e);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT: Met à jour une transaction spécifique
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    
    const transaction = await prisma.finance.update({
      where: { id_finance: Number(params.id) },
      data: {
        type_transaction: body.type_transaction,
        montant: body.montant,
        description: body.description,
        mode_paiement: body.mode_paiement,
        reference: body.reference,
        statut: body.statut
      }
    });

    return NextResponse.json(
      { transaction, message: "Transaction mise à jour" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Erreur PUT /finance/[id]:", e);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

// DELETE: Supprime une transaction spécifique
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.finance.delete({
      where: { id_finance: Number(params.id) }
    });

    return NextResponse.json(
      { message: "Transaction supprimée avec succès" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Erreur DELETE /finance/[id]:", e);
    return NextResponse.json(
      { message: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}