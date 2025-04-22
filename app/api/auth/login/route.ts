import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation des champs
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe sont requis" },
        { status: 400 }
      );
    }

    // Recherche de l'utilisateur
    const user = await prisma.utilisateurs.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérification du mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Connexion réussie
    const reponse = NextResponse.json(
      { message: "Connexion réussie", user },
      { status: 200 }
    );

    reponse.cookies.set(
      "session_user",
      JSON.stringify({
        id: user.id_utilisateur,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        type: user.type,
        profil: user.profil,
      }),
      {
        httpOnly: true, // Sécurise le cookie
        secure: true, // Active HTTPS
        maxAge: 60 * 60 * 24, // Expiration : 1 jour
        path: "/",
      }
    );

    return reponse;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
