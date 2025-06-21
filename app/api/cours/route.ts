import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id_filiere_module, id_professeur, id_sessions, semestre } =
      await request.json();

    // Validation des champs
    const missingFields = [];
    if (!id_filiere_module) missingFields.push("id_filiere_module");
    if (!id_professeur) missingFields.push("id_professeur");
    if (!id_sessions) missingFields.push("id_sessions");
    if (!semestre) missingFields.push("semestre");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message:
            "Tous les champs sont obligatoires" + missingFields.join(", "),
        },
        { status: 400 }
      );
    }
    // Vérification des relations
    const [filiereModuleExists, professeurExists, sessionExists] =
      await Promise.all([
        prisma.filiereModule.findUnique({ where: { id_filiere_module } }),
        prisma.enseignants.findUnique({ where: { id: id_professeur } }),
        prisma.sessions.findUnique({ where: { id_sessions } }),
      ]);

    if (!filiereModuleExists) {
      return NextResponse.json(
        { message: "L'association filière-module spécifiée n'existe pas" },
        { status: 404 }
      );
    }

    if (!professeurExists) {
      return NextResponse.json(
        { message: "L'enseignant spécifié n'existe pas" },
        { status: 404 }
      );
    }

    if (!sessionExists) {
      return NextResponse.json(
        { message: "La session spécifiée n'existe pas" },
        { status: 404 }
      );
    }

    // Vérification des doublons
    const existingCours = await prisma.cours.findFirst({
      where: {
        id_filiere_module,
        id_sessions,
        semestre,
      },
    });

    if (existingCours) {
      return NextResponse.json(
        {
          message: "Un cours identique existe déjà pour cette combinaison",
          data: existingCours,
        },
        { status: 409 }
      );
    }

    // Création du cours
    const cours = await prisma.cours.create({
      data: {
        id_filiere_module,
        id_professeur,
        id_sessions,
        semestre,
      },
      include: {
        filiere_module: {
          include: {
            module: true,
          },
        },
        sessions: true,
        enseignant: {
          include: {
            utilisateur: true,
          },
        },
      },
    });

    // Formater la réponse
    const response = {
      id_cours: cours.id_cours,
      semestre: cours.semestre,
      id_filiere_module: cours.id_filiere_module,
      filiere_module: {
        code_module: cours.filiere_module.code_module,
        volume_horaire: cours.filiere_module.volume_horaire,
        coefficient: cours.filiere_module.coefficient,
      },
      module: {
        id_module: cours.filiere_module.module.id_module,
        nom: cours.filiere_module.module.nom,
      },
      sessions: {
        id_sessions: cours.sessions.id_sessions,
        annee_academique: cours.sessions.annee_academique,
      },
      enseignant: {
        id: cours.enseignant.id,
        nom: cours.enseignant.utilisateur.nom,
        prenom: cours.enseignant.utilisateur.prenom,
      },
    };

    return NextResponse.json(
      {
        message: "Cours créé avec succès",
        data: response,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du cours:", error);

    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de la création du cours",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}



export async function GET() {
  try {
    const cours = await prisma.cours.findMany({
      select: {
        id_cours: true,
        semestre: true,
        filiere_module: {
          select: {
            code_module: true,
            volume_horaire: true,
            coefficient: true,
            documents: {
          select: {
            id: true,
            titre: true,
            description: true,
            chemin_fichier: true,
            type_fichier: true,
            taille_fichier: true,
            date_upload: true,
            est_actif: true,
            id_uploader: true,
            uploader: {
              select: {
                id_utilisateur: true,
                nom: true,
                prenom: true,
              },
            },
          },
        },
            filiere: {
              select: {
                id_filiere: true,
                nom: true,
                description: true,
                niveau: true,
                montant_annuel: true,
                id_annexe: true,
                etudiants: {
                  select: {
                    id: true,
                    matricule: true,
                    notes: {
                      select: {
                        id_note: true,
                        note_exam: true,
                        note_class: true,
                        id_etudiant: true,
                        commentaire_enseignant: true,
                      },
                    },
                    utilisateur: {
                      select: {
                        id_utilisateur: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        sexe: true,
                      },
                    },
                  },
                },
              },
            },
            module: {
              select: {
                id_module: true,
                nom: true,
              },
            },
            documents: {
              select: {
                id: true,
                titre: true,
                description: true,
                chemin_fichier: true,
                type_fichier: true,
                taille_fichier: true,
                date_upload: true,
                est_actif: true,
                id_uploader: true,
                uploader: {
                  select: {
                    id_utilisateur: true,
                    nom: true,
                    prenom: true,
                  },
                },
              },
            },
          },
        },
        enseignant: {
          select: {
            id: true,
            specialite: true,
            utilisateur: {
              select: {
                id_utilisateur: true,
                nom: true,
                prenom: true,
                email: true,
                sexe: true,
                telephone: true,
              },
            },
          },
        },
        sessions: {
          select: {
            annee_academique: true,
          },
        },
        notes: {
          select: {
            id_note: true,
            note_exam: true,
            note_class: true,
            commentaire_enseignant: true,
            statut_reclamation: true,
            commentaire_etudiant: true,
            etudiant: {
              select: {
                id: true,
                matricule: true,
              },
            },
          },
        },
        Absences: {
          select: {
            id_absence: true,
            date_absence: true,
            motif: true,
            utilisateur: {
              select: {
                id_utilisateur: true,
                nom: true,
                prenom: true,
              },
            },
          },
        },
        
      },
    });

    return NextResponse.json(
      { message: "Cours récupérés avec succès", cours },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Une erreur est survenue",
        erreur: e instanceof Error ? e.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
