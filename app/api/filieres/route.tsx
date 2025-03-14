import prisma from "../prisma";

export async function GET() {
  try {
    const filieres = await prisma.filieres.findMany({
        include: {
            filiere_module: {
                include: {
                    module: true
                }
            }
        }
    });
    return new Response(JSON.stringify({message: "succes",filieres}), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: "Une erreur est survenue" }), { status: 500 });
}
}


export async function POST(request: Request) {
  try {
    const { nom, description, niveau, montant_annuel, id_annexe}= await request.json();
    if (!nom || !description || !niveau || !montant_annuel || !id_annexe) {
      return new Response(JSON.stringify({ message: "Paramètres manquants" }), { status: 400 });
    }
    const filiere = await prisma.filieres.create({
      data: {
        nom,
        description,
        niveau,
        montant_annuel,
        id_annexe
      }
    });
    return new Response(JSON.stringify({message: "succes",filiere}), { status: 201 });
  } catch (e) {
      return new Response(JSON.stringify({ message: "Une erreur est survenue" }), { status: 500 });   
    
  }
}
