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
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isAnnexeOpen, setIsAnnexeOpen] = useState(false);
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [isParametreOpen, setIsParametreOpen] = useState(false);
  const [isFiliereOpen, setIsFiliereOpen] = useState(false);

  function handleRegisterSubmit(formData: FormData): Promise<void> {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex items-center p-3  rounded-xl mb-3 ">
      <div className="flex space-x-2">
        <button
          title="message"
          className="relative p-2 rounded-full bg-white shadow"
        >
          <MessageCircle className="w-5 h-5 text-gray-600" />
        </button>
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
          onCreateRole={() => setIsRoleOpen(true)}
          onCreateAnnexe={() => setIsAnnexeOpen(true)}
          onCreateModule={() => setIsModuleOpen(true)}
          onCreateFiliere={() => setIsFiliereOpen(true)}
        />
      </div>
      <div>
        <p className="text-lg font-bold">
          {" "}
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
      {/* Overlay et formulaire modal pour le role  avec boutton parametre*/}
      {isRoleOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-full"
          onClick={() => setIsRoleOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-3 shadow-lg lg:px-8 lg:py-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <FormulaireRole
              onSubmit={handleRegisterSubmit}
              onCancel={() => setIsRoleOpen(false)}
              title="Creation d'un Nouveau Role"
            />
          </div>
        </div>
      )}

      {/* Overlay et formulaire modal pour le Annexe  avec boutton parametre*/}
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
              onSubmit={handleRegisterSubmit}
              onCancel={() => setIsAnnexeOpen(false)}
              title="Creation d'une Nouvelle Annexe"
            />
          </div>
        </div>
      )}

      {/* Overlay et formulaire modal pour le Module avec bouton parametre */}
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
              onSubmit={handleRegisterSubmit}
              onCancel={() => setIsModuleOpen(false)}
              title="Creation d'un Nouveau Module"
            />
          </div>
        </div>
      )}

      {/* Overlay et formulaire modal pour la filiere avec bouton parametre */}
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
              onSubmit={handleRegisterSubmit}
              onCancel={() => setIsFiliereOpen(false)}
              title="Creation d'une Nouvelle Filiere"
            />
          </div>
        </div>
      )}

      {/* Overlay et ouvrage de la page parametre avec bouton parametre */}
      {isParametreOpen && <ParametrePage />}
    </div>
  );
}
