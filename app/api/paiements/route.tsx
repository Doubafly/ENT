import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";

export async function GET() {
  try {
    const paiements = await prisma.paiements.findMany({
      select: {
        id_paiement: true,
        montant: true,
        date_paiement: true,
        type_paiement: true,
        reference_paiement: true,
        etudiant: {
          select: {
            matricule: true,
            utilisateur: {
              select: {
                nom: true,
                prenom: true,
                email: true,
                telephone: true
              }
            },
            filiere:{
                select:{
                    nom:true,
                    niveau:true,
                    montant_annuel:true,
                    id_annexe:true,
                }
            }
          }
        }
      }
    });

    return NextResponse.json(
      { message: "Succès", paiements },
      { status: 200 }
    );
  } catch (e) {
    console.error("Erreur lors de la récupération des paiements :", e);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
    try {
      const { id_etudiant, montant, date_paiement, type_paiement, reference_paiement } = await request.json();
  
      // Vérification des paramètres obligatoires
      if (!id_etudiant || !montant || !date_paiement || !type_paiement || !reference_paiement) {
        return NextResponse.json(
          { message: "Tous les champs sont requis." },
          { status: 400 }
        );
      }
  
      // Création du paiement
      const paiement = await prisma.paiements.create({
        data: {
          id_etudiant,
          montant: parseFloat(montant), // Conversion du montant en nombre décimal
          date_paiement: new Date(date_paiement),
          type_paiement,
          reference_paiement
        }
      });
  
      return NextResponse.json(
        { message: "Paiement ajouté avec succès", paiement },
        { status: 200 }
      );
    } catch (e) {
      console.error("Erreur lors de l'ajout du paiement :", e);
      return NextResponse.json(
        { message: "Une erreur est survenue" },
        { status: 500 }
      );
    }
  } 