"use client";
import Modal from "@/components/modal/ModalBox";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DeconnexionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    message: string;
    status: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    const deconnexion = async () => {
      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
        });

        if (response.ok) {
          setModal({ message: "Déconnexion validée", status: "error" });

          setTimeout(() => {
            router.push("/");
          }, 3000); // Redirige après 3s
        } else {
          throw new Error("Erreur lors de la déconnexion");
        }
      } catch (error) {
        setModal({ message: "Erreur", status: "error" });

        setTimeout(() => {
          router.push("/sign-in");
        }, 3000); // Redirige après 3s
      } finally {
        setLoading(false);
      }
    };

    deconnexion();
  }, [router]);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      {modal && <Modal message={modal.message} status={modal.status} />}
      <div>Page</div>
    </div>
  );
}
