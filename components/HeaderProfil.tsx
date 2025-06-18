"use client";
import { useState } from "react";
import { Bell, MessageCircle } from "lucide-react";
import Image from "next/image";
import BoutonParametre from "./BouttonParametre";
import FormulaireRole from "./formulaires/FormulaireRole";
import FormulaireAnnexe from "./formulaires/FormulaireAnnexe";
import FormulaireModule from "./formulaires/FormulaireModule";
import ParametrePage from "@/app/(root)/admin/parametre/page";
import FormulaireFiliere from "./formulaires/FormulaireFiliere";
import FormulaireSession from "./formulaires/FormulaireSession";

interface UserProfileProps {
  user: {
    prenom: string;
    nom: string;
    type: string;
    profil?: string;
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  const [notificationCount, setNotificationCount] = useState(1);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isAnnexeOpen, setIsAnnexeOpen] = useState(false);
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [isParametreOpen, setIsParametreOpen] = useState(false);
  const [isFiliereOpen, setIsFiliereOpen] = useState(false);

  function handleRegisterSubmit(formData: FormData): Promise<void> {
    throw new Error("Function not implemented.");
  }

  function handleCreateSuccess(): void {
    // Au lieu de recharger toute la page
    // Vous pourriez rafraîchir seulement les données nécessaires
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  return (
    <div className="flex items-center p-3 rounded-xl mb-3">
      <div className="flex space-x-2">
        <button
          title="Notifiacation"
          className="relative p-2 rounded-full bg-white shadow"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {notificationCount}
            </span>
          )}
        </button>

        <BoutonParametre
          reglage={() => setIsParametreOpen(true)}
          onCreateSession={() => setIsSessionOpen(true)}
          onCreateAnnexe={() => setIsAnnexeOpen(true)}
          onCreateModule={() => setIsModuleOpen(true)}
          onCreateFiliere={() => setIsFiliereOpen(true)}
        />
      </div>
      <div>
        <p className="text-lg font-bold">
          {user.prenom} {user.nom}
        </p>
        <p className="text-gray-600">{user.type}</p>
      </div>
      <div className="w-10 h-10 bg-gray-300 rounded-full">
        {user.profil ? (
          <Image
            className="rounded-full w-full h-full"
            src={user.profil}
            width={100}
            height={100}
            title="Profil"
            alt="Profil"
          />
        ) : (
          <Image
            className="rounded-full w-full h-full"
            src={"/profils/default.jpg"}
            width={100}
            height={100}
            title="Profil"
            alt="Profil"
          />
        )}
      </div>

      {/* Modals */}
      {isSessionOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-full"
          onClick={() => setIsSessionOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-3 shadow-lg lg:px-8 lg:py-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <FormulaireSession
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsSessionOpen(false)}
              title="Creation d'un Nouveau Role"
            />
          </div>
        </div>
      )}

      {isAnnexeOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-full"
          onClick={() => setIsAnnexeOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-3 shadow-lg lg:px-8 lg:py-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <FormulaireAnnexe
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsAnnexeOpen(false)}
              title="Creation d'une Nouvelle Annexe"
            />
          </div>
        </div>
      )}

      {isModuleOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsModuleOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-3 shadow-lg lg:px-8 lg:py-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <FormulaireModule
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsModuleOpen(false)}
              title="Creation d'un Nouveau Module"
            /> 
          </div>
        </div>
      )}

      {isFiliereOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsFiliereOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-3 shadow-lg lg:px-8 lg:py-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <FormulaireFiliere
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsFiliereOpen(false)}
              title="Creation d'une Nouvelle Filiere"
            />
          </div>
        </div>
      )}

      {isParametreOpen && <ParametrePage />}
    </div>
  );
}