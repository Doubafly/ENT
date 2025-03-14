import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const filiereModule = await prisma.filiereModule.findMany({
            where: { id_filiere: parseInt(params.id) },
            include: {
                module: true
            }
        });

        if (!filiereModule || filiereModule.length === 0) {
            return new Response(JSON.stringify({ message: "Aucun module trouvé" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "succes", filiereModule }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ message: "Une erreur est survenue" }), { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const {id_filiere_module, syllabus, id_module, id_filiere, code_module, volume_horaire}= await request.json();
        if (!id_filiere_module || !syllabus || !id_module || !id_filiere || !code_module || !volume_horaire) {
            return new Response(JSON.stringify({ message: "Paramètres manquants" }), { status: 400 });
        }
        const filiereModule = await prisma.filiereModule.update({
            where: { id_filiere_module: id_filiere_module },
            data: {
                syllabus,
                id_module,
                id_filiere,
                code_module,
                volume_horaire
            }
        });
        return new Response(JSON.stringify({ message: "succes", filiereModule }), { status: 200 });
    }
    catch (e) {
        return new Response(JSON.stringify({ message: "Une erreur est survenue" }), { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id_filiere_module } = await request.json();
        if (!id_filiere_module) {
            return new Response(JSON.stringify({ message: "Paramètres manquants" }), { status: 400 });
        }
        await prisma.filiereModule.delete({
            where: { id_filiere_module: id_filiere_module }
        });
        return new Response(JSON.stringify({ message: "succes" }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ message: "Une erreur est survenue" }), { status: 500 });
    }
}