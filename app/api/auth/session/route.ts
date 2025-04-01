import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const sessionUser = req.cookies.get("session_user")?.value;

  if (!sessionUser) {
    return NextResponse.json({ error: "Aucune session active" }, { status: 401 });
  }

  const user = JSON.parse(sessionUser);

  // Récupérer les informations de l'utilisateur avec les relations enseignant et étudiant
  const utilisateur = await prisma.utilisateurs.findUnique({
    where: { id_utilisateur: user.id },
    include: { 
      enseignant: true,  // Inclure la relation enseignant
      etudiant: true     // Inclure la relation étudiant
    }, 
  });

  if (!utilisateur) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Utilisateur connecté", user: utilisateur },
    { status: 200 }
  );
}