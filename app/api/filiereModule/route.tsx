import prisma from "../prisma";

export async function GET() {
  try {
    const filiereModules = await prisma.filiereModule.findMany({
        include: {
            filiere: true,
            module: true,
            cours : true
        }
    });
    return new Response(JSON.stringify({message: "succes",filiereModules}), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: "Une erreur est survenue" }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { syllabus, id_module, id_filiere, volume_horaire, code_module } = await request.json();
    if (!syllabus || !id_module || !id_filiere || !volume_horaire || !code_module) {
      return new Response(JSON.stringify({ message: "Paramètres manquants" }), { status: 400 });
    }
    const filiereModule = await prisma.filiereModule.create({
      data: {
        syllabus,
        volume_horaire,
        code_module,
        module: {
          connect: { id_module: id_module }
        },
        filiere: {
          connect: { id_filiere: id_filiere }
        }
      }
    });
    return new Response(JSON.stringify({message: "succes",filiereModule}), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ message: "Une erreur est survenue" }), { status: 500 });
  }
}