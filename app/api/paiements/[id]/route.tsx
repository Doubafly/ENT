import prisma from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
      const { id_etudiant, montant, date_paiement, type_paiement, reference_paiement } = await request.json();
      const id = request.nextUrl.pathname.split("/").pop(); // Récupération de l'ID depuis l'URL
  
      // Vérification des paramètres obligatoires
      if (!id || !id_etudiant || !montant || !date_paiement || !type_paiement || !reference_paiement) {
        return NextResponse.json(
          { message: "Tous les champs sont requis." },
          { status: 400 }
        );
      }
  
      // Vérification de l'existence du paiement
      const paiementExistant = await prisma.paiements.findUnique({
        where: { id_paiement: parseInt(id) }
      });
  
      if (!paiementExistant) {
        return NextResponse.json(
          { message: "Paiement non trouvé." },
          { status: 404 }
        );
      }
  
      // Mise à jour du paiement
      const paiement = await prisma.paiements.update({
        where: { id_paiement: parseInt(id) },
        data: {
          id_etudiant,
          montant: parseFloat(montant), // Conversion du montant en nombre décimal
          date_paiement: new Date(date_paiement),
          type_paiement,
          reference_paiement
        }
      });
  
      return NextResponse.json(
        { message: "Paiement mis à jour avec succès", paiement },
        { status: 200 }
      );
    } catch (e) {
      console.error("Erreur lors de la mise à jour du paiement :", e);
      return NextResponse.json(
        { message: "Une erreur est survenue lors de la mise a jour du paiement" },
        { status: 500 }
      );
    }
  }



export async function DELETE(request: NextRequest) {
    try {
      const id = request.nextUrl.pathname.split("/").pop(); // Récupération de l'ID depuis l'URL
  
      // Vérification de l'ID
      if (!id) {
        return NextResponse.json(
          { message: "L'ID du paiement est requis." },
          { status: 400 }
        );
      }
  
      // Vérification de l'existence du paiement
      const paiementExistant = await prisma.paiements.findUnique({
        where: { id_paiement: parseInt(id) }
      });
  
      if (!paiementExistant) {
        return NextResponse.json(
          { message: "Paiement non trouvé." },
          { status: 404 }
        );
      }
  
      // Suppression du paiement
      await prisma.paiements.delete({
        where: { id_paiement: parseInt(id) }
      });
  
      return NextResponse.json(
        { message: "Paiement supprimé avec succès." },
        { status: 200 }
      );
    } catch (e) {
      console.error("Erreur lors de la suppression du paiement :", e);
      return NextResponse.json(
        { message: "Une erreur est survenue lors de la suppression du paiement" },
        { status: 500 }
      );
    }
  }  


export async function GET(request: NextRequest) {
    try {
      const id = request.nextUrl.pathname.split("/").pop(); // Récupération de l'ID depuis l'URL
  
      if (!id) {
        return NextResponse.json(
          { message: "L'ID du paiement est requis." },
          { status: 400 }
        );
      }
  
      const paiement = await prisma.paiements.findUnique({
        where: { id_paiement: parseInt(id) },
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
                  telephone: true,
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
            },
          },
        },
      });
  
      if (!paiement) {
        return NextResponse.json(
          { message: "Paiement non trouvé." },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: "Succès", paiement },
        { status: 200 }
      );
    } catch (e) {
      console.error("Erreur lors de la récupération du paiement :", e);
      return NextResponse.json(
        { message: "Une erreur est survenue" },
        { status: 500 }
      );
    }
  }  