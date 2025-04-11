import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
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

    // Vérifier si la filière existe
    const filiereExists = await prisma.filieres.findUnique({
      where: { id_filiere: filiereId },
    });

    if (!filiereExists) {
      return NextResponse.json(
        { message: "Filière non trouvée" },
        { status: 404 }
      );
    }

    // Récupérer les enseignants depuis l'API spécifique
    const enseignantsResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/utilisateurs/enseignants`);
    if (!enseignantsResponse.ok) {
      throw new Error("Erreur lors de la récupération des enseignants");
    }
    const enseignantsData = await enseignantsResponse.json();

    // Récupérer les modules associés à la filière
    const filiereModules = await prisma.filiereModule.findMany({
      where: { id_filiere: filiereId },
      include: {
        module: true,
        // Removed 'enseignants' as it is not a valid property in 'include'
      }
    });

    // Formater la réponse
    const response = {
      filiere: {
        id: filiereExists.id_filiere,
        nom: filiereExists.nom,
        niveau: filiereExists.niveau
      },
      modules: filiereModules.map(fm => ({
        id_filiere_module: fm.id_filiere_module,
        module: {
          id_module: fm.module.id_module,
          nom: fm.module.nom,
          description: fm.module.description
        },
        coefficient: fm.coefficient,
        volume_horaire: fm.volume_horaire,
        code_module: fm.code_module,
        // enseignants property removed as it does not exist on filiereModules
      })),
      enseignants: enseignantsData.utilisateurs.map((e: any) => ({
        id: e.id,
        nom: e.utilisateur.nom,
        prenom: e.utilisateur.prenom,
        specialite: e.specialite
      }))
    };

    return NextResponse.json(
      { message: "Données récupérées avec succès", data: response },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error fetching data:", e);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération des données" },
      { status: 500 }
    );
  }
}

// POST /api/filieres/[id]/modules - Ajoute un module à une filière
export async function POST(
  request: NextRequest,
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

    const {
      nom,
      description,
      coefficient,
      volume_horaire,
      code_module,
      enseignants
    } = await request.json();

    // Validation des données
    if (!nom || !coefficient) {
      return NextResponse.json(
        { message: "Le nom et le coefficient sont obligatoires" },
        { status: 400 }
      );
    }

    // Transaction pour garantir l'intégrité des données
    const result = await prisma.$transaction(async (tx) => {
      // Créer le module
      const module = await tx.modules.create({
        data: {
          nom,
          description: description || null
        }
      });

      // Créer l'association filière-module
      const filiereModule = await tx.filiereModule.create({
        data: {
          id_filiere: filiereId,
          id_module: module.id_module,
          coefficient: coefficient,
          volume_horaire: volume_horaire || null,
          code_module: code_module || `MOD-${module.id_module}-${filiereId}`,
          // Removed 'enseignants' as it is not a valid property in the Prisma schema
        },
        include: {
          module: true,
          // Removed 'enseignants' as it is not a valid property in the Prisma schema
        }
      });

      return filiereModule;
    });

    return NextResponse.json(
      { 
        message: "Module ajouté avec succès", 
        data: result 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding module:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'ajout du module" },
      { status: 500 }
    );
  }
}