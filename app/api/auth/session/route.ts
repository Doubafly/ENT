import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const sessionUser = req.cookies.get("session_user")?.value;

  if (!sessionUser) {
    return NextResponse.json({ error: "Aucune session active" }, { status: 401 });
  }

  try {
    const user = JSON.parse(sessionUser);

    // Récupérer les informations complètes de l'utilisateur
    const utilisateur = await prisma.utilisateurs.findUnique({
      where: { id_utilisateur: user.id },
      include: { 
        enseignant: true,
        etudiant: true,
        admin: true // Ajout de la relation admin
      }
    });

    if (!utilisateur) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Structure de réponse améliorée
    const responseData = {
      message: "Utilisateur connecté",
      user: {
        ...utilisateur,
        isAdmin: !!utilisateur.admin, // Ajout d'un flag booléen
        adminId: utilisateur.admin?.id_admin // Ajout de l'ID admin si existe
      }
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}