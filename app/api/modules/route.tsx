import { NextRequest, NextResponse} from "next/server";
import prisma from "../prisma";

export async function GET() {
  try {
    const modules = await prisma.modules.findMany({
      include: {
        filiere_module: {
          include: {
            filiere: {
              select:{
                nom: true,
                niveau: true,
                montant_annuel: true,
              },
            }, 
          },
        },
      },
    });
    return  NextResponse.json({ message: "succes", modules }, {
      status: 200,
    });
  } catch (e) {
    return  NextResponse.json({ message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nom, description } = await request.json();
    if (!nom || !description) {
      return  NextResponse.json({ message: "Paramètres manquants" }, {
        status: 400,
      });
    }
    const module = await prisma.modules.create({
      data: {
        nom,
        description,
      },
    });
    return  NextResponse.json({ message: "succes", module }, {
      status: 201,
    });
  } catch (error) {
    return  NextResponse.json({ message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}