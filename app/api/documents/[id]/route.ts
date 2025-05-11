import prisma from "@/lib/prisma";
import { Document as PrismaDocument } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Types pour une meilleure lisibilité
type DocumentWithRelations = PrismaDocument & {
  uploader: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  filiere: {
    id: number;
    nom: string;
    code_filiere: string;
  };
};

// Champs sélectionnés pour toutes les opérations
const selectOptions = {
  id: true,
  titre: true,
  description: true,
  chemin_fichier: true,
  type_fichier: true,
  taille_fichier: true,
  date_upload: true,
  est_actif: true,
  uploader: {
    select: {
      id: true,
      nom: true,
      prenom: true,
      email: true,
    },
  },
  filiere: {
    select: {
      id: true,
      nom: true,
      code_filiere: true,
    },
  },
};

// ✅ GET /api/documents/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) return badRequest("ID invalide");

  const document = await prisma.document.findUnique({
    where: { id },
    select: selectOptions,
  });

  return document
    ? ok("Document trouvé", document)
    : notFound("Document introuvable");
}

// ✏️ PUT /api/documents/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) return badRequest("ID invalide");

  try {
    const formData = await req.formData();
    
    const titre = formData.get("titre");
    const description = formData.get("description");
    const id_uploader = formData.get("id_uploader");
    const id_classe = formData.get("id_classe");
    const file = formData.get("file");

    // Validation des types
    if (typeof titre !== "string" || 
        typeof id_uploader !== "string" || 
        typeof id_classe !== "string") {
      return badRequest("Type de données invalide");
    }

    // Conversion et validation
    const uploaderId = parseInt(id_uploader);
    const classeId = parseInt(id_classe);
    
    if (isNaN(uploaderId) || isNaN(classeId) || !titre) {
      return badRequest("Champs requis manquants ou invalides");
    }

    const existingDoc = await prisma.document.findUnique({ where: { id } });
    if (!existingDoc) return notFound("Document non trouvé");

    // Vérifier l'unicité du titre dans la même classe
    if (titre !== existingDoc.titre || classeId !== existingDoc.id_classe) {
      const duplicate = await prisma.document.findFirst({
        where: {
          titre,
          id_classe: classeId,
          NOT: { id },
        },
      });
      if (duplicate) {
        return conflict("Un document avec ce titre existe déjà dans cette classe");
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      titre,
      description: typeof description === "string" ? description : null,
      id_uploader: uploaderId,
      id_classe: classeId,
    };

    // Gestion du fichier si fourni
    if (file && file instanceof Blob) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "documents");
      const fileName = `${id}_${(file as File).name}`;
      const filePath = path.join(uploadDir, fileName);

      // Créer le répertoire si inexistant
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Supprimer l'ancien fichier s'il existe
      if (existingDoc.chemin_fichier) {
        const oldFilePath = path.join(process.cwd(), "public", existingDoc.chemin_fichier);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Conversion en buffer et écriture
      const buffer = Buffer.from(await (file as File).arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      // Ajouter les infos du fichier
      updateData.chemin_fichier = `/uploads/documents/${fileName}`;
      updateData.type_fichier = (file as File).type;
      updateData.taille_fichier = (file as File).size;
    }

    const updated = await prisma.document.update({
      where: { id },
      data: updateData,
    });

    return ok("Document mis à jour", updated);
  } catch (error) {
    console.error("Erreur PUT /api/documents:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la mise à jour du document",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) return badRequest("ID invalide");

  const existing = await prisma.document.findUnique({ where: { id } });
  if (!existing) return notFound("Document non trouvé");

  await prisma.document.delete({ where: { id } });
  return ok("Document supprimé");
}

// 📦 Fonctions utilitaires pour réponses standardisées
function ok(message: string, data?: any) {
  return NextResponse.json({ success: true, message, data }, { status: 200 });
}

function badRequest(error: string) {
  return NextResponse.json(
    { success: false, message: "Requête invalide", error },
    { status: 400 }
  );
}

function notFound(error: string) {
  return NextResponse.json(
    { success: false, message: "Introuvable", error },
    { status: 404 }
  );
}

function conflict(error: string) {
  return NextResponse.json(
    { success: false, message: "Conflit", error },
    { status: 409 }
  );
}
