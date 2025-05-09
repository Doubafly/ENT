import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Récupération des champs
    const titre = formData.get("titre");
    const description = formData.get("description");
    const id_uploader = formData.get("id_uploader");
    const id_classe = formData.get("id_classe");
    const file = formData.get("file");

    // Validation des types
    if (typeof titre !== "string" || 
        typeof id_uploader !== "string" || 
        typeof id_classe !== "string") {
      return NextResponse.json(
        { success: false, message: "Type de données invalide" },
        { status: 400 }
      );
    }

    // Conversion et validation
    const uploaderId = parseInt(id_uploader);
    const classeId = parseInt(id_classe);
    
    if (isNaN(uploaderId) || isNaN(classeId) || !titre) {
      return NextResponse.json(
        { success: false, message: "Champs requis manquants ou invalides" },
        { status: 400 }
      );
    }

    // Vérifier que la filière_module existe
    const filiereModule = await prisma.filiereModule.findUnique({
      where: { id_filiere_module: classeId },
    });

    if (!filiereModule) {
      return NextResponse.json(
        { success: false, message: "La classe spécifiée n'existe pas" },
        { status: 400 }
      );
    }

    // Vérifier l'unicité du titre dans la même classe
    const existingDoc = await prisma.document.findFirst({
      where: {
        titre,
        id_classe: classeId,
      },
    });

    if (existingDoc) {
      return NextResponse.json(
        { success: false, message: "Un document avec ce titre existe déjà dans cette classe" },
        { status: 409 }
      );
    }

    // Création du document
    const newDocument = await prisma.document.create({
      data: {
        titre,
        description: typeof description === "string" ? description : null,
        id_uploader: uploaderId,
        id_classe: classeId,
        chemin_fichier: "", // Temporaire
        est_actif: true,
      },
    });

    // Gestion du fichier
    if (file && file instanceof Blob) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "documents");
      const fileName = `${newDocument.id}_${(file as File).name}`;
      const filePath = path.join(uploadDir, fileName);

      // Créer le répertoire si inexistant
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Conversion en buffer et écriture
      const buffer = Buffer.from(await (file as File).arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      // Mise à jour du document avec les infos du fichier
      await prisma.document.update({
        where: { id: newDocument.id },
        data: {
          chemin_fichier: `/uploads/documents/${fileName}`,
          type_fichier: (file as File).type,
          taille_fichier: (file as File).size,
        },
      });
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Document créé avec succès",
        data: { id: newDocument.id }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur POST /api/documents:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la création du document",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// GET reste inchangé