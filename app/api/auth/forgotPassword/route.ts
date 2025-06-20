import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validation des champs
    if (!email ) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    // Recherche de l'utilisateur avec les relations
    const user = await prisma.utilisateurs.findUnique({
      where: { email: email },
      include: {
        etudiant: true,
        enseignant: true,
        admin: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Construction de l'objet userInfo avec comparaison de type sécurisée
    const userInfo = {
      id: user.id_utilisateur,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      type: user.type,
      sexe: user.sexe,
      telephone: user.telephone,
      adresse: user.adresse,
      profil: user.profil,
      // Données spécifiques au type
      ...(user.type === 'Etudiant' && user.etudiant && {
        etudiant: {
          matricule: user.etudiant.matricule,
          date_naissance: user.etudiant.date_naissance,
          date_inscription: user.etudiant.date_inscription,
          id_filiere: user.etudiant.id_filiere,
        }
      }),
      ...(user.type === 'Enseignant' && user.enseignant && {
        enseignant: {
          matricule: user.enseignant.matricule,
          specialite: user.enseignant.specialite
        }
      }),
      ...(user.type === 'Admin' && user.admin && {
        admin: {
          id_admin: user.admin.id_admin
        }
      })
    };

    // Réponse avec les deux cookies
    const response = NextResponse.json(
      { message: "Connexion réussie", user: userInfo },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}