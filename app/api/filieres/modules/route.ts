import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
) {
  try {
 
    // Récupérer les données en parallèle
    const [ allModules, allsession,filiere,enseignants] = await Promise.all(
      [
        prisma.modules.findMany(), // Tous les modules disponibles
        prisma.sessions.findMany(),
        prisma.filieres.findMany({
          include: {
            annexe: {
              select: {
                nom: true,
                ville: true,
              },
            }, 
            filiere_module: {
              include: {
                cours: {
                  select: {
                    id_cours: true,
                    semestre: true,
                    enseignant: {
                      select: {
                        id: true,
                        specialite: true,
                        matricule: true,
                        utilisateur: {
                          select: {
                            id_utilisateur: true,
                            nom: true,
                            prenom: true,
                            mot_de_passe: true,
                            email: true,
                            sexe: true,
                            telephone: true,
                            adresse: true,
                            profil: true,
                            date_creation: true,
                          },
                        },
                      },
                    },
                    sessions: {
                      select: {
                        annee_academique: true,
                      },
                    },
                  },
                },
                module: {
                  select: {
                    nom: true,
                    description: true,
                  },
                },
              },
            },
            etudiants: {
              select: {
                id: true,
                matricule: true,
                date_inscription: true,
                date_naissance: true,
                utilisateur: {
                  select: {
                    id_utilisateur: true,
                    nom: true,
                    prenom: true,
                    email: true,
                    sexe: true,
                    profil: true,
                    telephone: true,
                    adresse: true,
                  },
                },
                notes: {
                  select: {
                    id_note: true,
                    note_class: true,
                    note_exam: true,
                    commentaire_etudiant: true,
                    commentaire_enseignant: true,
                    statut_reclamation: true,
                    statut_note: true
                  },
                },
              },
            },
          },
        }),
        prisma.enseignants.findMany(
          {
            include:{
              utilisateur:{
                select:{
                  id_utilisateur:true,
                  nom:true,
                  prenom:true
                }
              }
            }
          }
        )
      ]
    );
    // Formater la réponse
    const response = {
      allModules: allModules.map((m) => ({
        id_module: m.id_module,
        nom: m.nom,
        description: m.description || undefined,
      })),
      allsession:allsession,
      filiere:filiere,
      enseignants:enseignants.map((e)=>({
        nom: e.utilisateur.nom,
        prenom: e.utilisateur.prenom,
        id_utilisateur: e.utilisateur.id_utilisateur,
        id: e.id
      })),
    };

    return NextResponse.json(
      { message: "Données récupérées avec succès", data: response },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error fetching data:", e);
    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de la récupération des données",
        error: e instanceof Error ? e.message : "Erreur inconnue",

      },
      { status: 500 }
    );
  }
}
