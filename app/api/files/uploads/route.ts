import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // 🔹 Récupération des données du formulaire envoyé dans la requête
    const {formData,id} = await req.json();
    
    // 🔹 Extraction du fichier depuis le formData
    const file = formData.get("file") as File;

    // 🔹 Vérification si un fichier a bien été fourni
    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // 🔹 Définition du chemin où le fichier sera enregistré (dossier public/uploads)
    const filePath = path.join(process.cwd(), "public/profil", file.name);

    // 🔹 Lecture du contenu du fichier en tant que ArrayBuffer (binaire)
    const fileBuffer = await file.arrayBuffer();

    // 🔹 Conversion de l'ArrayBuffer en Buffer pour pouvoir l'écrire sur le disque
    fs.writeFileSync(filePath, Buffer.from(fileBuffer));

    // 🔹 Réponse indiquant le succès du téléversement avec le nom du fichier
    return NextResponse.json(
      { message: "Fichier téléversé avec succès", file: file.name },
      { status: 200 }
    );
  } catch (error) {
    // 🔹 Gestion des erreurs en cas de problème lors du téléversement
    return NextResponse.json(
      { error: "Erreur lors du téléversement" },
      { status: 500 }
    );
  }
}
