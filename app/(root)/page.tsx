"use client";
import Modal from "@/components/modal/ModalBox";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    message: string;
    status: "success" | "error" | "info";
  } | null>(null);

  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true); // Déclenche l'animation de sortie
    }, 4000); // Commence à disparaître après 2,5 secondes
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });

        const data = await res.json();
        const user = data.user;

        if (user.type === "Admin") {
          router.push("/admin");
        } else if (user.type === "Enseignant") {
          router.push("/professeur");
        } else if (user.type === "etudiant") {
          router.push("/etudiant");
        } else {
          throw new Error("Type inconnu");
          // router.push("/sign-in");
        }
      } catch (error) {
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading)
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-500 ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className={`bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-lg shadow-lg relative w-[350px] transform transition-all duration-500 ${
            isExiting ? "scale-90" : "scale-100"
          }`}
        >
          <p className="text-center">Chargement en cours ...</p>
        </div>
      </div>
    );

  return (
    <div>
      {modal && <Modal message={modal.message} status={modal.status} />}
      <div>Page</div>
    </div>
  );
};

export default page;
