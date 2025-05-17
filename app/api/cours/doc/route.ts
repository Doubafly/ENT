import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Récupérer les filières modules avec leurs documents et les relations nécessaires
    const filiereModules = await prisma.filiereModule.findMany({
      include: {
        documents: {
          include: {
            uploader: true, // Inclure l'uploader du document
            classe: true, // Inclure la classe (FiliereModule)
          },
        },
        filiere: {
          include: {
            annexe: true,
          },
        },
        module: true,
        cours: {
          include: {
            sessions: true,
            enseignant: {
              include: {
                utilisateur: true,
              },
            },
          },
        },
      },
    });

    // Transformer les données pour correspondre à l'interface attendue
    const formattedDocuments = filiereModules.flatMap((fm) => {
      return fm.documents.map((doc) => {
        // Trouver le premier cours associé à ce filiereModule pour les infos complémentaires
        const relatedCourse = fm.cours[0]; // Prend le premier cours trouvé

        return {
          id: doc.id,
          titre: doc.titre,
          description: doc.description,
          chemin_fichier: doc.chemin_fichier,
          type_fichier: doc.type_fichier || "",
          taille_fichier: doc.taille_fichier || 0,
          id_uploader: doc.id_uploader,
          id_classe: fm.id_filiere_module,
          utilisateur: doc.uploader
            ? {
                nom: doc.uploader.nom,
                prenom: doc.uploader.prenom,
                email: doc.uploader.email,
                telephone: doc.uploader.telephone || "",
              }
            : null,
          filiere: fm.filiere?.nom || null,
          id_filiere: fm.filiere.id_filiere,
          module: fm.module?.nom || null,
          session: relatedCourse?.sessions?.annee_academique || null,
          annexe: fm.filiere?.annexe?.nom || null,
          enseignant: relatedCourse?.enseignant
            ? `${relatedCourse.enseignant.utilisateur.prenom} ${relatedCourse.enseignant.utilisateur.nom}`
            : null,
        };
      });
    });

    return NextResponse.json(
      {
        message: "Documents récupérés avec succès",
        documents: formattedDocuments,
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { message: "Une erreur est survenue", erreur: e.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Une erreur inconnue est survenue" },
      { status: 500 }
    );
  }
}
