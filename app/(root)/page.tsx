"use client";
import { UserContext } from "@/changerUtilisateur/utilisateur";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const page = () => {
  const user = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    // Vérifie si le rôle est admin
    if (user.userRole === "admin") {
      router.push("/admin"); // Redirige vers la page admin
    } else if (user.userRole === "proffesseur") {
      router.push("/professeur");
    } else if (user.userRole === "etudiant") {
      router.push("/etudiant");
    } else {
      router.push("/login");
    }
  }, [router]);

  return <div>page</div>;
};

export default page;
