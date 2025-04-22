import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";

export async function GET() {
  try {
    const modules = await prisma.modules.findMany({
      select: {
        id_module: true,
        nom: true,
        description: true,
        // Ajout des attributs manquants
        filiere_module: {
          select: {
            code_module: true,
            coefficient: true,
            volume_horaire: true,
            filiere: {
              select: {
                nom: true,
                niveau: true,
              },
            },
          },
        }, 
      },
    });

    // Formatage des données pour correspondre à l'interface attendue
    const formattedModules = modules.map((module) => ({
      id_module: module.id_module,
      nom: module.nom,
      description: module.description || undefined,
      code_module: module.filiere_module[0]?.code_module || "",
      coefficient: module.filiere_module[0]?.coefficient || 1,
      volume_horaire: module.filiere_module[0]?.volume_horaire || undefined,
    }));

    return NextResponse.json(
      {
        message: "success",
        data: formattedModules,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error fetching modules:", e);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nom, description } = await request.json();
    if (!nom) {
      return NextResponse.json(
        { message: "Le nom du module est obligatoire" },
        { status: 400 }
      );
    }

    const module = await prisma.modules.create({
      data: {
        nom,
        description: description || null,
      },
    });

    return NextResponse.json(
      { message: "Module créé avec succès", data: module },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création du module" },
      { status: 500 }
    );
  }
}