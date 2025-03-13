import prisma from "../prisma";
export async function GET() {
    try {
      const annexes = await prisma.annexes.findMany({
      });
      return new Response(JSON.stringify(annexes), { status: 200 });
    } catch (e) {
      return new Response(
        JSON.stringify({ message: "Une erreur est survenue" }),
        { status: 500 }
      );
    }
  }
