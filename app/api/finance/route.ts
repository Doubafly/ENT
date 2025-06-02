import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";

// Récupérer toutes les transactions financières
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id_etudiant = searchParams.get('id_etudiant');
    const id_enseignant = searchParams.get('id_enseignant');

    const whereClause: any = {};

    if (id_etudiant) whereClause.id_etudiant = Number(id_etudiant);
    if (id_enseignant) whereClause.id_enseignant = Number(id_enseignant);

    const finances = await prisma.finance.findMany({
      where: whereClause,
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
      },
      orderBy: {
        date_transaction: 'desc'
      }
    });

    return NextResponse.json(
      { message: "Liste des transactions récupérée avec succès", finances },
      { status: 200 }
    );

  } catch (e: any) {
    console.error("Erreur GET /finance :", e);
    return NextResponse.json(
      { message: "Erreur serveur", error: e.message },
      { status: 500 }
    );
  }
}

// Ajouter une nouvelle transaction financière




export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      type_transaction,
      montant,
      description,
      mode_paiement,
      reference,
      statut,
      id_utilisateur,
      id_etudiant,
      id_enseignant
    } = body;

    if (!type_transaction || !montant || !id_utilisateur) {
      return NextResponse.json(
        { message: "Champs obligatoires manquants : type_transaction, montant, id_utilisateur" },
        { status: 400 }
      );
    }

    // Un seul des deux : id_etudiant ou id_enseignant
      if (body.id_etudiant && body.id_enseignant) {
      return NextResponse.json(
        { message: "Spécifiez soit un étudiant, soit un enseignant, pas les deux" },
        { status: 400 }
      );
    }

    const utilisateur = await prisma.utilisateurs.findUnique({
      where: { id_utilisateur: Number(id_utilisateur) }
    });

    if (!utilisateur) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
    }

    if (id_etudiant) {
      const etudiant = await prisma.etudiants.findUnique({ where: { id: Number(id_etudiant) } });
      if (!etudiant) {
        return NextResponse.json({ message: "Étudiant non trouvé" }, { status: 404 });
      }
    }

    if (id_enseignant) {
      const enseignant = await prisma.enseignants.findUnique({ where: { id: Number(id_enseignant) } });
      if (!enseignant) {
        return NextResponse.json({ message: "Enseignant non trouvé" }, { status: 404 });
      }
    }

    const transaction = await prisma.finance.create({
      data: {
        type_transaction,
        montant: new Decimal(montant),
        description: description || "",
        mode_paiement: mode_paiement || "Espèces",
        reference: reference || `REF-${Date.now()}`,
        statut: statut || "Valide",
        id_utilisateur: Number(id_utilisateur),
        id_etudiant: id_etudiant ? Number(id_etudiant) : undefined,
        id_enseignant: id_enseignant ? Number(id_enseignant) : undefined
      },
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

    return NextResponse.json(
      { message: "Transaction enregistrée avec succès", transaction },
      { status: 201 }
    );

  } catch (e: any) {
    console.error("Erreur POST /finance :", e);
    return NextResponse.json(
      {
        message: "Échec de l'enregistrement",
        error: e.message,
        code: e.code || null
      },
      { status: 500 }
    );
  }
}
// DELETE: Supprime des transactions selon différents critères
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const option = searchParams.get('option');
    
    let where = {};
    
    if (option === 'filtered') {
      const filterMode = searchParams.get('filterMode');
      const filterType = searchParams.get('filterType');
      const dateDebut = searchParams.get('dateDebut');
      const dateFin = searchParams.get('dateFin');

      where = {
        ...(filterMode && filterMode !== 'Tous' && { mode_paiement: filterMode }),
        ...(filterType && filterType !== 'Tous' && { type_transaction: filterType }),
        ...(dateDebut && dateFin && {
          date_transaction: {
            gte: new Date(dateDebut),
            lte: new Date(dateFin)
          }
        })
      };
    } else if (option === 'date') {
      const dateDebut = searchParams.get('dateDebut');
      const dateFin = searchParams.get('dateFin');

      if (!dateDebut || !dateFin) {
        return NextResponse.json(
          { message: 'Les dates sont requises' },
          { status: 400 }
        );
      }

      where = {
        date_transaction: {
          gte: new Date(dateDebut),
          lte: new Date(dateFin)
        }
      };
    }

    const { count } = await prisma.finance.deleteMany({
      where
    });

    return NextResponse.json(
      { message: `${count} transactions supprimées`, count },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur suppression:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}