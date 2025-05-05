import prisma from "@/lib/prisma";
import { Document as PrismaDocument } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

  const data = await req.json();
  const { titre, description, est_actif, id_classe } = data;

  const existingDoc = await prisma.document.findUnique({ where: { id } });
  if (!existingDoc) return notFound("Document non trouvé");

  // Vérifie l’unicité du titre dans la même classe
  if (titre && titre !== existingDoc.titre) {
    const duplicate = await prisma.document.findFirst({
      where: {
        titre,
        id_classe: id_classe ?? existingDoc.id_classe,
        NOT: { id },
      },
    });
    if (duplicate) {
      return conflict(
        "Un document avec ce titre existe déjà dans cette classe"
      );
    }
  }

  const updated = await prisma.document.update({
    where: { id },
    data: {
      titre: titre ?? existingDoc.titre,
      description: description ?? existingDoc.description,
      est_actif: est_actif ?? existingDoc.est_actif,
      id_classe: id_classe ?? existingDoc.id_classe,
    },
    select: selectOptions,
  });

  return ok("Document mis à jour", updated);
}

// ❌ DELETE /api/documents/:id
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
