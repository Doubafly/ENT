// middleware.ts (à la racine ou dans /src)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // URLs publiques qu'on ne veut pas protéger
  const publicPaths = ["/sign-in", "/api/auth/session"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    // Vérifie la session via votre endpoint
    const sessionResponse = await fetch(
      new URL("/api/auth/session", request.nextUrl.origin),
      {
        credentials: "include",
        headers: { Cookie: request.headers.get("Cookie") || "" },
      }
    );

    if (!sessionResponse.ok) throw new Error("Session invalide");

    const { user } = await sessionResponse.json();

    // Redirection basée sur le type d'utilisateur pour la page d'accueil
    if (pathname === "/") {
      if (user.type === "Admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else if (user.type === "Enseignant") {
        return NextResponse.redirect(new URL("/professeur", request.url));
      } else if (user.type === "Etudiant") {
        return NextResponse.redirect(new URL("/etudiant", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Redirection vers /sign-in en cas d'erreur
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
