import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionUser = req.cookies.get("session_user")?.value;

  if (!sessionUser) {
    return NextResponse.json({ error: "Aucune session active" }, { status: 401 });
  }

  return NextResponse.json(
    { message: "Utilisateur connecté", user: JSON.parse(sessionUser) },
    { status: 200 }
  );
}
