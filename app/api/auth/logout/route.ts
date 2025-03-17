import { NextResponse } from "next/server";

export async function POST() {
  const reponse = NextResponse.json(
    { message: "Déconnexion réussie" },
    { status: 200 }
  );

  reponse.cookies.set("session_user", "", {
    httpOnly: true,
    secure: true,
    maxAge: 0, // Expiration immédiate
    path: "/",
  });

  return reponse;
}
