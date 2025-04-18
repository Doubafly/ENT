import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du formulaire
    const formData = await request.formData();
    const file = formData.get("image");
    const userId = formData.get("userId");

    if (!file || !userId) {
      return NextResponse.json(
        { message: "No file or user ID provided" },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique basé sur l'ID de l'utilisateur
    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Invalid file type" },
        { status: 400 }
      );
    }
    const fileExt = path.extname(file.name);
    const fileName = `${userId}${fileExt}`;
    const filePath = path.join(process.cwd(), "public", "profils", fileName);

    // Convertir le fichier en buffer et l'écrire dans le dossier public
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Mettre à jour le profil de l'utilisateur dans la base de données
    await prisma.utilisateurs.update({
      where: { id_utilisateur: parseInt(userId as string) }, // Assurez-vous que l'ID est un nombre
      data: { profil: `/profils/${fileName}` },
    });

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        filePath: `/profils/${fileName}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
