import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";
import { FilieresNiveau } from "@prisma/client";

// GET : Récupérer toutes les filières ou une seule si ID fourni
export async function GET(request: NextRequest) {
  try {
    // Récupération de l'ID depuis les paramètres de la route
    const pathParts = request.nextUrl.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    // Si le dernier élément est "filieres", c'est qu'on veut toutes les filières
    const isSingleFiliere = id !== "filieres" && !isNaN(parseInt(id));

    const filieres = await prisma.filieres.findMany({
      where: isSingleFiliere ? { id_filiere: parseInt(id) } : {},
      include: {
        annexe: true,
        etudiants: {
          include: {
            utilisateur: {
              select: {
                nom: true,
                prenom: true,
                email: true
              }
            }
          }
        },
        filiere_module: {
          include: {
            module: true,
            cours: {
              include: {
                enseignant: {
                  include: {
                    utilisateur: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (isSingleFiliere && (!filieres || filieres.length === 0)) {
      return NextResponse.json(
        { message: "Filière non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: isSingleFiliere ? "Filière récupérée" : "Filières récupérées", 
        data: isSingleFiliere ? filieres[0] : filieres 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}

// POST : Créer une nouvelle filière avec validation complète
export async function POST(request: NextRequest) {
  try {
    const { nom, description, niveau, montant_annuel, id_annexe } = await request.json();

    // Validation renforcée
    if (!nom || !niveau || montant_annuel === undefined) {
      return NextResponse.json(
        { message: "Nom, niveau et montant sont obligatoires" },
        { status: 400 }
      );
    }

    if (!Object.values(FilieresNiveau).includes(niveau)) {
      return NextResponse.json(
        { message: "Niveau de filière invalide" },
        { status: 400 }
      );
    }

    // Vérification de l'unicité
    const filiereExistante = await prisma.filieres.findFirst({ where: { nom } });
    if (filiereExistante) {
      return NextResponse.json(
        { message: "Une filière avec ce nom existe déjà" },
        { status: 409 }
      );
    }

    // Vérification de l'annexe si fournie
    if (id_annexe) {
      const annexeExistante = await prisma.annexes.findUnique({ where: { id_annexe } });
      if (!annexeExistante) {
        return NextResponse.json(
          { message: "L'annexe spécifiée n'existe pas" },
          { status: 404 }
        );
      }
    }

    // Création avec gestion des valeurs par défaut
    const nouvelleFiliere = await prisma.filieres.create({
      data: {
        nom,
        description: description || null,
        niveau,
        montant_annuel,
        id_annexe: id_annexe || null
      },
      include: {
        annexe: true
      }
    });

    return NextResponse.json(
      { message: "Filière créée avec succès", data: nouvelleFiliere },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}

// PUT : Mettre à jour une filière existante
export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const { nom, description, niveau, montant_annuel, id_annexe } = await request.json();

    // Validation de base
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "ID de filière invalide" },
        { status: 400 }
      );
    }

    // Vérification de l'existence
    const filiereExistante = await prisma.filieres.findUnique({
      where: { id_filiere: parseInt(id) }
    });

    if (!filiereExistante) {
      return NextResponse.json(
        { message: "Filière non trouvée" },
        { status: 404 }
      );
    }

    // Vérification de l'unicité si le nom change
    if (nom && nom !== filiereExistante.nom) {
      const nomDejaUtilise = await prisma.filieres.findFirst({
        where: { nom, NOT: { id_filiere: parseInt(id) } }
      });
      if (nomDejaUtilise) {
        return NextResponse.json(
          { message: "Une autre filière utilise déjà ce nom" },
          { status: 409 }
        );
      }
    }

    // Vérification de l'annexe
    if (id_annexe) {
      const annexeExistante = await prisma.annexes.findUnique({
        where: { id_annexe }
      });
      if (!annexeExistante) {
        return NextResponse.json(
          { message: "L'annexe spécifiée n'existe pas" },
          { status: 404 }
        );
      }
    }

    // Mise à jour
    const filiereMaj = await prisma.filieres.update({
      where: { id_filiere: parseInt(id) },
      data: {
        nom: nom || filiereExistante.nom,
        description: description !== undefined ? description : filiereExistante.description,
        niveau: niveau || filiereExistante.niveau,
        montant_annuel: montant_annuel !== undefined ? montant_annuel : filiereExistante.montant_annuel,
        id_annexe: id_annexe !== undefined ? id_annexe : filiereExistante.id_annexe
      },
      include: {
        annexe: true
      }
    });

    return NextResponse.json(
      { message: "Filière mise à jour", data: filiereMaj },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE : Supprimer une filière avec vérification des dépendances
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();

    // Validation de l'ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "ID de filière invalide" },
        { status: 400 }
      );
    }

    // Vérification de l'existence
    const filiereExistante = await prisma.filieres.findUnique({
      where: { id_filiere: parseInt(id) },
      include: {
        etudiants: { select: { id: true } },
        filiere_module: { select: { id_filiere_module: true } }
      }
    });

    if (!filiereExistante) {
      return NextResponse.json(
        { message: "Filière non trouvée" },
        { status: 404 }
      );
    }

    // Vérification des dépendances
    if (filiereExistante.etudiants.length > 0) {
      return NextResponse.json(
        { 
          message: "Impossible de supprimer: des étudiants sont inscrits",
          count: filiereExistante.etudiants.length
        },
        { status: 400 }
      );
    }

    if (filiereExistante.filiere_module.length > 0) {
      return NextResponse.json(
        { 
          message: "Impossible de supprimer: des modules sont associés",
          count: filiereExistante.filiere_module.length
        },
        { status: 400 }
      );
    }

    // Suppression
    await prisma.filieres.delete({
      where: { id_filiere: parseInt(id) }
    });

    return NextResponse.json(
      { message: "Filière supprimée avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}