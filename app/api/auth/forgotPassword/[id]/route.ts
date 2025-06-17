import prisma from "@/app/api/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// PUT : Mettre à jour un étudiant
export async function PUT(req: NextRequest) {
    try {
        const id = req.nextUrl.pathname.split("/").pop();
        const { mot_de_passe } = await req.json();
        console.log("ID de l'étudiant :", id);
        console.log("Mot de passe reçu :", mot_de_passe);
        
        // Vérifier que le mot de passe n'est pas vide
        let hashPass = mot_de_passe;
        if (mot_de_passe && mot_de_passe.trim() !== "") {
            hashPass = await bcrypt.hash(mot_de_passe, 10);
        } else {
            // Si le mot de passe est vide, ne pas tenter de le hacher
            console.warn("Mot de passe vide, le mot de passe ne sera pas modifié.");
        }

        await prisma.utilisateurs.update({
            where: { id_utilisateur: id ? parseInt(id) : 0 },
            data: {
                mot_de_passe: hashPass === "" ? undefined : hashPass,
            },
        });
        return NextResponse.json(
            {
                message: "Étudiant modifié avec succès",
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Erreur lors de la mise à jour de l'étudiant :", error);
        return NextResponse.json(
            { message: "Une erreur est survenue", erreur: error.message },
            { status: 500 }
        );
    }
}
