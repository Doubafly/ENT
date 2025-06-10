import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// POST: Créer une nouvelle entrée ForgotPassword
export async function POST(req: NextRequest) {
  const { email, token, expiresAt } = await req.json();

  try {
    const forgotPassword = await prisma.forgotPassword.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });
    return NextResponse.json(forgotPassword, { status: 201 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: 'Erreur lors de la création.' }, { status: 500 });
  }
}

// GET: Récupérer une entrée ForgotPassword par token
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token requis.' }, { status: 400 });
  }

  try {
    const forgotPassword = await prisma.forgotPassword.findUnique({
      where: { token },
    });

    if (!forgotPassword) {
      return NextResponse.json({ error: 'Entrée non trouvée.' }, { status: 404 });
    }

    return NextResponse.json(forgotPassword, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération.' }, { status: 500 });
  }
}
