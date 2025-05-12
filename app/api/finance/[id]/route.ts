import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prisma";

interface Params {
  params: { id: string };
}

// GET : Récupérer une transaction par ID
export async function GET(request: NextRequest, { params }: Params) {
  const id = parseInt(params.id);

  try {
    const transaction = await prisma.finance.findUnique({
      where: { id_finance: id },
      include: {
        utilisateur: {
          select: {
            nom: true,
            prenom: true
          }
        },
        etudiant: {
          select: {
            matricule: true,
            utilisateur: {
              select: {
                nom: true,
                prenom: true
              }
            }
          }
        },
        enseignant: {
          select: {
            matricule: true,
            utilisateur: {
              select: {
                nom: true,
                prenom: true
              }
            }
          }
        }
      }
    });

    if (!transaction) {
      return NextResponse.json({ message: "Transaction non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Succès", transaction }, { status: 200 });
  } catch (e) {
    console.error("Erreur GET transaction :", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// PUT : Modifier une transaction
export async function PUT(request: NextRequest, { params }: Params) {
  const id = parseInt(params.id);
  const { 
    type_transaction, 
    montant, 
    description, 
    mode_paiement, 
    reference,
    statut
  } = await request.json();

  try {
    const transactionModifiee = await prisma.finance.update({
      where: { id_finance: id },
      data: { 
        type_transaction,
        montant,
        description,
        mode_paiement,
        reference,
        statut
      }
    });

    return NextResponse.json(
      { message: "Transaction modifiée avec succès", transaction: transactionModifiee },
      { status: 200 }
    );
  } catch (e) {
    console.error("Erreur PUT transaction :", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE : Supprimer une transaction
export async function DELETE(request: NextRequest, { params }: Params) {
  const id = parseInt(params.id);

  try {
    await prisma.finance.delete({
      where: { id_finance: id }
    });

    return NextResponse.json({ message: "Transaction supprimée" }, { status: 200 });
  } catch (e) {
    console.error("Erreur DELETE transaction :", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}