import prisma from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id_cours, jour, heure_debut, heure_fin, salle } = await request.json();
    const id_emploi = params.id;

    if (!id_emploi || isNaN(parseInt(id_emploi))) {
      return NextResponse.json(
        { message: "ID invalide ou manquant" },
        { status: 400 }
      );
    }

    const emploiMisAJour = await prisma.emploisDuTemps.update({
      where: { id_emploi: parseInt(id_emploi) },
      data: {
        id_cours,
        jour,
        heure_debut: new Date(heure_debut),
        heure_fin: new Date(heure_fin),
        salle
      }
    });

    return NextResponse.json(
      { message: "Succès", emploi: emploiMisAJour },
      { status: 200 }
    );
  } catch (e) {
    console.error("Erreur lors de la mise à jour de l'emploi du temps :", e);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}


  
  
export async function DELETE(request: NextRequest,  { params }: { params: { id: string } }) {
    try {
      // Extraction de l'ID depuis l'URL
      // const id_emploi = request.nextUrl.pathname.split("/").pop();
      const id_emploi = params.id;
      // Vérification si l'ID est valide
      if (!id_emploi || isNaN(parseInt(id_emploi))) {
        return NextResponse.json(
          { message: "ID invalide ou manquant" },
          { status: 400 }
        );
      }
  
      // Vérification de l'existence de l'emploi du temps
      const emploiExiste = await prisma.emploisDuTemps.findUnique({
        where: { id_emploi: parseInt(id_emploi) }
      });
  
      if (!emploiExiste) {
        return NextResponse.json(
          { message: "L'emploi du temps n'existe pas" },
          { status: 404 }
        );
      }
  
      // Suppression de l'emploi du temps
      await prisma.emploisDuTemps.delete({
        where: { id_emploi: parseInt(id_emploi) }
      });
  
      return NextResponse.json(
        { message: "Emploi du temps supprimé avec succès" },
        { status: 200 }
      );
    } catch (e) {
      console.error("Erreur lors de la suppression :", e);
      return NextResponse.json(
        { message: "Une erreur est survenue" },
        { status: 500 }
      );
    }
  }



export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      // Extraction de l'ID depuis l'URL
      // const id_emploi = request.nextUrl.pathname.split("/").pop();
  const id_emploi = params.id;
      // Vérification si l'ID est valide
      if (!id_emploi || isNaN(parseInt(id_emploi))) {
        return NextResponse.json(
          { message: "ID invalide ou manquant" },
          { status: 400 }
        );
      }
  
      // Recherche de l'emploi du temps avec ses relations
      const emploiDuTemps = await prisma.emploisDuTemps.findUnique({
        where: { id_emploi: parseInt(id_emploi) },
        select: {
          jour: true,
          heure_debut: true,
          heure_fin: true,
          salle: true,
          cours: {
            select: {
              id_cours: true,
              semestre: true,
              filiere_module: {
                select: {
                  filiere: { select: { nom: true } },
                  module: { select: { nom: true } }
                }
              },
              enseignant: {
                select: {
                  utilisateur: {
                    select: {
                      nom: true,
                      prenom: true,
                      telephone: true
                    }
                  }
                }
              }
            }
          }
        }
      });
  
      // Vérification si l'emploi du temps existe
      if (!emploiDuTemps) {
        return NextResponse.json(
          { message: "L'emploi du temps n'existe pas" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: "Succès", emploiDuTemps },
        { status: 200 }
      );
    } catch (e) {
      console.error("Erreur lors de la récupération :", e);
      return NextResponse.json(
        { message: "Une erreur est survenue" },
        { status: 500 }
      );
    }
  }